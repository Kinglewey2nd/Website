import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Placeholder for Firebase login
    if (email && password) {
      navigate('/menu');
    }
  };

  return (
    <div style={{
      backgroundImage: 'url("/background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      color: 'white'
    }}>
      <h1>Welcome to SpellGrave</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ margin: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ margin: '0.5rem', padding: '0.5rem' }}
      />
      <button onClick={handleLogin} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>Log In</button>
      <button onClick={() => navigate('/menu')} style={{ marginTop: '0.5rem', background: 'transparent', border: '1px solid white', color: 'white' }}>
        Continue as Guest
      </button>
      <p style={{ marginTop: '1rem' }}>Forgot password?</p>
    </div>
  );
}
