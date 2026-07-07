import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // If no token exists, redirect to login
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render children
  return children;
};

export default ProtectedRoute;
