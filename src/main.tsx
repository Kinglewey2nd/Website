import React from 'react';

const Main: React.FC = () => {
  console.log("✅ Main menu component mounted");

  return (
    <div style={{ color: 'white', textAlign: 'center', paddingTop: '3rem' }}>
      <h1>✅ Main Menu Loaded</h1>
      <p>If you can see this, the route is working.</p>
    </div>
  );
};

export default Main;
