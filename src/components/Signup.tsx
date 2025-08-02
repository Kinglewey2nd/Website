import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDOMBhE3JTlh3fLEC98nXy0YWtsc2cpFAE",
  authDomain: "spellgrave-f2e30.firebaseapp.com",
  projectId: "spellgrave-f2e30",
  storageBucket: "spellgrave-f2e30.appspot.com",
  messagingSenderId: "387513452186",
  appId: "1:387513452186:web:a049bac189f315b4088123",
  measurementId: "G-FKXDG97B9Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
    } catch (error) {
      alert("Signup failed: " + (error as any).message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Create Account</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
