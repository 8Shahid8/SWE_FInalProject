// safehands/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const ProtectedRoute = ({ roles }) => {
  const currentUser = getCurrentUser();

  // 1. If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. If roles are required, check if the user has one of the required roles
  if (roles && roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />; // Or to an "Unauthorized" page
  }

  // 3. If checks pass, render the child component
  return <Outlet />;
};

export default ProtectedRoute;
