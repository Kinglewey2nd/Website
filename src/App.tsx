
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import PackPage from "./pages/PackPage";
import PackOpening from "./components/PackOpening";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <NavBar />
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center text-center py-32 px-6">
              <h1 className="text-5xl font-extrabold mb-6 drop-shadow-md">Welcome to <span className="text-purple-400">SpellGrave</span></h1>
              <p className="text-xl text-gray-300 max-w-2xl mb-10">
                Open packs, collect powerful cards, level up your profile and trade with others. The graveyard awaits your legend.
              </p>
              <a href="/pack" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg shadow-lg transition">
                Open Your First Pack
              </a>
            </div>
          } />
          <Route path="/pack" element={<PackPage />} />
          <Route path="/pack/open" element={<PackOpening />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
