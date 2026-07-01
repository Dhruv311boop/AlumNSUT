import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase, Calendar } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="AlumNSUT Logo" className="h-10 w-10 object-contain rounded-full border border-slate-200 shadow-sm" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            AlumNSUT
          </span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#mentors" className="hover:text-indigo-600 transition-colors">Mentors</a>
          <a href="#community" className="hover:text-indigo-600 transition-colors">Community</a>
        </div>
        <div className="flex space-x-4">
          <Link to="/auth/role-selection" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
            Sign In
          </Link>
          <Link to="/auth/role-selection" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            <span>Join the exclusive NSUT Alumni Network</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Bridge the gap between <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Campus and Career
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed"
          >
            Connect with distinguished NSUT alumni, schedule 1:1 mentorship sessions, and accelerate your professional growth through real-world guidance.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/auth/student/login" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center">
              Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/auth/mentor/signup" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center">
              Become a Mentor
            </Link>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">A comprehensive platform designed specifically for the NSUT community.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Users className="h-6 w-6 text-blue-600"/>, title: "1:1 Mentorship", desc: "Book personalized sessions with alumni working at top tech companies." },
                { icon: <Briefcase className="h-6 w-6 text-emerald-600"/>, title: "Career Guidance", desc: "Get resume reviews, mock interviews, and career path advice." },
                { icon: <Calendar className="h-6 w-6 text-amber-600"/>, title: "Open Forum", desc: "Participate in community discussions and ask questions to the network." }
              ].map((feature, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                  <div className="bg-white p-3 rounded-xl inline-block mb-4 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
