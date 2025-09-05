import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";


export const getPlinkoRoundsByUser = createAsyncThunk(
  "admin/getRoundsByUser",
  async (
    {
      userId,
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
      const res = await axiosInstance.get("/admin/rounds", {
        params: { userId, page, limit, riskLevel, status, rows, sort, dateFrom, dateTo },
      });
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch rounds");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);
export const aGetPlinkoRounds = createAsyncThunk(
  "admin/getRounds",
  async (
    {
      page = 1,
      limit = 5,
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
      const res = await axiosInstance.get("/admin/rounds", {
        params: { page, limit, riskLevel, status, rows, sort, dateFrom, dateTo },
      });
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch rounds");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const roundsSlice = createSlice({
  name: "adminRounds",
  initialState: {
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
  },
  reducers: {
    setRoundPage: (state, { payload }) => { state.page = payload; },
    setRoundFilter: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(aGetPlinkoRounds.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(aGetPlinkoRounds.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.list = payload.rounds;
        s.page = payload.page;
        s.limit = payload.limit;
        s.totalPages = payload.totalPages;
      })
      .addCase(aGetPlinkoRounds.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      })
  },
});

export const { setRoundPage, setRoundFilter } = roundsSlice.actions;
export default roundsSlice.reducer;
