import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundImage: 'url("/background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      color: 'white',
      textAlign: 'center',
      paddingTop: '15vh',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>SpellGrave</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <button onClick={() => navigate('/pack/open')}>⚔️ Open Pack</button>
        <button onClick={() => navigate('/collection')}>📚 Collection</button>
        <button onClick={() => navigate('/profile')}>🧙 Profile</button>
        <button onClick={() => navigate('/friends')}>🎭 Friends & Trading</button>
      </div>
    </div>
  );
}
