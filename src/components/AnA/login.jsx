import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils, clientStorageUtils, localStorageUtils } from '../data.jsx';

const LoginPage = ({ onLogin, isLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loginType: 'client' // 'admin' or 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const role = authUtils.getCurrentRole();
      navigate(role === 'admin' ? '/admin' : '/client');
    }
  }, [isLoggedIn, navigate]);

  // Initialize sample client data and show debug info
  useEffect(() => {
    // Initialize data
    localStorageUtils.initializeAdmin();
    clientStorageUtils.initializeSampleClient();
    
    // Show debug info
    const clients = localStorageUtils.getClients();
    console.log('All clients in localStorage:', clients);
    
    const debugText = `
Debug Info:
- Total clients: ${clients.length}
- Admin exists: ${clients.some(c => c.role === 'admin')}
- Admin email: ${clients.find(c => c.role === 'admin')?.email || 'Not found'}
- Admin has password: ${!!clients.find(c => c.role === 'admin')?.password}
- Client exists: ${clients.some(c => c.role === 'client')}
- Client email: ${clients.find(c => c.role === 'client')?.email || 'Not found'}
    `;
    setDebugInfo(debugText);
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
      let userData = null;

      console.log('Login attempt:', formData);

      if (formData.loginType === 'admin') {
        console.log('Attempting admin login...');
        
        // Debug: Check what's in localStorage
        const clients = localStorageUtils.getClients();
        const adminUser = clients.find(c => c.role === 'admin');
        console.log('Admin user in storage:', adminUser);
        console.log('Looking for email:', formData.email);
        console.log('Password match:', adminUser?.password === formData.password);
        
        userData = authUtils.validateAdmin(formData.email, formData.password);
        console.log('Admin validation result:', userData);
        
        if (userData) {
          onLogin('admin', userData);
          navigate('/qr-prototype/admin');
        } else {
          setError('Invalid admin credentials - check console for details');
        }
      } else {
        console.log('Attempting client login...');
        
        // Debug: Check client data
        const clients = localStorageUtils.getClients();
        const clientUser = clients.find(c => c.role === 'client' && c.email === formData.email);
        console.log('Client user in storage:', clientUser);
        
        userData = authUtils.validateClient(formData.email, formData.password);
        console.log('Client validation result:', userData);
        
        if (userData) {
          onLogin('client', userData);
          navigate('/qr-prototype/client');
        } else {
          setError('Invalid email or password - check console for details');
        }
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manual debug buttons
  const handleForceAdmin = () => {
    const clients = localStorageUtils.getClients();
    const adminUser = clients.find(c => c.role === 'admin');
    if (adminUser) {
      const { password, ...userWithoutPassword } = adminUser;
      onLogin('admin', userWithoutPassword);
      navigate('/admin');
    } else {
      alert('No admin user found!');
    }
  };

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* Debug Information 
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded text-xs">
          <pre>{debugInfo}</pre>
          <div className="mt-2 space-x-2">
            <button
              onClick={handleForceAdmin}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              Force Admin Login
            </button>
            <button
              onClick={handleClearStorage}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
            >
              Clear Storage
            </button>
          </div>
        </div>
	------DEBUGGING CODE //UNCOMENT THIS SECTION TO DEBUG -------
	*/}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Login Type Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login as:
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="loginType"
                    value="client"
                    checked={formData.loginType === 'client'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Client</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="loginType"
                    value="admin"
                    checked={formData.loginType === 'admin'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Admin</span>
                </label>
              </div>
            </div>

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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;