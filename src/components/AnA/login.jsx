import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Eye, EyeOff, Key, Mail, QrCode, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';

const LoginPage = ({ onLogin, isLoggedIn, authUtils, firebaseUtils, clientOperationsUtils }) => {
  const [loginMode, setLoginMode] = useState('regular'); // 'regular' or 'initialize'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    qrCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          // Optionally retry or show error
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

  const handleRegularLogin = async (e) => {
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

  const handlePasswordInitialization = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Use the auth utils method to initialize password
      await authUtils.initializeClientPassword(
        formData.email, 
        formData.qrCode, 
        formData.newPassword
      );

      console.log('Password initialized successfully');
      
    } catch (err) {
      console.error('Password initialization error:', err);
      
      let errorMessage = 'Failed to initialize password';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Account already exists. Use regular login.';
      } else if (err.code === 'permission-denied') {
        errorMessage = 'System error. Please contact support.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const switchToInitializeMode = () => {
    setLoginMode('initialize');
    setFormData({
      email: '',
      password: '',
      qrCode: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
  };

  const switchToRegularMode = () => {
    setLoginMode('regular');
    setFormData({
      email: '',
      password: '',
      qrCode: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {loginMode === 'regular' ? 'Sign in to your account' : 'Initialize Your Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {loginMode === 'regular' 
              ? 'Enter your email and password to continue' 
              : 'Set up your password using your email and QR code'
            }
          </p>
        </div>

        {loginMode === 'regular' ? (
          // Regular Login Form
          <form className="mt-8 space-y-6" onSubmit={handleRegularLogin}>
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
                      type="button"
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
              <p><strong>Admin:</strong> admin@system.com / admin123</p>
              <p><strong>Sample Client:</strong> alphapromo@client.com (requires password initialization)</p>
            </div>

            {/* Debug Tools */}
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Switch to Initialize Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={switchToInitializeMode}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Need to initialize your password? Click here
              </button>
            </div>
          </form>
        ) : (
          // Password Initialization Form
          <form className="mt-8 space-y-6" onSubmit={handlePasswordInitialization}>
            <div className="space-y-4">
              {/* Back Button */}
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  onClick={switchToRegularMode}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to login
                </button>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="init-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="init-email"
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

              {/* QR Code Input */}
              <div>
                <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code
                </label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="qrCode"
                    name="qrCode"
                    type="text"
                    required
                    value={formData.qrCode}
                    onChange={handleInputChange}
                    className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your QR code"
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
                <AlertCircle className="flex-shrink-0 mt-0.5 mr-2" size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Password Requirements */}
            <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded text-sm">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>At least 6 characters long</li>
                <li>Passwords must match</li>
              </ul>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Initializing...' : 'Initialize Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
