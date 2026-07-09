import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Dashboard Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="h-10 w-10 object-contain rounded-full border border-slate-200 shadow-sm" />
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
            AlumNSUT
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-slate-600 font-medium hidden sm:inline-block">Welcome, {user?.email.split('@')[0]}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-3 py-2 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-900 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl shadow-indigo-900/20 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Accelerate your Career</h1>
            <p className="text-lg text-indigo-100 leading-relaxed">
              Connect with top NSUT alumni, schedule 1:1 mentorship sessions, and gain industry insights to land your dream role.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Column: Requested Mentors */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Your Mentorship Requests</h2>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Mock Pending Request */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    AS
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Amit Sharma</h3>
                    <p className="text-sm text-slate-500">Software Engineer at Google</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mb-1">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </span>
                  <p className="text-xs text-slate-400">Requested 2 days ago</p>
                </div>
              </motion.div>

              {/* Mock Accepted Request */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                    NK
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Neha Kapoor</h3>
                    <p className="text-sm text-slate-500">Product Manager at Microsoft</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-1">
                    <CheckCircle className="w-3 h-3 mr-1" /> Accepted
                  </span>
                  <p className="text-xs text-slate-600 font-medium flex items-center justify-end">
                    <Calendar className="w-3 h-3 mr-1" /> Oct 24, 10:00 AM
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Recommended Mentors */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recommended</h2>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {[
                { name: 'Rahul Verma', role: 'SDE-2 at Amazon', bg: 'from-orange-100 to-red-100', color: 'text-orange-700' },
                { name: 'Priya Singh', role: 'Data Scientist at Meta', bg: 'from-blue-100 to-cyan-100', color: 'text-blue-700' },
                { name: 'Vikram Das', role: 'Founding Engineer at Stripe', bg: 'from-purple-100 to-fuchsia-100', color: 'text-purple-700' }
              ].map((mentor, idx) => (
                <motion.div key={idx} variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                   <div className="flex items-center space-x-4 mb-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${mentor.bg} flex items-center justify-center ${mentor.color} font-bold`}>
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{mentor.name}</h3>
                      <p className="text-xs text-slate-500">{mentor.role}</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg transition-colors border border-slate-200 hover:border-indigo-200">
                    View Profile
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
