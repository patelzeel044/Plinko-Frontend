// src/components/admin/UserDetails.jsx
import React from "react";

export default function UserDetails({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <h1 className="text-2xl font-bold">User Details</h1>

      {/* User Info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{user.fullName}</h2>
        {[
          ["ID", user._id],
          ["Username", user.username],
          ["Email", user.email],
          ["Role", user.role],
          ["Status", user.status],
          ["Created At", new Date(user.createdAt).toLocaleString()],
          ["Updated At", new Date(user.updatedAt).toLocaleString()],
          ["Balance", `₹${user.wallet.balance.toFixed(2)}`],
          ["Locked", `₹${user.wallet.lockedBalance.toFixed(2)}`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="font-medium">{label}:</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
