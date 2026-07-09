import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';
import api from '../../services/api';

interface AuthFormProps {
  role: Role;
  type: 'login' | 'signup';
}

export default function AuthForm({ role, type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = `/auth/${role.toLowerCase()}/${type}`;
      const payload = type === 'signup' ? { email, password, name } : { email, password };
      
      const response = await api.post(endpoint, payload);
      
      const { accessToken, user } = response.data;
      login(accessToken, user);
      
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'MENTOR') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const themeColor = role === 'STUDENT' ? 'indigo' : 'rose';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <Link to="/" className="inline-block mb-6">
           <img src="/logo.jpg" alt="AlumNSUT Logo" className="h-16 w-16 mx-auto object-contain rounded-full border border-slate-200 shadow-sm" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          {type === 'login' ? `Sign in as ${role === 'STUDENT' ? 'Student' : 'Mentor'}` : `Create a ${role === 'STUDENT' ? 'Student' : 'Mentor'} Account`}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to={`/auth/${role.toLowerCase()}/${type === 'login' ? 'signup' : 'login'}`} className={`font-medium text-${themeColor}-600 hover:text-${themeColor}-500 transition-colors`}>
            {type === 'login' ? 'create a new account' : 'sign in to your account'}
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            {type === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-${themeColor}-500 focus:border-${themeColor}-500 sm:text-sm transition-all`}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-${themeColor}-500 focus:border-${themeColor}-500 sm:text-sm transition-all`}
                  placeholder={role === 'STUDENT' ? "student@nsut.ac.in" : "alumni@company.com"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-${themeColor}-500 focus:border-${themeColor}-500 sm:text-sm transition-all`}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-${themeColor}-600 hover:bg-${themeColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${themeColor}-500 transition-all active:scale-[0.98] disabled:opacity-70`}
              >
                {isLoading ? 'Processing...' : (type === 'login' ? 'Sign in' : 'Create Account')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
