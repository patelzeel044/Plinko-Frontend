// src/components/admin/PlinkoRoundsDetail.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  aGetPlinkoRounds,
  setRoundFilter,
  setRoundPage,
} from "../../store/Slices/AdminSlice/adminPlinkoRoundsSlice";

export default function PlinkoRoundManagement() {
  const dispatch = useDispatch();
  const {
    list,
    page,
    totalPages,
    filters: { riskLevel, status, rows, sort, dateFrom, dateTo },
    loading,
    error,
  } = useSelector((s) => s.adminRounds);

  useEffect(() => {
    dispatch(
      aGetPlinkoRounds({
        page,
        limit: 20,
        riskLevel,
        status,
        rows,
        sort,
        dateFrom,
        dateTo,
      })
    );
  }, [dispatch, page, riskLevel, status, rows, sort, dateFrom, dateTo]);

  return (
    <div className="px-6 py-8 bg-[#0d1117] min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">PlinkoRound Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Risk */}
          <select
            value={riskLevel}
            onChange={(e) => dispatch(setRoundFilter({ riskLevel: e.target.value }))}
            className="px-3 py-2 bg-gray-800 rounded"
          >
            <option value="">All Risk Levels</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => dispatch(setRoundFilter({ status: e.target.value }))}
            className="px-3 py-2 bg-gray-800 rounded"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Rows */}
          <select
            value={rows}
            onChange={(e) => dispatch(setRoundFilter({ rows: e.target.value }))}
            className="px-3 py-2 bg-gray-800 rounded"
          >
            <option value="">All Rows</option>
            {Array.from({ length: 9 }, (_, i) => i + 10).map(v => (
                <option key={v} value={v}>{v - 2} Rows</option>
              ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => dispatch(setRoundFilter({ sort: e.target.value }))}
            className="px-3 py-2 bg-gray-800 rounded"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => dispatch(setRoundFilter({ dateFrom: e.target.value }))}
              className="px-3 py-2 bg-gray-800 rounded"
            />
            <label className="text-sm whitespace-nowrap">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => dispatch(setRoundFilter({ dateTo: e.target.value }))}
              className="px-3 py-2 bg-gray-800 rounded"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-gray-900 rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "PlinkoRound ID",
                  "Rows",
                  "Risk",
                  "Username",
                  "Email",
                  "Bet Amount",
                  "Multiplier",
                  "Payout",
                  "xDropPoint",
                  "Started At",
                  "Completed At",
                  "Status",
                  "Path",
                ].map((h) => (
                  <th key={h} className="px-4 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="p-4 text-center">
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="11" className="p-4 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-4 text-center">
                    No rounds
                  </td>
                </tr>
              ) : (
                list.map((r) => (
                  <tr key={r._id} className="odd:bg-gray-800 even:bg-gray-700">
                    <td className="px-4 py-2">{r._id}</td>
                    <td className="px-4 py-2">{r.rows-2}</td>
                    <td className="px-4 py-2">{r.riskLevel}</td>
                    <td className="px-4 py-2">{r.user.username}</td>
                    <td className="px-4 py-2">{r.user.email}</td>
                    <td className="px-4 py-2">₹{r.betAmount.toFixed(2)}</td>
                    <td className="px-4 py-2">{r.multiplier}</td>
                    <td className="px-4 py-2">₹{r.payout.toFixed(2)}</td>
                    <td className="px-4 py-2">{r.xDropPoint}</td>
                    <td className="px-4 py-2">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(r.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(r.path)}
                      </pre>
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
            onClick={() => dispatch(setRoundPage(page - 1))}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => dispatch(setRoundPage(page + 1))}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
