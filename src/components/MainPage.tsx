import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function MainPage() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-serif">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1615543846472-adeb17e8f76b?auto=format&fit=crop&w=1950&q=80"
          alt="Spell Grave Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
          Welcome to <span className="text-purple-400">Spell Grave</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl text-gray-300">
          Collect. Battle. Conquer the Void.
        </p>
        <div className="flex gap-4">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-xl text-white text-lg font-medium shadow-lg"
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/collection")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-xl text-white text-lg font-medium shadow-lg"
              >
                Enter Game
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 border border-red-400 hover:bg-red-500 transition rounded-xl text-white text-lg font-medium shadow-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
