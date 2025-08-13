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
import Register from './components/Register';
import Home from './components/HomePage/Home';
import About from './components/HomePage/About';
import Profile from './components/HomePage/Profile';

// Require auth for protected areas
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
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* First page: decide based on auth */}
      <Route path='/' element={<Home/>}/>

      <Route
        path="/"
        element={
          loading ? (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
              Loading...
            </div>
          ) : user ? (
            <Navigate to="/menu" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/profile' element={<Profile/>}/>

      {/* Protected area */}
      <Route
        path="/menu"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="card-creator" replace />} />
        <Route path="card-creator" element={<CardCreator />} />
        <Route path="create-collection" element={<CreateCollection />} />
        <Route path="cards" element={<CardEditor />} />
        <Route path="create-rarity-gem" element={<CreateRarityGem />} />
        <Route path="edit-card/:id" element={<EditCardForm />} />
      </Route>

      {/* Fallback: send to correct place based on auth */}
      <Route
        path="*"
        element={
          loading ? (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
              Loading...
            </div>
          ) : user ? (
            <Navigate to="/menu" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
