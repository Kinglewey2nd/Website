
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <div className="text-2xl font-extrabold tracking-wide">✨ SpellGrave</div>
      <div className="space-x-6 text-lg">
        <Link to="/" className="hover:text-purple-300 transition">🏠 Home</Link>
        <Link to="/pack" className="hover:text-purple-300 transition">📦 Packs</Link>
        <Link to="/collection" className="hover:text-purple-300 transition">📘 Collection</Link>
        <Link to="/profile" className="hover:text-purple-300 transition">🧑 Profile</Link>
        {user ? (
          <>
            <span className="text-sm text-purple-400 ml-4">Hi, {user.displayName || user.email || "User"} 👋</span>
            <button onClick={handleLogout} className="ml-2 underline text-red-300 hover:text-red-500 text-sm">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:text-purple-300 transition">🔐 Login</Link>
        )}
      </div>
    </nav>
  );
}
