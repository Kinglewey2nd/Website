import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsername(user.displayName || user.email || 'Player');

        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setXp(snap.data().xp || 0);
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h2>Welcome, {username}</h2>
      <p>XP: {xp}</p>

      <button onClick={() => navigate('/menu')} className="back-button">
        Back to Menu
      </button>
    </div>
  );
};

export default Profile;
