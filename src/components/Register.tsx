
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

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
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      navigate('/menu');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br/>
        <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} /><br/>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Register</button>
      </form>
      <div>{error}</div>
    </div>
  );
};

export default Register;
