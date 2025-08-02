import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PackPage from './pages/PackPage';
import PackOpening from './components/PackOpening';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/pack" element={<PackPage />} />
      <Route path="/pack/open" element={<PackOpening />} />
    </Routes>
  </BrowserRouter>
);