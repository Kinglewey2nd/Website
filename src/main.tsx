import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/global.css';
import Login from './pages/Login';
import PackOpen from './pages/PackOpen';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pack/open" element={<PackOpen />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
