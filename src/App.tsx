// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CardCreator from './components/CardCreator';
import MainMenu from './components/MainMenu';
import { useAuth } from './useAuth';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/menu"
        element={
          <RequireAuth>
            <MainMenu />
          </RequireAuth>
        }
      />
      <Route
        path="/card-creator"
        element={
          <RequireAuth>
            <CardCreator />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/menu" />} />
    </Routes>
  );
};

export default App;
