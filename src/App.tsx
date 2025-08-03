import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import MainMenu from './components/MainMenu';
import Collection from './components/Collection';
import PackOpen from './components/PackOpen';
import Profile from './components/Profile';
import CardCreator from './components/CardCreator';
import { AuthProvider, useAuth } from './useAuth';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

const NotFound = () => (
  <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>
    Page Not Found
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/menu" element={<RequireAuth><MainMenu /></RequireAuth>} />
      <Route path="/collection" element={<RequireAuth><Collection /></RequireAuth>} />
      <Route path="/pack/open" element={<RequireAuth><PackOpen /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/card-creator" element={<RequireAuth><CardCreator /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
