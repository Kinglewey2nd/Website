import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/menu');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/menu');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
          padding: '2rem',
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Login</h2>

        <form onSubmit={handleLogin} style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '8px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '12px',
              background: 'linear-gradient(90deg, #f6b042, #f08e28)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(90deg, #ffb36b, #ff9945)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Continue with Google
        </button>

        {!!error && <div style={{ color: '#fca5a5', marginTop: 12 }}>{error}</div>}

        <div style={{ marginTop: 16 }}>
          <Link to="/forgot-password" style={{ color: '#fff' }}>
            Forgot Password?
          </Link>
        </div>
        <div style={{ marginTop: 6 }}>
          <Link to="/register" style={{ color: '#fff' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
