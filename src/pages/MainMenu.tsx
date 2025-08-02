import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white">
        <h1 className="text-5xl font-bold mb-10">SpellGrave</h1>
        <div className="space-y-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-xl"
            onClick={() => navigate('/pack/open')}
          >
            Open Packs
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-xl"
            onClick={() => navigate('/collection')}
          >
            View Collection
          </button>
          <button
            className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-xl text-xl"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
        </div>
      </div>
    </>
  );
}
