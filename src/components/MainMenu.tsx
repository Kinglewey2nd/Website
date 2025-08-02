import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textShadow: '1px 1px 3px black'
    }}>
      <h1 style={{ fontSize: '3rem' }}>Welcome to SpellGrave</h1>
      <p style={{ fontSize: '1.2rem' }}>Choose an option from the menu below</p>
      <button
        onClick={() => navigate('/login')}
        style={{
          marginTop: '2rem',
          padding: '0.8rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        Login
      </button>
    </div>
  );
};

export default MainMenu;
