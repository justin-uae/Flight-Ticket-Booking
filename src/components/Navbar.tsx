import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Plane } from 'lucide-react';

interface NavbarProps {
  onBookNowClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);


  // Click-outside handler for desktop user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm text-gray-900 border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            {/* Logo Icon */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg group-hover:shadow-lg transition-all">
              <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {/* Brand Text */}
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
              Compare<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Flight</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side - User Menu or Login */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold px-6 py-2.5 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Connect With Us
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 hover:text-purple-600 p-2"
              aria-label="mobile-menu-button"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-1 pt-4">
              <Link
                to="/"
                className="text-gray-800 hover:bg-purple-50 hover:text-purple-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/flights"
                className="text-gray-800 hover:bg-purple-50 hover:text-purple-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Flights
              </Link>
              <Link
                to="/about"
                className="text-gray-800 hover:bg-purple-50 hover:text-purple-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-800 hover:bg-purple-50 hover:text-purple-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="border-t border-gray-200 pt-4 mt-4 px-4 space-y-3">
                <>
                  <Link
                    to="/login"
                    className="block text-center border-2 border-gray-400 hover:border-purple-600 hover:bg-purple-50 text-gray-800 font-bold py-3 rounded-full transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connect With Us now
                  </Link>

                  <Link
                    to="/register"
                    className="block text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-full shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book Now
                  </Link>
                </>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;