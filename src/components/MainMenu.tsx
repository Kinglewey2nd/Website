import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '3rem' }}>
      <h1>Welcome to SpellGrave</h1>
      <h2>{user ? `Logged in as ${user.email}` : 'Not logged in'}</h2>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/collection')}>📖 View Collection</button><br /><br />
        <button onClick={() => navigate('/pack/open')}>🎴 Open a Pack</button><br /><br />
        <button onClick={() => navigate('/profile')}>👤 View Profile</button><br /><br />
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
};

export default MainMenu;