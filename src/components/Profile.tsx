
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [xp, setXp] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchXP = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setXp(snap.data().xp || 0);
        }
      }
    };
    fetchXP();
  }, [user]);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
      <h2>Welcome, {user?.displayName}</h2>
      <p>XP: {xp}</p>
      
    <button onClick={() => navigate('/menu')} className="back-button">
      Back to Menu
    </button>
      
    </div>
    );
};



export default Profile;
