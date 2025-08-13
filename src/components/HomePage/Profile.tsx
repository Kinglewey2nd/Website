import React from 'react';
import Navbar from './Navbar';
import useAuth from '@/useAuth';

const Profile = () => {
  const { user } = useAuth();
  console.log(user);
  const profilePhoto = user?.providerData.map(user => user.photoURL);
  return (
    <div>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className=" shadow-md  rounded-xl p-8 max-w-md w-full backdrop-brightness-30 border-[1px]">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="flex items-center justify-center">
            <img
              src={profilePhoto?.[0] || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
              alt=""
              className="w-20 h-20 rounded-full "
            />
          </div>{' '}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Email
            </label>
            <p className="mt-1 text-white">{user?.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Display Name
            </label>
            <p className="mt-1 text-white">{user?.displayName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
