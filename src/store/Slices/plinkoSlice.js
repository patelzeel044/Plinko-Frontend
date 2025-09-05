import { createSlice } from '@reduxjs/toolkit';

const createOutcomes = numRows =>
  Object.fromEntries(
    Array(numRows - 1).fill().map((_, i) => [i, []])
  );

const initialRows = 18;
const initialState = {
  rows: initialRows,
  risk: 'LOW',
  simulating: false,
  outcomes: createOutcomes(initialRows),
};

const plinkoSlice = createSlice({
  name: 'plinko',
  initialState,
  reducers: {
    setRows(state, action) {
      state.rows = action.payload;
      state.outcomes = createOutcomes(action.payload);
    },
    setRisk(state, action) {
      state.risk = action.payload;
      state.outcomes = createOutcomes(state.rows);
    },
    setSimulating(state, action) {
      state.simulating = action.payload;
    },
    addOutcome(state, action) {
      const { index, value } = action.payload;
      state.outcomes[index] = state.outcomes[index] || [];
      state.outcomes[index].push(value);
    },
  },
});

export const { setRows, setRisk, setSimulating, addOutcome } = plinkoSlice.actions;
export default plinkoSlice.reducer;