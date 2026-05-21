import React, { useState } from 'react';

const BACKEND = 'http://localhost:5000';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      // Redirect to admin panel — /auth will capture the token and log in
      window.location.href = `http://localhost:5174/auth?token=${data.token}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#5a5b60] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Login Card */}
      <div className="max-w-md w-full bg-[#2d2e36] rounded-xl shadow-2xl shadow-black/40 border border-[#4a4a50] p-8 opacity-0 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#4a4a50] rounded-full flex items-center justify-center border border-gray-500 shadow-inner">
              {/* Lock Icon */}
              <svg className="w-8 h-8 text-[#c8102e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Admin <span className="text-[#c8102e]">Access</span>
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            Please sign in to manage brands and AI configurations.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded px-4 py-3 text-sm text-center">
              {error}
            </div>
          )}
          
          {/* Email Input */}
          <div>
            <label flex="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Mail Icon */}
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:scale-[1.01] hover:shadow-sm"
                placeholder="admin@autoaidx.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label flex="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Key Icon */}
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:scale-[1.01] hover:shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 rounded shadow-md text-sm font-bold text-white bg-[#c8102e] hover:bg-[#a00c24] btn-hover disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2d2e36] focus:ring-[#c8102e]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 inline-block">
            ← Back to Auto AidX Home
          </a>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;