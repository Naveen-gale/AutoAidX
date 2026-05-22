import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

const Models = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch brand name
    fetch(`${BACKEND}/api/brands`)
      .then((res) => res.json())
      .then((brands) => {
        const found = brands.find((b) => b._id === brandId);
        if (found) setBrandName(found.name);
      });

    // Fetch models for this brand
    fetch(`${BACKEND}/api/models/${brandId}`)
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load models.');
        setLoading(false);
      });
  }, [brandId]);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          <span className="text-blue-500">{brandName || 'Loading...'}</span> Models
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Choose your model to see common problems and get an AI diagnosis.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && !error && models.length === 0 && (
        <p className="text-center text-slate-400">No models added for this brand yet.</p>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {models.map((model) => (
          <div
            key={model._id}
            className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50"
          >
            <div className="w-full h-56 overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
              <img
                src={model.image}
                alt={model.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6 flex justify-between items-center bg-slate-900">
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-blue-400 transition-colors duration-200">
                {model.name}
              </h3>
              <button
                onClick={() => navigate(`/brand/${brandId}/${model._id}`)}
                className="bg-slate-800 text-blue-400 px-4 py-2 rounded-lg font-medium border border-slate-700 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-12 flex justify-center">
        <button
          onClick={() => navigate('/brand')}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors duration-200"
        >
          ← Back to Brands
        </button>
      </div>
    </div>
  );
};

export default Models;