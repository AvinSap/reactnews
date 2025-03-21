import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Comments from "../comments/Comments";


const SingleNews = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = true; // Replace with actual auth check

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/${id}`);
        if (!response.ok) {
          throw new Error('News not found');
        }
        const data = await response.json();
        setNewsItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error || !newsItem) {
    return <div className="text-center py-16 text-red-600">{error || 'News not found'}</div>;
  }

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 py-16">
        <Link
          to="/news"
          className="text-blue-600 hover:text-blue-800 mb-8 block"
        >
          ← Back to News
        </Link>
        <div className="relative h-96 mb-8">
          <img
            src={newsItem.image_url}
            alt={newsItem.title}
            className="w-full h-full object-cover rounded-xl"
          />
          <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {newsItem.status}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {newsItem.title}
        </h1>
        <p className="text-gray-600 text-lg">{newsItem.content}</p>
        <Comments 
          newsId={newsItem.id}
          comments={newsItem.comments}
          isLoggedIn={isLoggedIn}
        />
      </article>
    </>
  );
};

export default SingleNews;
