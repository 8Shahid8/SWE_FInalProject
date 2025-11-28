// safehands/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser, isAdmin } from '../utils/auth';

const ProtectedRoute = ({ adminOnly = false }) => {
  const currentUser = getCurrentUser();

  // 1. If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the route is for admins only and the user is not an admin, redirect
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />; // Or to an "Unauthorized" page
  }

  // 3. If checks pass, render the child component
  return <Outlet />;
};

export default ProtectedRoute;
