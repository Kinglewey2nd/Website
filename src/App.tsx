import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import AuthPage from "./components/AuthPage";
import ShopPage from "./components/ShopPage";
import CollectionPage from "./components/CollectionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;