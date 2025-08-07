import React, { JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import CardCreator from "./components/CardCreator";
import CardEditor from "./components/CardEditor";
import MainMenu from "./components/MainMenu";
import ViewCard from "./components/ViewCard";
import { useAuth } from "./useAuth";
import CreateCard from "./pages/create-card";

// Protect routes to require authentication
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/menu"
        element={
          <RequireAuth>
            <MainMenu />
          </RequireAuth>
        }
      />
      <Route
        path="/view-cards"
        element={
          <RequireAuth>
            <ViewCard />
          </RequireAuth>
        }
      />
      <Route
        path="/card-creator"
        element={
          <RequireAuth>
            <CardCreator />
          </RequireAuth>
        }
      />
      <Route
        path="/card-editor"
        element={
          <RequireAuth>
            <CardEditor />
          </RequireAuth>
        }
      />

      {/* Redirect unknown routes to menu */}
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
};

export default App;
