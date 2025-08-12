import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import useAuth from '../useAuth';

const admins = [
  'lwclark92@gmail.com',
  'neetinegi.codedrill@gmail.com',
  'dratidz@gmail.com',
  'karan@codedrillinfotech.com',
  'nitin@codedrillinfotech.com',
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && admins.includes(user.email || '');

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate('/login');
  };

  if (!isAdmin) {
    return <div style={{ padding: '2rem', color: 'white' }}>No Access</div>;
  }

  return (
    <div className="flex h-screen font-['Cinzel',serif]">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 text-white p-6 border-r border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">⚡</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3 mb-8">
          <NavLink 
            to="/menu/card-creator" 
            className={({ isActive }) => `
              block px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
              ${isActive 
                ? 'bg-gradient-to-r from-purple-600/80 to-purple-700/80 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30' 
                : 'hover:bg-purple-600/20 hover:border-purple-400/20 border border-transparent'
              }
            `}
          >
            <div className="flex items-center gap-3 relative z-10">
            <span className="text-lg"></span>
              <span className="font-medium">Create Card</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </NavLink>

          <NavLink 
            to="/menu/create-collection" 
            className={({ isActive }) => `
              block px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
              ${isActive 
                ? 'bg-gradient-to-r from-purple-600/80 to-purple-700/80 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30' 
                : 'hover:bg-purple-600/20 hover:border-purple-400/20 border border-transparent'
              }
            `}
          >
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-lg"></span>
              <span className="font-medium">Create Collection</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </NavLink>

          <NavLink 
            to="/menu/create-rarity-gem" 
            className={({ isActive }) => `
              block px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
              ${isActive 
                ? 'bg-gradient-to-r from-purple-600/80 to-purple-700/80 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30' 
                : 'hover:bg-purple-600/20 hover:border-purple-400/20 border border-transparent'
              }
            `}
          >
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-lg"></span>
              <span className="font-medium">Create Rarity Gem</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </NavLink>

          <NavLink 
            to="/menu/cards" 
            className={({ isActive }) => `
              block px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
              ${isActive 
                ? 'bg-gradient-to-r from-purple-600/80 to-purple-700/80 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30' 
                : 'hover:bg-purple-600/20 hover:border-purple-400/20 border border-transparent'
              }
            `}
          >
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-lg"></span>
              <span className="font-medium">Cards</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </NavLink>
        </nav>

        {/* User Info */}
        <div className="mb-6 p-4 bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-purple-300 font-medium">Logged in as</p>
              <p className="text-xs text-gray-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-purple-500 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/20 border border-red-500/30 hover:border-red-400/50 group relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            <span></span>
            <span>Logout</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

     
      </div>

      {/* Main Content */}
      <div className="flex-1 text-white overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};



export default AdminLayout;