import React from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const MainMenu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem'
    }}>
      <h1>Welcome to SpellGrave</h1>
      {user ? (
        <>
          <p>Welcome back, {user.email}</p>
          <button onClick={() => navigate('/pack/open')}>Open Pack</button>
          <button onClick={() => navigate('/collection')}>View Collection</button>
          <button onClick={() => navigate('/friends')}>Friends & Trade</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>Please log in to access your collection.</p>
          <button onClick={() => navigate('/login')}>Login</button>
        </>
      )}
    </div>
  );
};

export default MainMenu;
