import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

export const getUsers = createAsyncThunk(
  "adminUsers/getUsers",
  async (
    {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      role = "",
      sort = "-createdAt",
      dateFrom = "",
      dateTo = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/admin/users", {
        params: {
          page,
          limit,
          search,
          status,
          role,
          sort,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        },
      });
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch users";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getUserById = createAsyncThunk(
  "admin/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/admin/users/${id}`);
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch user");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    user: null,
    list: [],
    page: 1,
    limit: 20,
    totalPages: 1,
    total: 0,
    filters: {
      search: "",
      status: "",
      role: "",
      sort: "-createdAt",
      dateFrom: "",
      dateTo: "",
    },
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    setFilter: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.users;
        state.page = payload.page;
        state.limit = payload.limit;
        state.totalPages = payload.totalPages;
        state.total = payload.total;
      })
      .addCase(getUsers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getUserById.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        state.loading = false; state.user = payload;
      })
      .addCase(getUserById.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload;
      })
  },
});

export const { setPage, setFilter } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
