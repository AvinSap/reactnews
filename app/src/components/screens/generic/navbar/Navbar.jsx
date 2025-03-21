import { Link } from 'react-router-dom';
import { useAuth } from '../../../../../utils/context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">Semo News</Link>
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/news" className="text-gray-700 hover:text-blue-600">All News</Link>
        </div>
        <div className="space-x-4">
          {auth ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                Hello, {auth.user.name}
              </Link>
              {auth.user.role === 'admin' && (
                <Link to="/admin" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
