// src/pages/admin/UserById.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TransactionsDetail from "./TransactionsDetail";
import PlinkoRoundsDetail from "./PlinkoRoundsDetails";
import UserDetails from "./UserDetails";
import { getUserById } from "../../store/Slices/AdminSlice/adminUsersSlice";

export default function UserById() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector(s => s.adminUsers);

  // Tab state: 'transactions' | 'rounds'
  const [tab, setTab] = useState("transactions");

  useEffect(() => {
    dispatch(getUserById(id));
  }, [dispatch,id]);

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      {/* Left panel */}
      <div className="w-1/4 p-6 border-r border-gray-700">
        {userLoading ? <p>Loading user…</p> : <UserDetails user={user} />}
      </div>

      {/* Right panel */}
      <div className="w-3/4 p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("transactions")}
            className={`px-4 py-2 rounded ${tab==="transactions" ? "bg-blue-600" : "bg-gray-800"}`}
          >
            Transactions
          </button>
          <button
            onClick={() => setTab("rounds")}
            className={`px-4 py-2 rounded ${tab==="rounds" ? "bg-blue-600" : "bg-gray-800"}`}
          >
            Plinko Rounds
          </button>
        </div>

        {tab === "transactions" ? (
          <TransactionsDetail userId={id} />
        ) : (
          <PlinkoRoundsDetail userId={id} />
        )}
      </div>
    </div>
  );
}
