import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<div className='text-white text-center mt-20 text-3xl'>Login Page (Coming Soon)</div>} />
        <Route path="*" element={<div className='text-white text-center mt-20 text-3xl'>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}