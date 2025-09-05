import React, { useEffect, useState } from "react";
import TransactionsDetail from "./TransactionsDetail";
import PlinkoRoundsDetail from "./PlinkoRoundsDetails";

export default function TransactionPage1() {

  const [tab, setTab] = useState("transactions");

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="flex gap-4 p-6 mb-6">
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
          <TransactionsDetail  />
        ) : (
          <PlinkoRoundsDetail  />
        )}
    </div>
  );
}
