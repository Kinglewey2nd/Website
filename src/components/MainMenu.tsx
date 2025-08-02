import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
      <h1>Welcome to SpellGrave</h1>
      <p>{user?.email || 'Unknown user'}</p>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/collection')} style={{ margin: '0.5rem' }}>
          Go to Collection
        </button>
        <button onClick={() => navigate('/pack/open')} style={{ margin: '0.5rem' }}>
          Open a Pack
        </button>
        <button onClick={() => navigate('/profile')} style={{ margin: '0.5rem' }}>
          View Profile
        </button>
        <button onClick={handleLogout} style={{ margin: '0.5rem', background: 'red', color: 'white' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
