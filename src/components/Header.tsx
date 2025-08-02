import React, { useEffect, useState } from 'react';

export default function Header() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('spellgrave-username');
    if (saved) setUsername(saved);
  }, []);

  if (!username) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      color: 'white',
      fontSize: '1.1rem',
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: '0.4rem 0.8rem',
      borderRadius: '8px',
      boxShadow: '0 0 8px #000',
      zIndex: 999
    }}>
      👤 {username}
    </div>
  );
};

export default Header;
