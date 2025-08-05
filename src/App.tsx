import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CardCreator from './components/CardCreator';
import CardEditor from './components/CardEditor';
import MainMenu from './components/MainMenu';
import { useAuth } from './useAuth';

// Protect routes to require authentication
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
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
      <Route
        path="/card-editor"
        element={
          <RequireAuth>
            <CardEditor />
          </RequireAuth>
        }
      />

      {/* Redirect unknown routes to menu */}
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
};

export default App;
