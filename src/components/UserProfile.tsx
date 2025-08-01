import React from 'react';
import { auth } from '../firebase';

const UserProfile: React.FC = () => {
  const user = auth.currentUser;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>User Profile</h3>
      <p>Email: {user?.email}</p>
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