import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/role-selection');
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="h-10 w-10 object-contain rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" />
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
            AlumNSUT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">Home</Link>
          <Link to={user?.role === 'STUDENT' ? '/student/find-mentor' : '/mentor/dashboard'} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">Find Mentor</Link>
          <Link to="/forum" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">Discussion Forum</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">About</Link>
          
          <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-700 pl-4">
              <Link to={user.role === 'STUDENT' ? '/student/dashboard' : '/mentor/dashboard'} className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/auth/role-selection" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                Sign In
              </Link>
              <Link to="/auth/role-selection" className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm shadow-red-200 dark:shadow-none">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-4">
          <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Home</Link>
          <Link to={user?.role === 'STUDENT' ? '/student/find-mentor' : '/mentor/dashboard'} className="text-sm font-medium text-slate-600 dark:text-slate-300 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Find Mentor</Link>
          <Link to="/forum" className="text-sm font-medium text-slate-600 dark:text-slate-300 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Discussion Forum</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">About</Link>
          
          <button onClick={toggleTheme} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            {theme === 'dark' ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
            Toggle Theme
          </button>

          {user ? (
             <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2 px-4 flex flex-col space-y-2">
               <Link to={user.role === 'STUDENT' ? '/student/dashboard' : '/mentor/dashboard'} className="text-sm font-medium text-slate-600 dark:text-slate-300 py-2">
                 Dashboard
               </Link>
               <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 dark:text-red-500 py-2">
                 <LogOut className="h-4 w-4 mr-2" />
                 Logout
               </button>
             </div>
          ) : (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2 px-4 flex flex-col space-y-2">
              <Link to="/auth/role-selection" className="text-sm font-medium text-slate-600 dark:text-slate-300 py-2">Sign In</Link>
              <Link to="/auth/role-selection" className="text-sm font-medium text-red-600 dark:text-red-500 py-2">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
