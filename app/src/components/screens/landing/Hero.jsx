import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const { data } = await axios.get(`${API_URL}/news/published?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearching(false);
        // If results exist, navigate to news page with search query
        navigate(`/news?search=${encodeURIComponent(searchQuery.trim())}`, { state: { initialResults: data } });
      } catch (error) {
        console.error('Search error:', error);
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-gray-900 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Your Source for Real-Time News
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Stay informed with the latest breaking news and in-depth reporting
          </p>
          
          <div className="max-w-2xl mx-auto mt-8">
            <form onSubmit={handleSearch} className="flex gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..." 
                className="flex-1 px-4 py-3 bg-white/10 text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSearching}
              />
              <button 
                type="submit"
                disabled={isSearching}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md transition-colors duration-200 font-medium
                  ${isSearching ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
