import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
