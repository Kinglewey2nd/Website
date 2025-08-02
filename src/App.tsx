// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Login from './components/Login';
import Collection from './components/Collection';
import PackOpen from './components/PackOpen';
import ForgotPassword from './components/ForgotPassword';
import MainMenu from './components/MainMenu';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from './firebase';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  return user ? children : <Navigate to="/login" />;
};

const NotFound = () => (
  <div style={{ color: "white", textAlign: "center", paddingTop: "2rem" }}>
    Page Not Found
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/menu" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/menu" element={<RequireAuth><MainMenu /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/collection" element={<RequireAuth><
