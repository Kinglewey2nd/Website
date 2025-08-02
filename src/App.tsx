import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Login from './components/Login';
import Collection from './components/Collection';
import PackOpen from './components/PackOpen';
import ForgotPassword from './components/ForgotPassword';
import Main from './components/main'; // ✅ Corrected import
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from './firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
