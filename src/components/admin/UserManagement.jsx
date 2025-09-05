// src/pages/admin/Users.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setFilter, setPage } from "../../store/Slices/AdminSlice/adminUsersSlice";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const dispatch = useDispatch();
  const {
    list: users,
    loading,
    error,
    page,
    totalPages,
    limit,
    total,
    filters: { search, status, role, sort, dateFrom, dateTo },
  } = useSelector((s) => s.adminUsers);

  // whenever page or any filter changes, refetch
  useEffect(() => {
    dispatch(
      getUsers({
        page,
        limit:20,
        search,
        status,
        role,
        sort,
        dateFrom,
        dateTo,
      })
    );
  }, [dispatch, page, limit, search, status, role, sort, dateFrom, dateTo]);

  return (
    <div className="px-6 py-8 bg-[#0d1117] min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) =>
              dispatch(setFilter({ search: e.target.value, page: 1 }))
            }
            placeholder="Search username or email"
            className="px-3 py-2 bg-gray-800 rounded text-white focus:outline-none"
          />

          {/* Status */}
          <select
            value={status}
            onChange={(e) =>
              dispatch(setFilter({ status: e.target.value, page: 1 }))
            }
            className="px-3 py-2 bg-gray-800 rounded text-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          {/* Role */}
          <select
            value={role}
            onChange={(e) =>
              dispatch(setFilter({ role: e.target.value, page: 1 }))
            }
            className="px-3 py-2 bg-gray-800 rounded text-white focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) =>
              dispatch(setFilter({ sort: e.target.value, page: 1 }))
            }
            className="px-3 py-2 bg-gray-800 rounded text-white focus:outline-none"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
          </select>
          
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300 whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) =>
                dispatch(setFilter({ dateFrom: e.target.value, page: 1 }))
              }
              className="px-3 py-2 bg-gray-800 rounded text-white focus:outline-none"
            />
            <label className="text-sm text-gray-300 whitespace-nowrap">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) =>
                dispatch(setFilter({ dateTo: e.target.value, page: 1 }))
              }
              className="px-3 py-2 bg-gray-800 rounded text-white focus:outline-none"
            />
          </div>
        </div>
        

        {/* Table */}
        <div className="overflow-x-auto bg-gray-900 rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "User ID",
                  "Username",
                  "Email",
                  "Role",
                  "Wallet Balance",
                  "Status",
                  "Created At",
                  "Actions",
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
                  <td colSpan="8" className="p-4 text-center">
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="odd:bg-gray-800 even:bg-gray-700"
                  >
                    <td className="px-4 py-2">{u._id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">
                      ₹
                      {u.wallet?.balance?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-2">{u.status}</td>
                    <td className="px-4 py-2">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    
                    <td className="px-4 py-2">
                      <Link
                        to={`/admin/users/${u._id}`}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page <= 1}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
