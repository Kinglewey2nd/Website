
import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PackPage() {
  const navigate = useNavigate();

  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-6">Your Card Packs</h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl mb-4"
        onClick={() => navigate("/pack/open")}
      >
        Open a Pack
      </button>
      <Link to="/" className="text-blue-300 hover:text-blue-500 underline">
        ← Back to Home
      </Link>
    </div>
  );
}
