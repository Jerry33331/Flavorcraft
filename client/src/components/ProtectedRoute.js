import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) {
    toast.error('Please login to access this page');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
