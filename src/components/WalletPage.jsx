import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getWalletBalance, depositFunds, withdrawFunds } from '../store/Slices/walletSlice';

export default function WalletPage() {
  const dispatch = useDispatch();
  const { balance, loading } = useSelector(s => s.wallet);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { dispatch(getWalletBalance()); }, [dispatch]);

  const onDeposit =async (data) => { dispatch(depositFunds(Number(data.deposit))); reset(); };
  const onWithdraw =async (data) => { dispatch(withdrawFunds(Number(data.withdraw))); reset(); };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4">Wallet</h1>
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <p>Available: <span className="font-bold">₹{balance}</span></p>
      </div>
      <form onSubmit={handleSubmit(onDeposit)} className="space-y-4 mb-6 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl">Deposit</h2>
        <input type="number" step="0.01" placeholder="Amount" {...register('deposit')} className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none" />
        <button type="submit" className="w-full py-2 bg-green-500 rounded-lg">Deposit</button>
      </form>
      <form onSubmit={handleSubmit(onWithdraw)} className="space-y-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl">Withdraw</h2>
        <input type="number" step="0.01" placeholder="Amount" {...register('withdraw')} className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none" />
        <button type="submit" className="w-full py-2 bg-red-500 rounded-lg">Withdraw</button>
      </form>
    </div>
  )
}
