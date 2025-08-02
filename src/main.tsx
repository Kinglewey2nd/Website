import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/global.css';
import Login from './pages/Login';
import PackOpen from './pages/PackOpen';
import MainMenu from './pages/MainMenu';
import Collection from './pages/Collection';
import Profile from './pages/Profile';
import Friends from './pages/Friends';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pack/open" element={<PackOpen />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
