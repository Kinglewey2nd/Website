
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Collection from './components/Collection';
import PackOpen from './components/PackOpen';
import ForgotPassword from './components/ForgotPassword';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from './firebase';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  return user ? children : <Login />;
};

const NotFound = () => <div style={{ color: "white", textAlign: "center", paddingTop: "2rem" }}>Page Not Found</div>;

const App: React.FC = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate('/collection');
      }
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/collection" element={<RequireAuth><Collection /></RequireAuth>} />
      <Route path="/pack/open" element={<RequireAuth><PackOpen /></RequireAuth>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
