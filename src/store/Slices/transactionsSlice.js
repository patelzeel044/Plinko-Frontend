import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export const getTransactionsByUser = createAsyncThunk(
  "getTxByUser",
  async (
    { page = 1, limit = 5, type = "", status = "", sort = "-createdAt", dateFrom = "", dateTo = "" },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get("transaction", {
        params: { page, limit, type, status, sort, dateFrom, dateTo },
      });
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch transactions");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    page: 1,
    limit: 20,
    totalPages: 1,
    filters: {
      type: "",
      status: "",
      sort: "-createdAt",
      dateFrom: "",
      dateTo: "",
    },
    loading: false,
    error: null,
  },
  reducers: {
    setTxPage: (state, { payload }) => {
      state.page = payload;
    },
    setTxFilter: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionsByUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.transactions;
        state.page = payload.page;
        state.limit = payload.limit;
        state.totalPages = payload.totalPages;
      })
      .addCase(getTransactionsByUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
  },
});

export const { setTxPage, setTxFilter } = transactionsSlice.actions;
export default transactionsSlice.reducer;
