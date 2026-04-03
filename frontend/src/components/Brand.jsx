import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

const Brand = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/brands`)
      .then((res) => res.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load brands. Is the backend running?');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 z-0">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight mb-6">
          Supported <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Brands</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Select your vehicle's make to get specialized assistance from our AI Mechanic and tailored solutions.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Syncing vehicle databases...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-lg mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center backdrop-blur-sm">
          <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && brands.length === 0 && (
        <div className="max-w-lg mx-auto bg-slate-900/50 border border-slate-800 rounded-2xl p-10 text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-slate-300 font-medium mb-2">No brands available yet.</p>
          <p className="text-slate-500 text-sm">Please ask the system administrator to add vehicle models.</p>
        </div>
      )}

      {/* Brand Grid */}
      {!loading && !error && brands.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
          {brands.map((brand) => (
            <div
              key={brand._id}
              onClick={() => navigate(`/brand/${brand._id}`)}
              className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-5 transition-all duration-500 hover:-translate-y-2 hover:bg-slate-800/60 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-pointer overflow-hidden"
            >
              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white/95 rounded-2xl flex items-center justify-center p-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Logo'; }}
                />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-slate-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-300 transition-all duration-300 text-center">
                {brand.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brand;