import React from 'react';
import { Link } from 'react-router-dom';

const Heder = () => {
  return (
    <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3 group">
            {/* Wrench Icon with subtle background */}
            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300">
              <svg className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <Link to="/" className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Auto Aid<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">X</span>
            </Link>
          </div>

          {/* Navigation Routes */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/brand"
              className="text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-slate-800/50"
            >
              Brands
            </Link>
            
            {/* Highlighted AI Mechanic Link */}
            <Link
              to="/ai"
              className="relative group px-4 py-2 font-medium transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-r from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2 text-blue-400 group-hover:text-blue-300">
                {/* Spark/Lightning Icon */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Mechanic
              </span>
            </Link>
          </nav>

          {/* Admin Section */}
          <div className="flex items-center">
            <Link
              to="/admin"
              className="group flex items-center gap-2 text-slate-400 hover:text-white bg-slate-900/50 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border border-slate-700 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            >
              {/* User Icon SVG */}
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline text-sm">Admin</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Heder;