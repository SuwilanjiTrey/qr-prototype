import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
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
import authUtils from './utils/auth_util.jsx';
import { firebaseUtils, clientOperationsUtils } from './components/data.jsx';
import ClientDashboard from './components/Client/dashboard.jsx';
import ColorFest from './components/Events/colorfest.jsx';
//import FirebaseTestDashboard from './config/firetestUI.jsx';

// Main App Component
const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase and user state on first load
    initializeApp();
  }, []);
  

  const initializeApp = async () => {
    try {
      // Initialize admin account if not exists
      await firebaseUtils.initializeAdmin();
      
      // Initialize sample client data for demo purposes
      await clientOperationsUtils.initializeSampleClient();
      
      // Check if user is already logged in
      await initializeUserState();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeUserState = async () => {
    try {
      // Check for stored session data using Firebase auth utils
      const storedUser = authUtils.getCurrentUser();
      const storedRole = authUtils.getCurrentRole();
      
      if (storedUser && storedRole) {
        setCurrentUser(storedUser);
        
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
      authUtils.clearAuth();
    }
  };

  const handleLogin = async (role, userData = null) => {
    try {
      // If userData is provided, use it directly
      if (userData) {
        // Store login state using Firebase auth utils
        authUtils.setCurrentUser(userData);
        setCurrentUser(userData);

        if (role === 'admin') {
          setIsAdmin(true);
          setIsClient(false);
        } else if (role === 'client') {
          setIsClient(true);
          setIsAdmin(false);
        }
        return;
      }

      // If no userData provided, this is a logout scenario
      handleLogout();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    // Clear all login state
    setIsAdmin(false);
    setIsClient(false);
    setCurrentUser(null);
    
    // Clear Firebase auth session
    authUtils.signOut();
  };


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
            {/*<Route path="/test" element={<FirebaseTestDashboard />} />*/}
            <Route path="/qr-prototype" element={<HomePage />} />
            <Route path="/qr-prototype/about" element={<AboutPage />} />
            <Route path="/qr-prototype/services" element={<ServicesPage />} />
            <Route path="/qr-prototype/contact" element={<ContactPage />} />

            <Route 
              path="/qr-prototype/login" 
              element={
                <LoginPage 
                  onLogin={handleLogin} 
                  isLoggedIn={isAdmin || isClient}
                  
                  authUtils={authUtils}
                  firebaseUtils={firebaseUtils}
                  clientOperationsUtils={clientOperationsUtils}
                />
              } 
            />
            <Route path="/register/:qrCode" element={<ColorFest />} />

            {isAdmin && (
              <Route 
                path="/qr-prototype/admin" 
                element={<AdminDashboard currentUser={currentUser} />} 
              />
            )}

            {isClient && (
              <Route 
                path="/qr-prototype/client" 
                element={<ClientDashboard currentUser={currentUser} />} 
              />
            )}
          </Routes>
        </main>
        
      </div>
    </Router>
  );
};

export default App;
