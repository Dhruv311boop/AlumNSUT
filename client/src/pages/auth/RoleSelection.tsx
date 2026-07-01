import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-block">
          <img src="/logo.png" alt="AlumNSUT Logo" className="h-16 w-16 mx-auto object-contain rounded-full border border-slate-200 shadow-sm" />
        </Link>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900">
          Welcome to AlumNSUT
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Please select your role to continue
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/auth/student/login"
            className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">Continue as Student</h3>
              <p className="text-sm text-slate-500">I am currently studying or a recent graduate</p>
            </div>
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7M5 9.6v4.8a2 2 0 001 1.73l5 3a2 2 0 002 0l5-3a2 2 0 001-1.73V9.6" />
              </svg>
            </div>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/auth/mentor/login"
            className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-rose-500 hover:ring-1 hover:ring-rose-500 transition-all"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">Continue as Mentor</h3>
              <p className="text-sm text-slate-500">I am an established alumni looking to give back</p>
            </div>
            <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
