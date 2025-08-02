import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
