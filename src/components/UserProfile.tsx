import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getLevel, getBadges } from '../utils/xpUtils';

const UserProfile: React.FC = () => {
  const user = auth.currentUser;
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'profile', 'data');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const userLevel = getLevel(data.xp || 0);
        setXp(data.xp || 0);
        setLevel(userLevel);
        setBadges(getBadges(userLevel));
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>User Profile</h3>
      <p>Email: {user?.email}</p>
      <p>XP: {xp}</p>
      <p>Level: {level}</p>
      <p>Badges: {badges.join(', ') || 'None'}</p>
      <img
        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email || "anon"}`}
        alt="avatar"
        width="100"
        height="100"
      />
    </div>
  );
};

export default UserProfile;