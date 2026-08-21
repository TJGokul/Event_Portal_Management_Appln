import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

export const ProtectedRoute = ({ children, allowedRoles = [], requiredPermission = null }) => {
  const { role, isAuthenticated, hasPermission } = useRole();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to role selection if not authenticated
    return <Navigate to="/role-selection" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to unauthorized if role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to unauthorized if permission is missing
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
