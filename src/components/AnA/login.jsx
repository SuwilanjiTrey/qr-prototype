import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Eye, EyeOff, Key, Mail, AlertCircle, RefreshCw } from 'lucide-react';

const LoginPage = ({ onLogin, isLoggedIn, authUtils, firebaseUtils, clientOperationsUtils }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState('');
  
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

  // Initialize Firebase data with better error handling
  useEffect(() => {
    const initializeData = async () => {
      try {
        setInitializing(true);
        setInitializationStatus('Checking system status...');
        
        // Check if already initialized first
        const isInitialized = await firebaseUtils.isSystemInitialized();
        
        if (!isInitialized) {
          setInitializationStatus('Creating admin account...');
          await firebaseUtils.initializeAdmin();
          
          setInitializationStatus('Setting up sample data...');
          await clientOperationsUtils.initializeSampleClient();
          
          console.log('System initialized successfully');
          setInitializationStatus('System ready!');
        } else {
          console.log('System already initialized');
          setInitializationStatus('System ready!');
        }
        
        // Small delay to show the status
        setTimeout(() => {
          setInitializationStatus('');
        }, 1000);
        
      } catch (error) {
        console.error('Error initializing data:', error);
        setInitializationStatus('Initialization failed. Retrying...');
        
        // Retry initialization after a delay
        setTimeout(() => {
          setInitializationStatus('');
        }, 3000);
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
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login attempt with Firebase Auth:', formData.email);
      const userData = await authUtils.signIn(formData.email, formData.password);
      console.log('Firebase Auth successful:', userData);
    } catch (err) {
      console.error('Login error:', err);
      
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
        errorMessage = 'Account exists but data is missing. This usually happens during system setup. Please try again in a moment or contact support.';
        
        // For admin account specifically, try to reinitialize
        if (formData.email === 'admin@system.com') {
          console.log('Admin data missing, attempting to reinitialize...');
          try {
            await firebaseUtils.initializeAdmin();
            errorMessage = 'Admin data was restored. Please try logging in again.';
          } catch (reinitError) {
            console.error('Failed to reinitialize admin:', reinitError);
            errorMessage = 'Failed to restore admin data. Please refresh the page and try again.';
          }
        }
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Database access denied. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSystem = async () => {
    setInitializing(true);
    setInitializationStatus('Debugging system...');
    
    try {
      // Debug current state
      await firebaseUtils.debugDatabase();
      
      setInitializationStatus('Resetting system...');
      await firebaseUtils.forceResetSystem();
      
      setInitializationStatus('Reinitializing admin...');
      await firebaseUtils.initializeAdmin();
      
      setInitializationStatus('Reinitializing sample client...');
      await clientOperationsUtils.initializeSampleClient();
      
      setInitializationStatus('System refreshed successfully!');
      
      setTimeout(() => {
        setInitializationStatus('');
        setInitializing(false);
      }, 2000);
    } catch (error) {
      console.error('Error refreshing system:', error);
      setInitializationStatus('Refresh failed');
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Initializing application...</p>
          {initializationStatus && (
            <p className="text-sm text-blue-600">{initializationStatus}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and password to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
              <AlertCircle className="flex-shrink-0 mt-0.5 mr-2" size={16} />
              <div className="text-sm">
                {error}
                {error.includes('data is missing') && (
                  <button
                    onClick={handleRefreshSystem}
                    className="ml-2 text-blue-600 hover:text-blue-500 underline inline-flex items-center"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Refresh System
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p><strong>Admin:</strong> admin2@company.com / admin123456</p>
            <p><strong>Sample Client:</strong> test@client.com / temp12345</p>
          </div>

          {/* Debug Tools 
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded text-sm">
            <p className="font-medium mb-2">Debug Tools:</p>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => firebaseUtils.debugDatabase()}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                Debug DB
              </button>
              <button
                type="button"
                onClick={handleRefreshSystem}
                disabled={initializing}
                className="text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded disabled:opacity-50"
              >
                Reset System
              </button>
            </div>
          </div>
          */}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
