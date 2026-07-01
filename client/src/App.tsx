import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'STUDENT' | 'MENTOR' }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />; // Redirect to landing or their respective dashboard
  }

  return children;
};

function AppRoutes() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <Routes>
      {/* If logged in as student and trying to access landing, redirect to dashboard */}
      <Route path="/" element={user?.role === 'STUDENT' ? <Navigate to="/student-dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      
      <Route 
        path="/student-dashboard" 
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
