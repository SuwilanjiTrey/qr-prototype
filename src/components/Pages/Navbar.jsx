import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, QrCode, BarChart3, Plus, Home, Info, Phone, Settings, LogIn, LogOut, User, UserCheck, Menu, X } from 'lucide-react'; // Import Menu and X icons

// Navbar Component
const Navbar = ({ isAdmin, isClient, currentUser, onSetIsAdmin, onSetIsClient, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu visibility

  const handleLogout = () => {
    // Call the logout function from App.jsx
    onLogout();
    navigate("/qr-prototype"); // Redirect to homepage after logout
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if user is logged in (either admin or client)
  const isLoggedIn = isAdmin || isClient;

  // Define navigation links based on user role
  const getNavLinks = () => {
    if (isAdmin) {
      return (
        <>
          <Link to="/qr-prototype/admin" className="flex items-center space-x-2 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>
          {/* Admin User Info - better placed outside main nav links for mobile */}
          <div className="md:flex items-center space-x-2 text-blue-200 hidden"> {/* Hide on small screens within nav */}
            <UserCheck size={16} />
            <span className="text-sm">Admin: {currentUser?.name || 'Admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 hover:text-blue-200 transition-colors bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </>
      );
    } else if (isClient) {
      return (
        <>
          <Link to="/qr-prototype/client" className="flex items-center space-x-2 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <QrCode size={20} />
            <span>Dashboard</span>
          </Link>
          {/* Client User Info - better placed outside main nav links for mobile */}
          <div className="md:flex items-center space-x-2 text-blue-200 hidden"> {/* Hide on small screens within nav */}
            <User size={16} />
            <span className="text-sm">{currentUser?.name || 'Client'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 hover:text-blue-200 transition-colors bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/qr-prototype" className="flex items-center space-x-2 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/qr-prototype/about" className="flex items-center space-x-2 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <Info size={16} />
            <span>About</span>
          </Link>
          <Link to="/qr-prototype/services" className="flex items-center space-x-2 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <Settings size={16} />
            <span>Services</span>
          </Link>
          <Link to="/qr-prototype/contact" className="flex items-center space-x-2 hover:text-blue-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <Phone size={16} />
            <span>Contact</span>
          </Link>
          <Link
            to="/qr-prototype/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogIn size={16} />
            <span>Login</span>
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/qr-prototype" className="text-2xl font-bold">QR Analytics</Link>

          {/* Hamburger menu button for small screens */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {getNavLinks()}
          </div>
        </div>

        {/* Mobile Navigation Menu (conditionally rendered) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-700 bg-opacity-95 py-4 px-4 rounded-b-lg shadow-xl">
            <div className="flex flex-col space-y-4">
              {getNavLinks()}
              {/* Show user info in mobile menu if logged in */}
              {isLoggedIn && (
                <div className="flex items-center space-x-2 text-blue-200 pt-4 border-t border-blue-600">
                  {isAdmin ? <UserCheck size={16} /> : <User size={16} />}
                  <span className="text-sm">
                    {isAdmin ? 'Admin' : 'Client'}: {currentUser?.name || 'Guest'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optional: Show current user status in a subtle way (always visible on desktop) */}
      {isLoggedIn && (
        <div className="bg-blue-700 bg-opacity-50 py-1 hidden md:block"> {/* Hide on small screens */}
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-xs text-blue-100">
              <span>
                Logged in as: {isAdmin ? 'Administrator' : 'Client'}
                {currentUser?.email && ` (${currentUser.email})`}
              </span>
              <span className="text-blue-200">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;