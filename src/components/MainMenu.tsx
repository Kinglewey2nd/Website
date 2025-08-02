
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h1>SpellGrave</h1>
      <button onClick={() => navigate('/pack/open')}>Open a Pack</button><br/>
      <button onClick={() => navigate('/collection')}>Collection</button><br/>
      <button onClick={() => navigate('/profile')}>View Profile</button>
    </div>
  );
};

export default MainMenu;
