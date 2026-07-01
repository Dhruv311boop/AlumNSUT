import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user) {
    // Save the intended location so we can redirect after login
    return <Navigate to="/auth/role-selection" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the right role. Send them to their respective dashboard
    const redirectPath = user.role === 'STUDENT' ? '/student/dashboard' 
                       : user.role === 'MENTOR' ? '/mentor/dashboard'
                       : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
