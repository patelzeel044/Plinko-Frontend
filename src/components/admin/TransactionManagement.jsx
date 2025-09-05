// src/pages/admin/Users.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    aGetTransactions,
  setTxFilter,
  setTxPage,
} from "../../store/Slices/AdminSlice/adminTransactionsSlice";

export default function TransactionManagement() {
  const dispatch = useDispatch();
    const {
      list,
      page,
      totalPages,
      filters: { type, status, sort, dateFrom, dateTo },
      loading,
      error,
    } = useSelector((s) => s.adminTx);
  
    // Fetch whenever any filter or page changes
    useEffect(() => {
      dispatch(
        aGetTransactions({ page, limit: 20, type, status, sort, dateFrom, dateTo })
      );
    }, [dispatch, page, type, status, sort, dateFrom, dateTo]);

  return (
    <div className="px-6 py-8 bg-[#0d1117] min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Transaction Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={type}
            onChange={(e) => dispatch(setTxFilter({ type: e.target.value }))}
            className="px-3 py-2 bg-gray-800 rounded"
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="bet">Bet</option>
            <option value="win">Win</option>
          </select>

          <select
            value={status}
            onChange={(e) => dispatch(setTxFilter({ status: e.target.value }))}
            className="px-3 py-2 bg-gray-800 rounded"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={sort}
            onChange={(e) => dispatch(setTxFilter({ sort: e.target.value }))}
            className="px-3 py-2 bg-gray-800 rounded"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => dispatch(setTxFilter({ dateFrom: e.target.value }))}
              className="px-3 py-2 bg-gray-800 rounded"
            />
            <label className="text-sm whitespace-nowrap">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => dispatch(setTxFilter({ dateTo: e.target.value }))}
              className="px-3 py-2 bg-gray-800 rounded"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-gray-900 rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800">
              <tr>
                {["Transaction ID", "Type", "Username", "Email", "Amount", "Updated Balance", "Status", "Created At"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No transactions
                  </td>
                </tr>
              ) : (
                list.map((tx) => (
                  <tr key={tx._id} className="odd:bg-gray-800 even:bg-gray-700">
                    <td className="px-4 py-2">{tx._id}</td>
                    <td className="px-4 py-2">{tx.type}</td>
                    <td className="px-4 py-2">{tx.user.username}</td>
                    <td className="px-4 py-2">{tx.user.email}</td>
                    <td className="px-4 py-2">₹{tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      ₹{tx.balanceAtTransaction.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{tx.status}</td>
                    <td className="px-4 py-2">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => dispatch(setTxPage(page - 1))}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => dispatch(setTxPage(page + 1))}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
