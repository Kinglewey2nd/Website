
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
    <div className="flex flex-col items-center text-white text-xl mb-4">
      {user && (
        <>
          <img src={user.photoURL} alt="Profile" className="rounded-full w-20 h-20 mb-2" />
          <div>Welcome, {user.displayName || user.email}</div>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              signOut(auth).then(() => {
                window.location.href = "/";
              });
            }}
            className="mt-2 bg-red-600 px-4 py-2 rounded"
          >
            Sign Out
          </button>
          <Link to="/profile"><button className="mt-2 bg-blue-500 px-4 py-2 rounded">View Profile</button></Link>
        </>
      )}
    </div>
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
