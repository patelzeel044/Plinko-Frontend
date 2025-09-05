import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  balance: 0,
  lockedBalance: 0,
  currency: "INR",
  loading: false,
  error: null,
};

export const getWalletBalance = createAsyncThunk('wallet/getBalance', async () => {
  try {
    const response = await axiosInstance.get('/wallet/balance');
    //console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    //toast.error(error.response?.data?.error || 'Failed to fetch balance');
    throw error;
  }
});

export const depositFunds = createAsyncThunk('wallet/deposit', async (amount=20) => {
  try {
    const response = await axiosInstance.post('/wallet/deposit', { amount });
    toast.success(`Deposited ₹${amount} successfully`);
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Deposit failed');
    throw error;
  }
});

export const withdrawFunds = createAsyncThunk('wallet/withdraw', async (amount) => {
  try {
    const response = await axiosInstance.post('/wallet/withdraw', { amount });
    toast.success(`Withdrawn ₹${amount} successfully`);
    return response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Withdrawal failed');
    throw error;
  }
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.available.toFixed(2);
        state.lockedBalance = action.payload.locked;
      })
      .addCase(getWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(depositFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.newBalance;
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(withdrawFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.newBalance;
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default walletSlice.reducer;