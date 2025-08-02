import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';


import React from 'react';
const Main: React.FC = () => {
  console.log("✅ Main menu mounted");

  return (
    <div style={{ color: 'white', padding: '4rem', textAlign: 'center' }}>
      <h1>Main Menu Loaded</h1>
      <p>If you see this, routing and auth are working.</p>
    </div>
  );
};

export default Main;


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

