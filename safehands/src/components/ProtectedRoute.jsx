// safehands/src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth instance
import { getCurrentUser } from '../utils/auth'; // Our custom getCurrentUser, now potentially async

const ProtectedRoute = ({ roles }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Firebase user is logged in
        // Now, fetch the full profile from Firestore using our getCurrentUser utility
        const profile = await getCurrentUser(); // getCurrentUser is async and fetches from Firestore
        setUserProfile(profile);
        setIsAuthenticated(true);
      } else {
        // No Firebase user logged in
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      setLoading(false); // Authentication state has been determined
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are required, check if the user has one of the required roles
  // We need userProfile to be available here, which it should be if isAuthenticated is true
  if (roles && roles.length > 0 && (!userProfile || !roles.includes(userProfile.role))) {
    return <Navigate to="/" replace />; // Or to an "Unauthorized" page
  }

  return <Outlet />;
};

export default ProtectedRoute;