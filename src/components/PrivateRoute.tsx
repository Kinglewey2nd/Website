import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
