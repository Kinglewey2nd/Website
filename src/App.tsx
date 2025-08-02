
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import MainMenu from './components/MainMenu';
import Collection from './components/Collection';
import PackOpen from './components/PackOpen';
import Profile from './components/Profile';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  return user ? children : <Navigate to="/login" />;
};

const NotFound = () => <div style={{ color: "white", textAlign: "center", paddingTop: "2rem" }}>Page Not Found</div>;

const App: React.FC = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate('/menu');
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/menu" element={<RequireAuth><MainMenu /></RequireAuth>} />
      <Route path="/collection" element={<RequireAuth><Collection /></RequireAuth>} />
      <Route path="/pack/open" element={<RequireAuth><PackOpen /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
