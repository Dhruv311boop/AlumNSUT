import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function MentorSignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    currentPosition: '',
    yearsOfExperience: '',
    industry: '',
    bio: '',
    linkedinUrl: '',
    availability: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Creating mentor account...');

    try {
      const payload = { ...formData, availability: [formData.availability] };
      const response = await api.post('/auth/mentor/signup', payload);
      const { accessToken, user } = response.data;
      
      login(accessToken, user);
      toast.success('Mentor Account created successfully!', { id: toastId });
      
      navigate('/mentor/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create account. Please try again.';
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
        className="sm:mx-auto sm:w-full sm:max-w-2xl text-center"
      >
        <Link to="/" className="inline-block mb-6">
           <img src="/logo.jpg" alt="AlumNSUT Logo" className="h-16 w-16 mx-auto object-contain rounded-full border border-slate-200 shadow-sm" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Mentor Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/auth/mentor/login" className="font-medium text-red-600 hover:text-red-700 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4 sm:px-0 pb-12"
      >
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="Jane Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="mentor@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                <input
                  type="text" name="company" required value={formData.company} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Position *</label>
                <input
                  type="text" name="currentPosition" required value={formData.currentPosition} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
                <input
                  type="number" name="yearsOfExperience" required min="0" max="50" value={formData.yearsOfExperience} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
                <input
                  type="text" name="industry" required value={formData.industry} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="Technology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile *</label>
                <input
                  type="url" name="linkedinUrl" required value={formData.linkedinUrl} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio *</label>
              <textarea
                name="bio" required rows={3} value={formData.bio} onChange={handleChange}
                className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all resize-none"
                placeholder="Tell students about your journey..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">General Availability (Optional)</label>
              <input
                type="text" name="availability" value={formData.availability} onChange={handleChange}
                className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                placeholder="e.g. Weekends 10AM - 2PM"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <input
                  type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password" name="confirmPassword" required minLength={8} value={formData.confirmPassword} onChange={handleChange}
                  className="appearance-none text-slate-900 block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="pt-2 pb-4">
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Mentor Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
