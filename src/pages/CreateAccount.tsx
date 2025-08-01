import React, { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created:', userCredential.user);
      navigate('/collection'); // redirect after sign-up
    } catch (err: any) {
      console.error('Signup failed:', err.message);
      setError(err.message || 'Account creation failed');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '5rem auto',
      padding: '2rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2>Create Account</h2>
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
