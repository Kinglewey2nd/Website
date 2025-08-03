// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CardCreator from './components/CardCreator';
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
        path="/"
        element={
          <RequireAuth>
            <CardCreator />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;
