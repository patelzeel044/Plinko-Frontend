import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRows, setRisk, setSimulating, addOutcome } from '../../store/Slices/plinkoSlice';
import { completeRound, startRound } from '../../store/Slices/plinkoGSlice';
import { getWalletBalance } from '../../store/Slices/walletSlice';
import { 
  sinkMultiplierData,
  DECIMAL_MULTIPLIER, 
  WIDTH, 
  HEIGHT, 
  pad, 
  unpad, 
  gravity, 
  horizontalFriction, 
  verticalFriction
} from '../../utils/config';
import { unwrapResult } from '@reduxjs/toolkit';

export default function PlinkoGame() {
  const dispatch = useDispatch();
  const { rows, risk, simulating } = useSelector(state => state.plinko);
  const walletBalance = useSelector(state => state.wallet.balance);
  const currentRound = useSelector(state => state.plinkoG.currentRound);

  // Fetch wallet balance on mount

  const [mode, setMode] = useState('manual');
  const [betAmount, setBetAmount] = useState('1');
  const [numBets, setNumBets] = useState('0');

  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const obstaclesRef = useRef([]);
  const sinksRef = useRef([]);
  const spacingRef = useRef(795 / (rows + 0.5));
  const ballRRef = useRef(0);
  const obsRRef = useRef(0);

  useEffect(() => {
    dispatch(getWalletBalance());
  }, [dispatch,currentRound]);

  // layout & reset
  useEffect(() => {
    if (canvasRef.current?.__simId) {
      clearInterval(canvasRef.current.__simId);
      canvasRef.current.__simId = null;
      dispatch(setSimulating(false));
    }
    ballsRef.current = [];
    setMode('manual');

    const spacing = (spacingRef.current = 795 / (rows + 0.5));
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
    const lastRowY = (rows - 1) * spacing;
    const initialGap = HEIGHT - sinkWidth - lastRowY;
    const halfGap = initialGap / 2;
    const yPos = lastRowY + halfGap;

    for (let i = 0; i < count; i++) {
      const centerX = WIDTH / 2 + spacing * (i + 0.5 - count / 2);
      snks.push({ x: centerX, y: yPos, width: sinkWidth, height: sinkWidth, multiplier: mults[i] });
    }
    sinksRef.current = snks;
  }, [rows, risk, dispatch]);

 // let dispatchQueue = Promise.resolve();

  class Ball {
    constructor(roundId, x, y) {
      this.x = x; this.y = y;
      this.radius = ballRRef.current;
      this.vx = 0; this.vy = 0;
      this.roundId = roundId;
      this.initialX = x; this.landed = false;
    }
    update() {
      this.vy += gravity;
      this.x += this.vx; this.y += this.vy;

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
        if (!this.landed && unpad(this.x) > s.x - s.width/2 && unpad(this.x) < s.x + s.width/2 && unpad(this.y) + this.radius > s.y) {
               (async()=>{ 
                await dispatch(completeRound({ 
                roundId: this.roundId, 
                multiplier: s.multiplier 
                }))
                dispatch(getWalletBalance())
              })(); 

             /*  dispatchQueue = dispatchQueue.then(() => 
                new Promise(resolve => {
                  setTimeout(resolve, 200); // wait 300ms
                })
              ).then(async () => {
                await dispatch(completeRound({
                  roundId: this.roundId, 
                  multiplier: s.multiplier
                }));
                await dispatch(getWalletBalance());
              }); */

          dispatch(addOutcome({ index: i, value: this.initialX }));
          this.landed = true; this.vx = this.vy = 0;
        }
      });
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'red'; ctx.fill();
    }
  }

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    let id;
    const loop = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'white';
      obstaclesRef.current.forEach(o => {
        ctx.beginPath();
        ctx.arc(unpad(o.x), unpad(o.y), obsRRef.current, 0, Math.PI * 2);
        ctx.fill();
      });
      sinksRef.current.forEach(s => {
        ctx.fillStyle = 'green';
        ctx.fillRect(s.x - s.width/2, s.y, s.width, s.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(s.multiplier, s.x - s.width/2 + 5, s.y + 15);
      });
      ballsRef.current.forEach(b => { b.draw(ctx); b.update(); });
      ballsRef.current = ballsRef.current.filter(b => !b.landed);
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, [dispatch]);
 
  const addBall = async () => {
    const resultAction = await dispatch(startRound({ rows, riskLevel: risk, betAmount }));
    if(resultAction?.type === "plinko/start/fulfilled") dispatch(getWalletBalance())
    
    const {xDropPoint, _id} = unwrapResult(resultAction);
    //console.log(xDropPoint)
    //console.log(resultAction)
    if(xDropPoint) ballsRef.current.push(new Ball(_id, xDropPoint, pad(50)));
  }; 

  const toggleSim = () => {
    if (simulating) {
      clearInterval(canvasRef.current.__simId);
      canvasRef.current.__simId = null; dispatch(setSimulating(false));
    } else {
      const id = setInterval(addBall, 300);
      //console.log(id)
      canvasRef.current.__simId = id; dispatch(setSimulating(true));
    }
  };

  // lg:h-[calc(100vh-4rem)]
  return (
    <div className="flex flex-col lg:flex-row-reverse lg:h-[calc(100vh-6rem)] rounded-sm overflow-auto bg-gray-900">
      
      <div className="flex-1 flex items-center justify-center bg-black">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="relative w-full h-auto max-h-full rounded-lg bg-black"
        />
      </div>

      <aside className="w-full lg:w-80 h-auto max-h-full bg-gray-800 p-6 space-y-6">
        
        <div className="flex bg-gray-700 rounded-full p-1">
          {['manual','auto'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-full text-center font-medium transition-colors ${
                mode === m ? 'bg-green-500 text-white' : 'text-gray-300'
              }`}
            >
              {m === 'manual' ? 'Manual' : 'Auto'}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm text-gray-400">Bet Amount</label>
          <div className="mt-1 flex items-center bg-gray-700 rounded-lg overflow-hidden">
            <span className="px-1 text-gray-300">₹  </span>
            <input
              type="number"
              value={betAmount}
              max={walletBalance}
              onChange={e => setBetAmount(e.target.value)}
              className="flex-1 bg-transparent px-1 py-2 focus:outline-none text-white"
            />
            <button onClick={()=>(setBetAmount(betAmount/2))} className="px-1 border-l border-gray-600 text-gray-300">½x</button>
            <button onClick={()=>(setBetAmount(betAmount*2))} className="px-1 border-l border-gray-600 text-gray-300">2x</button>
          </div>
        </div>

        {/* Risk Select */}
        <div>
          <label className="block text-sm text-gray-400">Risk</label>
          <select
            value={risk}
            onChange={e => dispatch(setRisk(e.target.value))}
            className="mt-1 w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none"
          >
            {['LOW','MEDIUM','HIGH'].map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
  
        {/* Rows Select */}
        <div>
          <label className="block text-sm text-gray-400">Rows</label>
          <select
            value={rows}
            onChange={e => dispatch(setRows(+e.target.value))}
            className="mt-1 w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none"
          >
            {Array.from({ length: 9 }, (_, i) => i + 10).map(v => (
              <option key={v} value={v}>{v - 2} Rows</option>
            ))}
          </select>
        </div>
  
        {/* Number of Bets (only in auto mode) */}
       {/*  {mode === 'auto' && (
          <div>
             <div className="flex justify-between text-sm text-gray-400">
              <span>Number of Bets</span>
              <span>∞</span>
            </div> 
            <div className="mt-1 flex items-center bg-gray-700 rounded-lg overflow-hidden">
              <input
                type="number"
                value={numBets}
                onChange={e => setNumBets(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-white"
              />
              <button className="px-3 border-l border-gray-600 text-gray-300">∞</button>
            </div>
          </div>
        )} */}
  
        {/* Action Button */}
        <button
          onClick={mode === 'manual' ? addBall : toggleSim}
          className="w-full py-3 mt-4 text-lg font-bold rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
        >
          {mode === 'manual'
            ? 'Drop Ball'
            : simulating
            ? 'Stop Autobet'
            : 'Start Autobet'}
        </button>
      </aside>
    </div>
  );
}
