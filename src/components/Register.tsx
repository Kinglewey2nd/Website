import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import Navebar from './HomePage/Navbar';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCred.user, { displayName: name });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Navebar />
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
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Register</h2>
          <form onSubmit={handleRegister} style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
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
            <br />
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
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
            <br />
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
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            <br />
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
              Register
            </button>
          </form>
          <div>{error}</div>
          <div
            style={{ marginTop: 16 }}
            className="flex items-center justify-center"
          >
            <h2>
              Already have an account?{' '}
              <Link to="/login" className="text-purple-500">
                Log in here
              </Link>
              .
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
