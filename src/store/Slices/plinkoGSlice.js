import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  currentRound: null,
  list: [],
    page: 1,
    limit: 5,
    totalPages: 1,
    filters: {
      riskLevel: "",
      status: "",
      rows: "",
      sort: "-createdAt",
      dateFrom: "",
      dateTo: "",
    },
    loading: false,
    error: null,
};

export const startRound = createAsyncThunk('plinko/start', async (roundData) => {
  try {
    const response = await axiosInstance.post('/plinkoround/start', roundData);
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Game round failed');
    console.log(error.response?.data?.error || 'Game round failed');
    throw error;
  }
});

export const completeRound = createAsyncThunk(
  'plinko/complete',
  async ( roundId ) => {
    try {
      const response = await axiosInstance.post('/plinkoround/complete', roundId );
      toast.success(`Multiplier ${response.data.data.multiplier}x! Payout: ₹${response.data.data.payout}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete round');
      throw error;
    }
  }
);

export const pendingRound = createAsyncThunk(
  'plinko/pending',
  async ( ) => {
    try {
      const response = await axiosInstance.post('/plinkoround/pending');
      //console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      //toast.error(error.response?.data?.error || 'Failed to complete pending round');
      throw error;
    }
  }
);

export const getPlinkoRoundsByUser = createAsyncThunk(
  "getRoundsByUser",
  async (
    {
      page = 1,
      limit = 20,
      riskLevel = "",
      status = "",
      rows = "",
      sort = "-createdAt",
      dateFrom = "",
      dateTo = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get("/plinkoround/rounds", {
        params: { page, limit, riskLevel, status, rows, sort, dateFrom, dateTo },
      });
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch rounds");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


const plinkoGSlice = createSlice({
  name: 'plinko',
  initialState,
  reducers: {
    resetCurrentRound: (state) => {
      state.currentRound = null;
    },
    setRoundPage: (state, { payload }) => { state.page = payload; },
    setRoundFilter: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeRound.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRound.fulfilled, (state, action) => {
        state.loading = false;
        // Update specific round
        /* state.rounds = state.rounds.map(round => 
          round._id === action.payload._id ? action.payload : round
        ); */
        // Update current round if active
        if (state.currentRound?._id === action.payload._id) {
          state.currentRound = action.payload;
        }
      })
      .addCase(completeRound.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(pendingRound.pending, (state) => {
       
      })
      .addCase(pendingRound.fulfilled, (state, action) => {
       
      })
      .addCase(pendingRound.rejected, (state, action) => {
      })
      .addCase(getPlinkoRoundsByUser.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(getPlinkoRoundsByUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload.rounds;
        s.page = payload.page;
        s.limit = payload.limit;
        s.totalPages = payload.totalPages;
      })
      .addCase(getPlinkoRoundsByUser.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      });
  }
});

export const { resetCurrentRound,setRoundPage, setRoundFilter } = plinkoGSlice.actions;
export default plinkoGSlice.reducer;