import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

const Brand = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New search filter feature requested
  const [searchQuery, setSearchQuery] = useState('');
  
  // Alphabetical sorting state
  const [sortOrder, setSortOrder] = useState('default');

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

  // Filter and Sort logic
  const processedBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortOrder === 'asc') {
    processedBrands.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'desc') {
    processedBrands.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className="min-h-screen bg-[#5a5b60] font-sans pb-16">
      
      {/* Hero Section */}
      <div className="bg-[#2d2e36] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Overlapping Leaves Image Shapes */}
          <div className="flex -space-x-8 md:-space-x-12 justify-center md:w-1/2 relative z-10 pt-6 pb-6">
            <div className="w-40 h-56 sm:w-48 sm:h-64 bg-gray-500 overflow-hidden relative z-0 opacity-60 hover:opacity-100 hover:z-50 hover:scale-110 hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl group" style={{ borderRadius: '120px 0 120px 0' }}>
               <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Car 1" />
            </div>
            <div className="w-40 h-56 sm:w-48 sm:h-64 bg-gray-400 overflow-hidden relative z-10 scale-110 hover:z-50 hover:scale-125 hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group" style={{ borderRadius: '120px 0 120px 0' }}>
               <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Car 2" />
            </div>
            <div className="w-40 h-56 sm:w-48 sm:h-64 bg-gray-600 overflow-hidden relative z-0 opacity-60 hover:opacity-100 hover:z-50 hover:scale-110 hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl group" style={{ borderRadius: '120px 0 120px 0' }}>
               <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSUqEUSJsJNda28yQQC-9b6e2J3mhnAGynYg&s" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Car 3" />
            </div>
          </div>
          
          {/* Hero Text */}
          <div className="md:w-1/2 text-center md:text-left z-10 pl-0 md:pl-8 animate-slide-in-right">
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-semibold mb-6 leading-tight tracking-wide">
              Snap a Photo,<br/> Fix Your Car
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Got a car issue? Just take a picture and post it here. We'll provide a video solution to help you fix it easily.
            </p>
            <button 
              className="bg-white text-black font-bold px-8 py-3.5 hover:bg-gray-200 btn-hover"
              onClick={() => document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {loading && (
          <div className="flex justify-center py-20 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 text-center rounded">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Filter */}
            <div className="w-full lg:w-72 bg-[#4a4a50] p-7 text-white shrink-0 shadow-xl">
              <h2 className="text-[22px] font-normal tracking-wide mb-8">Brand Finder</h2>
              
              <div className="mb-6">
                <label className="block text-sm text-gray-200 mb-2">Search Brand</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search Make..." 
                    className="w-full p-3 text-black bg-white focus:outline-none text-sm hover:shadow-md focus:shadow-md transition-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-gray-200 mb-2">Sort Alphabetically</label>
                <div className="relative">
                  <select 
                    className="w-full p-3 text-gray-600 bg-white focus:outline-none appearance-none text-sm hover:shadow-md focus:shadow-md transition-shadow"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="default">Default Order</option>
                    <option value="asc">A to Z</option>
                    <option value="desc">Z to A</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full bg-transparent text-gray-300 font-medium py-3 flex items-center justify-center gap-2 border border-gray-500 hover:text-white hover:border-white hover:bg-gray-700 transition-all btn-hover text-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSortOrder('default');
                }}
              >
                Reset Filters 
              </button>
            </div>
            
            {/* Brands Grid */}
            <div className="flex-1 w-full">
              {processedBrands.length === 0 ? (
                 <div className="text-white text-center py-10 text-lg">No brands match your search.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {processedBrands.map((brand, index) => (
                    <div 
                      key={brand._id} 
                      onClick={() => navigate(`/brand/${brand._id}`)}
                      className="bg-white flex flex-col cursor-pointer hover-lift relative border border-gray-100 animate-fade-in-up shadow-md"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Badge */}
                      <div className="absolute top-4 right-4 bg-[#c8102e] text-white px-3 py-1 text-[13px] font-bold z-10 tracking-wide shadow-sm">
                        NEW
                      </div>
                      
                      {/* Brand Logo as Car Image */}
                      <div className="h-[220px] w-full bg-[#f3f4f6] flex items-center justify-center p-8 relative overflow-hidden group">
                        <img 
                          src={brand.logo} 
                          alt={`${brand.name} logo`} 
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Logo'; }} 
                        />
                      </div>
                      
                      {/* Card Content */}
                      <div className="pt-5 pb-5 px-5 flex flex-col flex-1 text-center border-t border-gray-100">
                        <p className="text-gray-500 text-[15px] mb-1 font-medium tracking-wide">Brand Name</p>
                        <h3 className="text-[22px] font-bold text-black mb-3">{brand.name}</h3>
                        
                        <button className="w-full bg-[#c8102e] hover:bg-[#a00c24] text-white font-bold py-3 transition-colors mt-auto text-[15px] btn-hover">
                          SELECT MODEL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Dots */}
              {processedBrands.length > 0 && (
                <div className="flex justify-center items-center gap-3 mt-12 text-white pb-8">
                  <button className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-500 hover:border-gray-500 hover:scale-110 transition-all shadow-sm">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-500 hover:border-gray-500 hover:scale-110 transition-all shadow-sm">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform shadow-md">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-500 hover:border-gray-500 hover:scale-110 transition-all shadow-sm">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-500 hover:border-gray-500 hover:scale-110 transition-all shadow-sm">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;