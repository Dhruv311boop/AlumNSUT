import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

interface LoginFormProps {
  role: Role;
}

export default function LoginForm({ role }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const toastId = toast.loading('Signing in...');

    try {
      const endpoint = `/auth/${role.toLowerCase()}/login`;
      const payload = { email: formData.email, password: formData.password };
      
      const response = await api.post(endpoint, payload);
      
      const { accessToken, user } = response.data;
      login(accessToken, user);
      
      toast.success('Signed in successfully!', { id: toastId });

      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'MENTOR') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-right" />
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <Link to="/" className="inline-block mb-6">
           <img src="/logo.jpg" alt="AlumNSUT Logo" className="h-16 w-16 mx-auto object-contain rounded-full border border-slate-200 shadow-sm" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in as {role === 'STUDENT' ? 'Student' : 'Mentor'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to={`/auth/${role.toLowerCase()}/signup`} className="font-medium text-red-600 hover:text-red-700 transition-colors">
            create a new account
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0"
      >
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                placeholder={role === 'STUDENT' ? "student@nsut.ac.in" : "alumni@company.com"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password" name="password" required value={formData.password} onChange={handleChange}
                className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me" name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-red-600 hover:text-red-700">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-red-200 text-base font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
