import React from 'react';

const MainMenu: React.FC = () => {
  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to bottom right, #1e293b, #334155)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem' }}>Welcome to SpellGrave</h1>
      <p style={{ fontSize: '1.2rem' }}>Choose an option from the menu above</p>
    </div>
  );
};

export default MainMenu;
