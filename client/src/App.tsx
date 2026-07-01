import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import RoleProtectedRoute from './components/routing/RoleProtectedRoute';

// Lazy-loaded Pages
const Landing = lazy(() => import('./pages/Landing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Auth Pages
const RoleSelection = lazy(() => import('./pages/auth/RoleSelection'));
const StudentLogin = lazy(() => import('./pages/auth/StudentLogin'));
const StudentSignup = lazy(() => import('./pages/auth/StudentSignup'));
const MentorLogin = lazy(() => import('./pages/auth/MentorLogin'));
const MentorSignup = lazy(() => import('./pages/auth/MentorSignup'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));
const StudentSettings = lazy(() => import('./pages/student/StudentSettings'));
const FindMentor = lazy(() => import('./pages/student/FindMentor'));
const StudentMessages = lazy(() => import('./pages/student/StudentMessages'));
const BookSession = lazy(() => import('./pages/student/BookSession'));
const StudentSessions = lazy(() => import('./pages/student/StudentSessions'));
const StudentNotifications = lazy(() => import('./pages/student/StudentNotifications'));

// Mentor Pages
const MentorDashboard = lazy(() => import('./pages/mentor/MentorDashboard'));
const MentorProfile = lazy(() => import('./pages/mentor/MentorProfile'));
const MentorSettings = lazy(() => import('./pages/mentor/MentorSettings'));
const MentorVerification = lazy(() => import('./pages/mentor/MentorVerification'));
const MentorMessages = lazy(() => import('./pages/mentor/MentorMessages'));
const MentorBookings = lazy(() => import('./pages/mentor/MentorBookings'));
const MentorAvailability = lazy(() => import('./pages/mentor/MentorAvailability'));
const MentorEarnings = lazy(() => import('./pages/mentor/MentorEarnings'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Public Route Wrapper (redirects if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (user) {
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'MENTOR') return <Navigate to="/mentor/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Legacy fallback */}
        <Route path="/login" element={<Navigate to="/auth/role-selection" replace />} />
        <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<Navigate to="/auth/role-selection" replace />} />
        <Route path="/auth/role-selection" element={<PublicRoute><RoleSelection /></PublicRoute>} />
        <Route path="/auth/student/login" element={<PublicRoute><StudentLogin /></PublicRoute>} />
        <Route path="/auth/student/signup" element={<PublicRoute><StudentSignup /></PublicRoute>} />
        <Route path="/auth/mentor/login" element={<PublicRoute><MentorLogin /></PublicRoute>} />
        <Route path="/auth/mentor/signup" element={<PublicRoute><MentorSignup /></PublicRoute>} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></RoleProtectedRoute>} />
        <Route path="/student/profile" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><StudentProfile /></RoleProtectedRoute>} />
        <Route path="/student/settings" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><StudentSettings /></RoleProtectedRoute>} />
        <Route path="/student/find-mentor" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><FindMentor /></RoleProtectedRoute>} />
        <Route path="/student/messages" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><StudentMessages /></RoleProtectedRoute>} />
        <Route path="/student/book-session" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><BookSession /></RoleProtectedRoute>} />
        <Route path="/student/sessions" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><StudentSessions /></RoleProtectedRoute>} />
        <Route path="/student/notifications" element={<RoleProtectedRoute allowedRoles={['STUDENT']}><StudentNotifications /></RoleProtectedRoute>} />

        {/* Mentor Routes */}
        <Route path="/mentor/dashboard" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorDashboard /></RoleProtectedRoute>} />
        <Route path="/mentor/profile" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorProfile /></RoleProtectedRoute>} />
        <Route path="/mentor/settings" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorSettings /></RoleProtectedRoute>} />
        <Route path="/mentor/verification" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorVerification /></RoleProtectedRoute>} />
        <Route path="/mentor/messages" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorMessages /></RoleProtectedRoute>} />
        <Route path="/mentor/bookings" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorBookings /></RoleProtectedRoute>} />
        <Route path="/mentor/availability" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorAvailability /></RoleProtectedRoute>} />
        <Route path="/mentor/earnings" element={<RoleProtectedRoute allowedRoles={['MENTOR']}><MentorEarnings /></RoleProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<RoleProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleProtectedRoute>} />

        {/* 404 Route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
