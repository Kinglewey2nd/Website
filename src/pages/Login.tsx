import React, { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
      navigate('/collection');
    } catch (err: any) {
      console.error('Login failed:', err.message);
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don’t have an account?
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
        <a
          href="/signup"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
          }}
        >
          Create Account
        </a>
      </div>
    </div>
  );
};

export default Login;