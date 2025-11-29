// safehands/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth, getCurrentUser } from '../utils/auth';

const ProtectedRoute = ({ roles }) => {
  const isAuthenticated = checkAuth();
  const currentUser = getCurrentUser(); // Still needed for role check

  // 1. If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If roles are required, check if the user has one of the required roles
  if (roles && roles.length > 0 && (!currentUser || !roles.includes(currentUser.role))) {
    return <Navigate to="/" replace />; // Or to an "Unauthorized" page
  }

  // 3. If checks pass, render the child component
  return <Outlet />;
};

export default ProtectedRoute;

export default ProtectedRoute;
