import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Collection from './pages/Collection';
import Packs from './pages/Packs';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/packs" element={<Packs />} />
      </Routes>
    </Router>
  );
};

export default App;