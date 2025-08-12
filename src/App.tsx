import React, { JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CardCreator from './components/CardCreator';
import CardEditor from './components/CardEditor';
import AdminLayout from './components/AdminLayout';
import useAuth from './useAuth';
import CreateCollection from './components/CreateCollection';
import CreateRarityGem from './components/CreateRarityGem';
import EditCardForm from './components/EditCardForm';

// Protect routes to require authentication
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with AdminLayout as a parent */}
      <Route
        path="/menu"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="card-creator" replace />} />
        {/* Nested routes for the admin panel */}
        <Route path="card-creator" element={<CardCreator />} />
        <Route path="create-collection" element={<CreateCollection />} />
        <Route path="cards" element={<CardEditor />} />
        <Route path="create-rarity-gem" element={<CreateRarityGem />} />
        <Route path="edit-card/:id" element={<EditCardForm />} />

      </Route>

      {/* Redirect unknown routes to menu */}
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
};

export default App;
