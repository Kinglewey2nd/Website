import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: 'white',
      textShadow: '1px 1px 2px black'
    }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px' }}
      />
      <button onClick={handleLogin} style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        border: 'none',
        borderRadius: '5px',
        color: 'white'
      }}>Login</button>
    
      <div style={{ marginTop: '1rem' }}>
        <a href="/signup" style={{ color: '#3b82f6', marginRight: '1rem' }}>Create Account</a>
        <a href="/reset-password" style={{ color: '#3b82f6' }}>Forgot Password?</a>
      </div>
    </div>
    
  );
};

export default Login;
