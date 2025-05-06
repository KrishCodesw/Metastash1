import { Navigate } from 'react-router-dom';
import { JSX } from 'react';
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');

  // If no token, redirect to signin
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If token exists, render the protected component
  return children;
};

export default ProtectedRoute;
