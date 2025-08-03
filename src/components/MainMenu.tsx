// src/components/MainMenu.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'white' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>✨ SpellGrave ✨</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
        <button onClick={() => navigate('/pack/open')}>🎴 Open a Pack</button>
        <button onClick={() => navigate('/collection')}>🗂️ View Collection</button>
        <button onClick={() => navigate('/profile')}>🧙 View Profile</button>
        <button onClick={() => navigate('/card-creator')}>🛠️ Card Creator</button>
        <button onClick={() => navigate('/cards')}>🃏 View All Cards</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div style={{ marginTop: '3rem', fontSize: '0.85rem', opacity: 0.6 }}>
        Build 0.01
      </div>
    </div>
  );
};

export default MainMenu;
