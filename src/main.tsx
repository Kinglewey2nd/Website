import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: '5rem', color: 'white' }}>
      <h1 style={{ fontSize: '3rem' }}>SpellGrave</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={() => navigate('/profile')}>View Profile</button>
        <button onClick={() => navigate('/collection')}>Go to Collection</button>
        <button onClick={() => navigate('/pack/open')}>Open Pack</button>
      </div>
    </div>
  );
};

export default Main;
