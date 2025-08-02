import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Collection from './pages/Collection';
import PackOpener from './pages/PackOpener';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/packs" element={<PackOpener />} />
      </Routes>
    </Router>
  );
}

export default App;