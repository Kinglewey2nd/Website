// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CardCreator from './components/CardCreator';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CardCreator />} />
    </Routes>
  );
};

export default App;
