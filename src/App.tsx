import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
