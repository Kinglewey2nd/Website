// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './useAuth'; // or './contexts/AuthContext' if you move it

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ This wraps everything that uses useAuth() */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
