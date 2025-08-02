
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to SpellGrave</h1>
      <p style={{ marginBottom: '2rem' }}>{user?.email || 'Unknown user'}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
        <button onClick={() => navigate('/collection')}>View Collection</button>
        <button onClick={() => navigate('/pack/open')}>Open Packs</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default MainMenu;
