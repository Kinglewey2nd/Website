import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Failed to send reset email.');
    }
  };

  return (
    <div className="p-4 text-center text-white">
      <h2 className="text-2xl mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="p-2 border rounded w-full mb-2 text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset} className="bg-blue-600 p-2 rounded text-white w-full">
        Send Reset Email
      </button>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default ForgotPassword;
