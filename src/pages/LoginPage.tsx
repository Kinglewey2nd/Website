
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isCreatingAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/pack");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/pack");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-4">{isCreatingAccount ? "Create Account" : "Login"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-4">
        <input
          className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 p-2 rounded font-semibold">
          {isCreatingAccount ? "Sign Up" : "Login"}
        </button>
        <button type="button" onClick={signInWithGoogle} className="bg-red-600 hover:bg-red-700 p-2 rounded font-semibold">
          Continue with Google
        </button>
      </form>
      {error && <p className="text-red-400 mt-4">{error}</p>}
      <p className="mt-4 text-sm">
        {isCreatingAccount ? "Already have an account?" : "Need an account?"}{" "}
        <button onClick={() => setIsCreatingAccount(!isCreatingAccount)} className="underline text-purple-400">
          {isCreatingAccount ? "Login here" : "Create one"}
        </button>
      </p>
    </div>
  );
}
