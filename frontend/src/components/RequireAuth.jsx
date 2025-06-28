// src/components/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If not logged in, redirect to login page, preserving the original route
  if (!token) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  // If logged in, render the protected component
  return children;
}