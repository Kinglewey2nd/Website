import React, { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Login to Spell Grave" : "Create an Account"}
        </h2>

        <form className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          {isLogin && (
            <div className="text-right text-sm">
              <a href="/forgot-password" className="text-purple-400 hover:underline">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 transition rounded text-white font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full py-2 text-sm mt-2 text-purple-300 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
