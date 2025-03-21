const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h4 className="text-white text-lg font-semibold">ReactNews</h4>
            <p className="text-sm text-gray-400">Your trusted source for latest news</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-3">
            <h4 className="text-white text-lg font-semibold">Stay Updated</h4>
            <p className="text-sm text-gray-400">Subscribe to our newsletter</p>
            <form className="mt-2 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-400">&copy; 2025 Avin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
