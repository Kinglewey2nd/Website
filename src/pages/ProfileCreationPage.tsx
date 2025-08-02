
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function ProfileCreationPage() {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("You must be logged in to create a profile.");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        nickname,
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      navigate("/profile");
    } catch (err: any) {
      setError("Failed to save profile: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">Create Your Profile</h1>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-800 border border-gray-700"
          required
        />
        <input
          type="text"
          placeholder="Nickname (optional)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-gray-800 border border-gray-700"
        />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded text-lg font-semibold">
          Save Profile
        </button>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </form>
    </div>
  );
}
