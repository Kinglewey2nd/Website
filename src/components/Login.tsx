import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, getAuth } from 'firebase/auth';
import { app, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/menu');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/menu');
    } catch (error: any) {
      console.error('Google login error:', error);
      setError('Google login failed.');
    }
  };

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Login
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        Sign in with Google
      </button>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/forgot-password" style={{ color: 'lightblue' }}>
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

export default Login;
