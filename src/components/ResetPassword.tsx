import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
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

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent!");
    } catch (error) {
      alert("Reset failed: " + (error as any).message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Reset Password</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleReset}>Send Reset Email</button>
    </div>
  );
};

export default ResetPassword;
