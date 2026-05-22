import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

const Solution = () => {
  const { brandId, modelId, problemId } = useParams();
  const navigate = useNavigate();

  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [context, setContext] = useState({ brand: '', model: '', problem: '' });

  useEffect(() => {
    const fetchContext = async () => {
      try {
        // Fetch brand name
        const brandsRes = await fetch(`${BACKEND}/api/brands`);
        const brands = await brandsRes.json();
        const brand = brands.find((b) => b._id === brandId);

        // Fetch model name
        const modelsRes = await fetch(`${BACKEND}/api/models/${brandId}`);
        const models = await modelsRes.json();
        const model = models.find((m) => m._id === modelId);

        // Fetch problem title
        const problemsRes = await fetch(`${BACKEND}/api/problems/${modelId}`);
        const problems = await problemsRes.json();
        const problem = problems.find((p) => p._id === problemId);

        const ctx = {
          brand: brand?.name || 'Unknown Brand',
          model: model?.name || 'Unknown Model',
          problem: problem?.title || 'Unknown Problem',
        };
        setContext(ctx);

        // Call AI Solution API
        const aiRes = await fetch(`${BACKEND}/api/ai/solution`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ctx),
        });
        const aiData = await aiRes.json();
        setSolution(aiData.solution || 'No solution generated.');
      } catch (_err) {
        setError('Failed to generate AI solution. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContext();
  }, [brandId, modelId, problemId]);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Generated Diagnosis
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Repair <span className="text-blue-500">Solution</span>
          </h2>
          {context.brand && (
            <p className="text-slate-400">
              {context.brand} &rarr; {context.model} &rarr;{' '}
              <span className="text-red-400">{context.problem}</span>
            </p>
          )}
        </div>

        {/* Content card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {loading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 animate-pulse">AI Mechanic is analyzing your problem...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && solution && (
            <div className="prose prose-invert max-w-none">
              {solution.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <br key={i} />;
                // Numbered steps — bold them
                if (/^\d+\./.test(trimmed)) {
                  return (
                    <p key={i} className="flex gap-3 mb-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {trimmed.match(/^(\d+)/)[1]}
                      </span>
                      <span className="text-slate-200 leading-relaxed">
                        {trimmed.replace(/^\d+\.\s*/, '')}
                      </span>
                    </p>
                  );
                }
                // Bold headers like **Tools needed:**
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return (
                    <p key={i} className="text-blue-400 font-semibold mt-4 mb-2">
                      {trimmed.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-slate-300 leading-relaxed mb-2">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(`/brand/${brandId}/${modelId}`)}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors duration-200"
          >
            ← Back to Problems
          </button>
        </div>
      </div>
    </div>
  );
};

export default Solution;
