import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PackOpen from './pages/PackOpen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pack/open" element={<PackOpen />} />
      </Routes>
    </Router>
  );
}