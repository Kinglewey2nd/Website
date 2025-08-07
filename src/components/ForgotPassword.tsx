import React, { useState } from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { app } from '../firebase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const auth = getAuth(app);

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your email for reset instructions.');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
      <div>{message}</div>
    </div>
  );
};

export default ForgotPassword;
