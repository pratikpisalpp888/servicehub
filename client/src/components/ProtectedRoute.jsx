import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check it
  if (requiredRole) {
    const userRole = localStorage.getItem('userRole');
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'provider' && userRole !== 'provider' && userRole !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If authenticated (and role check passed if applicable), render children
  return children;
};

export default ProtectedRoute;