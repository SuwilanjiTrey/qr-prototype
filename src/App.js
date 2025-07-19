import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

import HomePage from './components/Homepage.jsx';
import AboutPage from './components/Pages/About.jsx';
import ServicesPage from './components/Pages/Services.jsx';
import ContactPage from './components/Pages/Contact.jsx';
import LoginPage from './components/AnA/login.jsx';
import RegisterPage from './components/AnA/Registration.jsx';
import AdminDashboard from './components/Admin/dashboard.jsx';
import Navbar from './components/Pages/Navbar.jsx';
import Footer from './components/Pages/Footer.jsx';
import { localStorageUtils, clientStorageUtils } from './components/data.jsx';
import ClientDashboard from './components/Client/dashboard.jsx';

// Main App Component
const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize admin client on first load
    localStorageUtils.initializeAdmin();
    
    // Check if user is already logged in
    initializeUserState();
  }, []);

  const initializeUserState = () => {
    try {
      // Check for stored session data
      const storedUser = localStorage.getItem('currentUser');
      const storedRole = localStorage.getItem('userRole');
      
      if (storedUser && storedRole) {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        
        if (storedRole === 'admin') {
          setIsAdmin(true);
          setIsClient(false);
        } else if (storedRole === 'client') {
          setIsClient(true);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Error initializing user state:', error);
      // Clear corrupted data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (role, userData = null) => {
    try {
      // Store login state in localStorage for persistence
      localStorage.setItem('userRole', role);
      if (userData) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);
      }

      if (role === 'admin') {
        setIsAdmin(true);
        setIsClient(false);
      } else if (role === 'client') {
        setIsClient(true);
        setIsAdmin(false);
      } else {
        // Handle logout or invalid role
        handleLogout();
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    // Clear all login state
    setIsAdmin(false);
    setIsClient(false);
    setCurrentUser(null);
    
    // Clear localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  };

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          isAdmin={isAdmin}
          isClient={isClient}
          currentUser={currentUser}
          onSetIsAdmin={setIsAdmin}
          onSetIsClient={setIsClient}
          onLogout={handleLogout}
        />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
	    <Route path="/qr-prototype" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route 
              path="/login" 
              element={
                <LoginPage 
                  onLogin={handleLogin} 
                  isLoggedIn={isAdmin || isClient}
                />
              } 
            />
            <Route path="/register/:qrCode" element={<RegisterPage />} />

            {isAdmin && (
              <Route 
                path="/admin" 
                element={<AdminDashboard currentUser={currentUser} />} 
              />
            )}

            {isClient && (
              <Route 
                path="/client" 
                element={<ClientDashboard currentUser={currentUser} />} 
              />
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;