
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import ForgotPassword from './components/ForgotPassword';
import Collection from './components/Collection';
import PackOpen from './components/PackOpen';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/pack/open" element={<PackOpen />} />
      </Routes>
    </Router>
  );
};

export default App;
