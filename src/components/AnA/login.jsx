import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authUtils from '../../utils/auth_util'; // Updated import path
import { firebaseUtils, clientOperationsUtils } from '../data.jsx';

const LoginPage = ({ onLogin, isLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = authUtils.onAuthStateChange((user) => {
      if (user) {
        onLogin(user.role, user);
        navigate(user.role === 'admin' ? '/qr-prototype/admin' : '/qr-prototype/client');
      }
    });

    return () => unsubscribe();
  }, [onLogin, navigate]);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const role = authUtils.getCurrentRole();
      navigate(role === 'admin' ? '/qr-prototype/admin' : '/qr-prototype/client');
    }
  }, [isLoggedIn, navigate]);

  // Initialize Firebase data and show debug info
  useEffect(() => {
    const initializeData = async () => {
      try {
        setInitializing(true);
        
        // Initialize admin
        await firebaseUtils.initializeAdmin();
        
        // Initialize sample client data
        await clientOperationsUtils.initializeSampleClient();
        
        // Get all clients for debug info
        const clients = await firebaseUtils.getClients();
        console.log('All clients in Firebase:', clients);
        
        const debugText = `
Debug Info:
- Total clients: ${clients.length}
- Admin exists: ${clients.some(c => c.role === 'admin')}
- Admin email: ${clients.find(c => c.role === 'admin')?.email || 'Not found'}
- Client exists: ${clients.some(c => c.role === 'client')}
- Client email: ${clients.find(c => c.role === 'client')?.email || 'Not found'}
        `;
        setDebugInfo(debugText);
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to initialize application data');
      } finally {
        setInitializing(false);
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login attempt with Firebase Auth:', formData.email);
      
      // Use Firebase Authentication
      const userData = await authUtils.signIn(formData.email, formData.password);
      console.log('Firebase Auth successful:', userData);
      
      // onLogin and navigation will be handled by the auth state change listener
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific Firebase Auth errors
      let errorMessage = 'An error occurred during login. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (err.message === 'User data not found in database') {
        errorMessage = 'Account exists but user data is missing. Please contact support.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Manual debug buttons (for development only)
  const handleCreateTestAccounts = async () => {
    try {
      setLoading(true);
      
      // Create admin account
      try {
        await authUtils.createUser('admin@system.com', 'admin123', {
          name: 'Admin',
          role: 'admin',
          qrCode: 'admin-qr',
          url: '/register/admin-qr',
          phone: '+260 000 000 000'
        });
        console.log('Admin account created');
      } catch (err) {
        if (err.code !== 'auth/email-already-in-use') {
          throw err;
        }
        console.log('Admin account already exists');
      }
      
      // Create client account
      try {
        await authUtils.createUser('contact@alphapromo.com', 'client123', {
          name: 'AlphaPromo Marketing',
          role: 'client',
          qrCode: 'qr-abc123',
          url: '/register/qr-abc123',
          phone: '+260 123 456 789'
        });
        console.log('Client account created');
      } catch (err) {
        if (err.code !== 'auth/email-already-in-use') {
          throw err;
        }
        console.log('Client account already exists');
      }
      
      alert('Test accounts created/verified successfully!');
      
    } catch (error) {
      console.error('Error creating test accounts:', error);
      alert('Error creating test accounts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = () => {
    authUtils.clearAuth();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Using Firebase Authentication
          </p>
        </div>

        {/* Debug Information */}
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded text-xs">
          <pre>{debugInfo}</pre>
          <div className="mt-2 space-x-2">
            <button
              onClick={handleCreateTestAccounts}
              disabled={loading}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
            >
              Create Test Accounts
            </button>
            <button
              onClick={handleClearStorage}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
            >
              Clear Storage
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p><strong>Admin:</strong> admin@system.com / admin123</p>
            <p><strong>Client:</strong> contact@alphapromo.com / client123</p>
            <p className="text-xs mt-2 text-blue-600">
              Click "Create Test Accounts" if accounts don't exist yet.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || initializing}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : initializing ? 'Initializing...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
