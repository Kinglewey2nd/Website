import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", paddingTop: "10vh" }}>
      <h1>Welcome to SpellGrave</h1>
      <button onClick={() => navigate('/pack/open')} style={{ padding: "0.8rem 2rem", fontSize: "1.1rem" }}>
        Enter
      </button>
    </div>
  );
}
