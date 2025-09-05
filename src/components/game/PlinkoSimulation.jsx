import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRows, setRisk, setSimulating, addOutcome } from '../../store/Slices/plinkoSlice';
import { sinkMultiplierData } from '../../utils/config';

const DECIMAL_MULTIPLIER = 10000;
const WIDTH = 800;
const HEIGHT = 800;
const pad = n => n * DECIMAL_MULTIPLIER;
const unpad = n => Math.floor(n / DECIMAL_MULTIPLIER);
const gravity = pad(0.45);
const horizontalFriction = 0.4;
const verticalFriction = 0.7;

export default function PlinkoSimulation() {
  const dispatch = useDispatch();
  const { rows, risk, simulating, outcomes } = useSelector(state => state.plinko);

  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const obstaclesRef = useRef([]);
  const sinksRef = useRef([]);
  const spacingRef = useRef(795 / (rows + 0.5));
  const ballRRef = useRef(0);
  const obsRRef = useRef(0);

  // regenerate layout & clear sim
  useEffect(() => {
    if (canvasRef.current?.__simId) {
      clearInterval(canvasRef.current.__simId);
      canvasRef.current.__simId = null;
      dispatch(setSimulating(false));
    }
    ballsRef.current = [];
    const spacing = (spacingRef.current = WIDTH / (rows + 0.5));
    ballRRef.current = spacing * 0.22;
    obsRRef.current = spacing * 0.12;

    // obstacles
    const obs = [];
    for (let r = 2; r < rows; r++) {
      const y = r * spacing;
      for (let c = 0; c < r + 1; c++) {
        const x = WIDTH / 2 - spacing * (r / 2 - c);
        obs.push({ x: pad(x), y: pad(y) });
      }
    }
    obstaclesRef.current = obs;

    // sinks
    const mults = sinkMultiplierData[rows]?.[risk] || [];
    const snks = [];
    const count = rows - 1;
    const sinkWidth = spacing - 2 * obsRRef.current;
    const sinkHeight = sinkWidth;
    const lastRowY = (rows - 1) * spacing;
    const initialGap = HEIGHT - sinkHeight - lastRowY;
    const halfGap = initialGap / 2;
    const yPos = lastRowY + halfGap;

    for (let i = 0; i < count; i++) {
      const centerX = WIDTH / 2 + spacing * (i + 0.5 - count / 2);
      snks.push({ x: centerX, y: yPos, width: sinkWidth, height: sinkHeight, multiplier: mults[i] });
    }
    sinksRef.current = snks;
  }, [rows, risk, dispatch]);

  // Ball class with dispatch
  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = ballRRef.current;
      this.vx = 0;
      this.vy = 0;
      this.initialX = x;
      this.landed = false;
    }
    update() {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;

      obstaclesRef.current.forEach(o => {
        const dist = Math.hypot(this.x - o.x, this.y - o.y);
        if (dist < pad(this.radius + obsRRef.current)) {
          const angle = Math.atan2(this.y - o.y, this.x - o.x);
          const speed = Math.hypot(this.vx, this.vy);
          this.vx = Math.cos(angle) * speed * horizontalFriction;
          this.vy = Math.sin(angle) * speed * verticalFriction;
          const overlap = this.radius + obsRRef.current - unpad(dist);
          this.x += pad(Math.cos(angle) * overlap);
          this.y += pad(Math.sin(angle) * overlap);
        }
      });

      sinksRef.current.forEach((s, i) => {
        if (
          unpad(this.x) > s.x - s.width / 2 &&
          unpad(this.x) < s.x + s.width / 2 &&
          unpad(this.y) + this.radius > s.y
        ) {
          if (!this.landed) {
            dispatch(addOutcome({ index: i, value: this.initialX }));
          }
          this.landed = true;
          this.vx = this.vy = 0;
        }
      });
    }
    draw(ctx) { 
      ctx.beginPath();
      ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }

  // render loop
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    let id;
    const loop = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'white';
      obstaclesRef.current.forEach(o => ctx.beginPath() || ctx.arc(unpad(o.x), unpad(o.y), obsRRef.current, 0, Math.PI * 2) || ctx.fill());
      sinksRef.current.forEach(s => {
        ctx.fillStyle = 'green';
        ctx.fillRect(s.x - s.width/2, s.y, s.width, s.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(s.multiplier.toFixed(1), s.x - s.width/2 + 5, s.y + 15);
      });
      ballsRef.current.forEach(b => { b.draw(ctx); b.update(); });
      ballsRef.current = ballsRef.current.filter(b => !b.landed);
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, [dispatch]);

  const addBall = async () => {
    try {
      const r = await fetch('http://localhost:3000/game', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rows, riskLevel: risk }) });
      const { point } = await r.json();
      ballsRef.current.push(new Ball(point, pad(50)));
    } catch {
      ballsRef.current.push(new Ball(pad(WIDTH/2 + (Math.random()-0.5)*20), pad(50)));
    }
  };
  

  const toggleSim = () => {
    if (simulating) {
      clearInterval(canvasRef.current.__simId);
      canvasRef.current.__simId = null;
      dispatch(setSimulating(false));
    } else {
      const id = setInterval(() => ballsRef.current.push(new Ball(pad(WIDTH / 2 - spacingRef.current + Math.random() * (2 * spacingRef.current)), pad(50))), 50);
      canvasRef.current.__simId = id;
      dispatch(setSimulating(true));
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-900 text-white p-4 overflow-auto font-mono text-sm">
        <h2 className="mb-2 text-lg">Outcomes</h2>
        <pre>{JSON.stringify(outcomes, null, 2)}</pre>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-gray-800 flex items-center space-x-4">
          <button onClick={addBall} className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600">
            Add Ball
          </button>
          <button onClick={toggleSim} className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600">
            {simulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          <select
            value={rows}
            onChange={e => dispatch(setRows(+e.target.value))}
            className="px-3 py-2 bg-gray-700 rounded"
          >
            {Array.from({ length: 9 }, (_, i) => i + 10).map(v => (
              <option key={v} value={v}>{v - 2} Rows</option>
            ))}
          </select>
          <select
            value={risk}
            onChange={e => dispatch(setRisk(e.target.value))}
            className="px-3 py-2 bg-gray-700 rounded"
          >
            {['LOW','MEDIUM','HIGH'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 p-4">
          <div className="relative w-full h-full" style={{ aspectRatio: '1 / 1' }}>
            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              className="w-full h-full bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  );  
}
