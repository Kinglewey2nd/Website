// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CardCreator from './components/CardCreator';
import MainMenu from './components/MainMenu';
import CardPreview from './components/CardPreview';
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
      <Route
        path="/test-preview"
        element={
          <CardPreview
            name="Test Shroom"
            type="Magic Mushroom"
            description="Testing direct Firebase URL image"
            attack={5}
            health={3}
            rarity="Legendary"
            imageUrl="https://firebasestorage.googleapis.com/v0/b/spellgrave-f2e30.firebasestorage.app/o/compressed_mushroom.webp?alt=media&token=6ea7a753-1384-4617-bec3-b56e0a23833f"
          />
        }
      />
      <Route path="*" element={<Navigate to="/menu" />} />
    </Routes>
  );
};

export default App;
