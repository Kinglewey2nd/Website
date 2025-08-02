import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Login from './components/Login';
import Collection from './components/Collection';
import PackOpen from './components/PackOpen';
import ForgotPassword from './components/ForgotPassword';
import Main from './components/main'; // ✅ Was "MainMenu", changed to "Main" (your actual file name)
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from './firebase';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  return user ? children : <Navigate to="/login" />;
};

const NotFound = () => (
  <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>
    Page Not Found
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Only navigate once auth status is known
      if (currentUser) {
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
          navigate('/menu');
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/menu" element={<RequireAuth><main /></RequireAuth>} />
      <Route path="/collection" element={<RequireAuth><Collection /></RequireAuth>} />
      <Route path="/pack/open" element={<RequireAuth><PackOpen /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
