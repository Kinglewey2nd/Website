import React from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Welcome to SpellGrave</h1>
      {user && <p style={{ fontSize: '1.2rem' }}>Welcome back, {user.email}</p>}
      {!user && <button onClick={() => navigate('/login')}>Login</button>}
    </div>
  );
};

export default MainMenu;
