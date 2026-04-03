import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

const Problem = () => {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [modelName, setModelName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch model name
    fetch(`${BACKEND}/api/models/${brandId}`)
      .then((res) => res.json())
      .then((models) => {
        const found = models.find((m) => m._id === modelId);
        if (found) setModelName(found.name);
      });

    // Fetch problems for this model
    fetch(`${BACKEND}/api/problems/${modelId}`)
      .then((res) => res.json())
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load problems.');
        setLoading(false);
      });
  }, [modelId]);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
          What seems to be the <span className="text-red-500">Problem?</span>
        </h2>
        {modelName && (
          <p className="text-slate-500 text-sm">Model: <span className="text-blue-400">{modelName}</span></p>
        )}
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-2">
          Select the issue and our AI Mechanic will generate a diagnostic report.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && !error && problems.length === 0 && (
        <p className="text-center text-slate-400">No problems added for this model yet.</p>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20 hover:border-red-500/50 cursor-pointer"
          >
            <div className="w-full h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors duration-300 z-10" />
              <img
                src={problem.image}
                alt={problem.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow bg-slate-900">
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-red-400 transition-colors duration-200 mb-2">
                {problem.title}
              </h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">{problem.desc}</p>
              <button
                onClick={() => navigate(`/brand/${brandId}/${modelId}/${problem._id}`)}
                className="w-full bg-slate-800 text-red-400 px-4 py-3 rounded-lg font-medium border border-slate-700 transition-colors duration-200 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Diagnose with AI
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex justify-center">
        <button
          onClick={() => navigate(`/brand/${brandId}`)}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors duration-200"
        >
          ← Back to Models
        </button>
      </div>
    </div>
  );
};

export default Problem;