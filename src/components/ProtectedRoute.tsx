import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    // Redirect to the sign-in page
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;