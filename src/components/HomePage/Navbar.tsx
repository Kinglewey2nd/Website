import useAuth from '@/useAuth';
import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const admins = [
  'lwclark92@gmail.com',
  'stuartbclinton@gmail.com',
  'neetinegi.codedrill@gmail.com',
  'dratidz@gmail.com',
  'karan@codedrillinfotech.com',
  'nitin@codedrillinfotech.com',
];

const Navbar = () => {
  const { user } = useAuth();
  const isAdmin = user && admins.includes(user.email || '');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(getAuth());
    navigate('/');
  };

  return (
    <div>
      <div className="flex font-[kapler] items-center cinzel justify-between py-2 px-10 backdrop-brightness-80 backdrop-blur-sm border-b border-b-black sticky top-0">
        <div>
          <NavLink to="/">
            <h1 className="text-4xl">SpellGrave</h1>
          </NavLink>
        </div>
        <div className="flex items-center justify-center gap-10">
          <NavLink to="/" className="text-xl relative">
            {({ isActive }) => (
              <>
                Home
                {isActive && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                )}
              </>
            )}
          </NavLink>
          <NavLink to="/about" className="text-xl relative">
            {({ isActive }) => (
              <>
                About
                {isActive && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                )}
              </>
            )}
          </NavLink>
          <NavLink to="/market-places" className="text-xl relative">
            {({ isActive }) => (
              <>
                Market Places
                {isActive && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                )}
              </>
            )}
          </NavLink>
          {user ? (
            <>
             {isAdmin && (
               <NavLink
               to='/menu'
               className="text-xl relative"
             >
               {({ isActive }) => (
                 <>
                   Admin
                   {isActive && (
                     <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                   )}
                 </>
               )}
             </NavLink>
             )}
              <NavLink
                to="/profile"
                className="text-xl relative"
              >
                {({ isActive }) => (
                  <>
                    Profile
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                    )}
                  </>
                )}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-xl text-red-500 hover:underline cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="text-purple-500 text-xl hover:underline"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
