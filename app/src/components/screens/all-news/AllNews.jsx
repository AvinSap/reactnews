import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news/published`);
        setNews(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">All News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link 
              key={item.id} 
              to={`/news/${item.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {item.content}
                </p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200">
                  Read More →
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllNews;