import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  QrCode, 
  BarChart3, 
  Plus, 
  Home, 
  Info, 
  Phone, 
  Settings, 
  LogIn, 
  LogOut, 
  User, 
  UserCheck, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar = ({ isAdmin, isClient, currentUser, onSetIsAdmin, onSetIsClient, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/qr-prototype");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isLoggedIn = isAdmin || isClient;

  // Admin Navigation Links
  const AdminNav = () => (
    <>
      <Link 
        to="/qr-prototype/admin" 
        className="text-gray-300 hover:text-cyan-400 font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <BarChart3 size={20} />
        <span>Dashboard</span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-2 text-cyan-300 bg-slate-800/50 px-3 py-1 rounded-full border border-cyan-500/30">
        <UserCheck size={16} />
        <span className="text-sm font-medium">Admin: {currentUser?.name || 'Admin'}</span>
      </div>
      
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 font-medium"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </>
  );

  // Client Navigation Links
  const ClientNav = () => (
    <>
      <Link 
        to="/qr-prototype/client" 
        className="text-gray-300 hover:text-purple-400 font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <QrCode size={20} />
        <span>Dashboard</span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-2 text-purple-300 bg-slate-800/50 px-3 py-1 rounded-full border border-purple-500/30">
        <User size={16} />
        <span className="text-sm font-medium">{currentUser?.name || 'Client'}</span>
      </div>
      
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 font-medium"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </>
  );

  // Guest Navigation Links
  const GuestNav = () => (
    <>
    	<a href="#/qr-prototype" className="block text-gray-300 font-medium text-lg hover:text-cyan-400 transition-colors py-2">
            Home
          </a>
          <a href="#/qr-prototype/services" className="block text-gray-300 font-medium text-lg hover:text-cyan-400 transition-colors py-2">
            Services
          </a>
          <a href="#/qr-prototype/about" className="block text-gray-300 font-medium text-lg hover:text-purple-400 transition-colors py-2">
            About
          </a>
          <a href="#/qr-prototype/contact" className="block text-gray-300 font-medium text-lg hover:text-pink-400 transition-colors py-2">
            Contact
          </a>
      
      <Link
        to="/qr-prototype/login"
        className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-2 rounded-full hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2 font-medium"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <LogIn size={16} />
        <span>Login</span>
      </Link>
      
      <button className="relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
        <span className="relative z-10">Partner With Us</span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </>
  );

  // Mobile Navigation Content
  const MobileNavContent = () => {
    if (isAdmin) {
      return (
        <>
          <Link 
            to="/qr-prototype/admin" 
            className="block text-gray-300 font-medium text-lg hover:text-cyan-400 transition-colors flex items-center space-x-3 py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <BarChart3 size={20} />
            <span>Admin Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3 text-cyan-300 py-2 border-t border-white/10 mt-4 pt-4">
            <UserCheck size={16} />
            <span className="text-sm">Admin: {currentUser?.name || 'Admin'}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-full font-bold text-lg mt-4 flex items-center justify-center space-x-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </>
      );
    } else if (isClient) {
      return (
        <>
          <Link 
            to="#/qr-prototype/client" 
            className="block text-gray-300 font-medium text-lg hover:text-purple-400 transition-colors flex items-center space-x-3 py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <QrCode size={20} />
            <span>Client Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3 text-purple-300 py-2 border-t border-white/10 mt-4 pt-4">
            <User size={16} />
            <span className="text-sm">{currentUser?.name || 'Client'}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-full font-bold text-lg mt-4 flex items-center justify-center space-x-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </>
      );
            
         
          
    } else {
      return (
        <>
        <a href="#/qr-prototype" className="block text-gray-300 font-medium text-lg hover:text-cyan-400 transition-colors py-2">
            Home
          </a>
          <a href="#/qr-prototype/services" className="block text-gray-300 font-medium text-lg hover:text-cyan-400 transition-colors py-2">
            Services
          </a>
          <a href="#/qr-prototype/about" className="block text-gray-300 font-medium text-lg hover:text-purple-400 transition-colors py-2">
            About
          </a>
          <a href="#/qr-prototype/contact" className="block text-gray-300 font-medium text-lg hover:text-pink-400 transition-colors py-2">
            Contact
          </a>
          
          <Link
            to="/qr-prototype/login"
            className="block bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 text-center font-medium mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogIn size={16} className="inline mr-2" />
            Login
          </Link>
          
          <button className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-3 rounded-full font-bold text-lg mt-4">
            Partner With Us
          </button>
        </>
      );
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/qr-prototype" className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                  <QrCode className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl animate-ping opacity-20"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AdQR Pro
                </span>
                <div className="text-xs text-gray-400 font-medium">Advertising Revolution</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isAdmin ? <AdminNav /> : isClient ? <ClientNav /> : <GuestNav />}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-8 space-y-4">
              <MobileNavContent />
            </div>
          </div>
        )}
      </nav>

      {/* Status Bar for Logged In Users */}
      {isLoggedIn && (
        <div className="fixed top-20 w-full z-40 bg-slate-900/80 backdrop-blur-sm border-b border-white/10 py-2 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-xs text-gray-300">
              <span className="flex items-center space-x-2">
                {isAdmin ? <UserCheck size={14} /> : <User size={14} />}
                <span>
                  Logged in as: {isAdmin ? 'Administrator' : 'Client'}
                  {currentUser?.email && ` (${currentUser.email})`}
                </span>
              </span>
              <span className="text-gray-400">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
