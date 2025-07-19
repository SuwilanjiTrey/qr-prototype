import React, { useState, useEffect } from 'react';
import { Users, QrCode, BarChart3, Settings, UserPlus, Eye, Plus, LogOut, Home } from 'lucide-react';

// Storage helper functions
const getStorageData = () => {
  try {
    const data = localStorage.getItem('qrTrackingSystem');
    return data ? JSON.parse(data) : {
      clients: {},
      registrations: [],
      admin: { username: 'admin', password: 'admin123' }
    };
  } catch (error) {
    return {
      clients: {},
      registrations: [],
      admin: { username: 'admin', password: 'admin123' }
    };
  }
};

const saveStorageData = (data) => {
  try {
    localStorage.setItem('qrTrackingSystem', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// Initialize with demo data
const initializeDemoData = () => {
  const existingData = getStorageData();
  if (Object.keys(existingData.clients).length === 0) {
    const demoData = {
      ...existingData,
      clients: {
        'client1': {
          name: 'Affiliate A',
          qrcodes: {
            'qrcode1': {
              url: '/scan?client=client1&code=qrcode1',
              name: 'Demo QR Code',
              registrations: []
            }
          }
        },
        'client2': {
          name: 'Affiliate B',
          qrcodes: {
            'qrcode2': {
              url: '/scan?client=client2&code=qrcode2',
              name: 'Partner QR Code',
              registrations: []
            }
          }
        }
      }
    };
    saveStorageData(demoData);
  }
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [urlParams, setUrlParams] = useState(new URLSearchParams());

  useEffect(() => {
    initializeDemoData();
    
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    setUrlParams(params);
    
    // Determine initial page based on URL
    if (params.has('client') && params.has('code')) {
      setCurrentPage('scan');
    } else if (window.location.pathname === '/admin-login') {
      setCurrentPage('admin-login');
    } else if (window.location.pathname === '/admin-dashboard') {
      setCurrentPage('admin-dashboard');
    } else if (window.location.pathname.startsWith('/client-dashboard/')) {
      const clientId = window.location.pathname.split('/').pop();
      setCurrentPage('client-dashboard');
      setCurrentUser({ type: 'client', id: clientId });
    }
  }, []);

  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    if (params.user) setCurrentUser(params.user);
    if (params.urlParams) setUrlParams(params.urlParams);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'scan':
        return <ScanRedirectPage urlParams={urlParams} onNavigate={navigate} />;
      case 'admin-login':
        return <AdminLogin onNavigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigate} />;
      case 'client-dashboard':
        return <ClientDashboard clientId={currentUser?.id} onNavigate={navigate} />;
      case 'qr-generator':
        return <QRCodeGenerator onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
    </div>
  );
};

// Landing Page Component
// Landing Page Component
const LandingPage = ({ onNavigate }) => {
  const demoQRUrl = "/scan?client=client1&code=qrcode1";
  const webAppUrl = window.location.origin; // Gets the current web app URL
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 m-4">
        <div className="text-center mb-8">
          <QrCode className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Tracking System</h1>
          <p className="text-gray-600">Demo QR code registration and analytics platform</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              const params = new URLSearchParams('client=client1&code=qrcode1');
              onNavigate('scan', { urlParams: params });
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <QrCode className="w-5 h-5" />
            Try Demo QR Code
          </button>
          
          <button
            onClick={() => onNavigate('admin-login')}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            Admin Login
          </button>
          
          <button
            onClick={() => {
              onNavigate('client-dashboard', { user: { type: 'client', id: 'client1' } });
            }}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <BarChart3 className="w-5 h-5" />
            Client Dashboard Demo
          </button>
        </div>
        
        {/* QR Code Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Scan this QR code to access the demo:</p>
          <a href={webAppUrl + demoQRUrl} target="_blank" rel="noopener noreferrer">
            <div className="inline-block p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200">
              {/* Replace this div with your actual QR code image */}
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">
            
               
                <img 
                  src="/qr-prototype/qrcode1.png" 
                  alt="QR Code to demo" 
                  className="w-full h-full"
                />
                
              </div>
            </div>
          </a>
          <p className="mt-2 text-xs text-gray-500">Scan to try the demo</p>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo credentials: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

// Scan Redirect Page Component
const ScanRedirectPage = ({ urlParams, onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const clientId = urlParams.get('client');
  const codeId = urlParams.get('code');

  const data = getStorageData();
  const client = data.clients[clientId];
  const qrCode = client?.qrcodes[codeId];

  if (!client || !qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid QR Code</h2>
          <p className="text-gray-600 mb-4">This QR code is not valid or has expired.</p>
          <button
            onClick={() => onNavigate('landing')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    // Save registration
    const registration = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      qrcodeId: codeId,
      clientId: clientId,
      timestamp: new Date().toISOString()
    };

    const updatedData = { ...data };
    updatedData.registrations.push(registration);
    updatedData.clients[clientId].qrcodes[codeId].registrations.push(registration);
    
    saveStorageData(updatedData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for registering with {client.name}.</p>
          <button
            onClick={() => onNavigate('landing')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full m-4">
        <div className="text-center mb-6">
          <QrCode className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Registration</h2>
          <p className="text-gray-600">Powered by {client.name}</p>
          <p className="text-sm text-gray-500">QR Code: {qrCode.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Login Component
const AdminLogin = ({ onNavigate }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = getStorageData();
    
    if (credentials.username === data.admin.username && credentials.password === data.admin.password) {
      onNavigate('admin-dashboard', { user: { type: 'admin' } });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full m-4">
        <div className="text-center mb-6">
          <Settings className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Home
          </button>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ onNavigate }) => {
  const data = getStorageData();
  const clients = data.clients;
  const totalRegistrations = data.registrations.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('qr-generator')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Generate QR
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Clients</h3>
                <p className="text-3xl font-bold text-blue-600">{Object.keys(clients).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <QrCode className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total QR Codes</h3>
                <p className="text-3xl font-bold text-green-600">
                  {Object.values(clients).reduce((sum, client) => sum + Object.keys(client.qrcodes).length, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Registrations</h3>
                <p className="text-3xl font-bold text-purple-600">{totalRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Clients & QR Codes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Codes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(clients).map(([clientId, client]) => (
                  <tr key={clientId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{clientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {Object.entries(client.qrcodes).map(([qrId, qrCode]) => (
                          <div key={qrId} className="text-sm">
                            <span className="font-medium">{qrCode.name}</span>
                            <span className="text-gray-500 ml-2">({qrId})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Object.values(client.qrcodes).reduce((sum, qr) => sum + qr.registrations.length, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onNavigate('client-dashboard', { user: { type: 'client', id: clientId } })}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Client Dashboard Component
const ClientDashboard = ({ clientId, onNavigate }) => {
  const data = getStorageData();
  const client = data.clients[clientId];

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Client Not Found</h2>
          <button
            onClick={() => onNavigate('landing')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const totalRegistrations = Object.values(client.qrcodes).reduce((sum, qr) => sum + qr.registrations.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">Client Dashboard</p>
            </div>
            <button
              onClick={() => onNavigate('landing')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <QrCode className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Active QR Codes</h3>
                <p className="text-3xl font-bold text-blue-600">{Object.keys(client.qrcodes).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Registrations</h3>
                <p className="text-3xl font-bold text-green-600">{totalRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Codes Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">QR Code Performance</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recent Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(client.qrcodes).map(([qrId, qrCode]) => (
                  <tr key={qrId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{qrCode.name}</div>
                      <div className="text-sm text-gray-500">{qrId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {qrCode.url}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-blue-600">
                        {qrCode.registrations.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {qrCode.registrations.length > 0 ? (
                        <div>
                          Last: {new Date(qrCode.registrations[qrCode.registrations.length - 1].timestamp).toLocaleDateString()}
                        </div>
                      ) : (
                        'No registrations yet'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations */}
        {totalRegistrations > 0 && (
          <div className="bg-white rounded-lg shadow-sm border mt-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Registrations</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.values(client.qrcodes)
                    .flatMap(qr => qr.registrations)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 10)
                    .map((registration) => (
                      <tr key={registration.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {registration.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {registration.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {client.qrcodes[registration.qrcodeId]?.name || registration.qrcodeId}
                        </td>
                       	<td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(registration.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// QR Code Generator Component
const QRCodeGenerator = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    qrName: '',
    newClientName: ''
  });
  const [isNewClient, setIsNewClient] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [error, setError] = useState('');

  const data = getStorageData();
  const clients = data.clients;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.qrName) {
      setError('QR Code name is required');
      return;
    }

    if (isNewClient && !formData.newClientName) {
      setError('New client name is required');
      return;
    }

    if (!isNewClient && !formData.clientId) {
      setError('Please select a client');
      return;
    }

    const updatedData = { ...data };
    let clientId = formData.clientId;

    // Create new client if needed
    if (isNewClient) {
      clientId = `client${Date.now()}`;
      updatedData.clients[clientId] = {
        name: formData.newClientName,
        qrcodes: {}
      };
    }

    // Generate new QR code
    const qrCodeId = `qrcode${Date.now()}`;
    const qrCodeUrl = `/scan?client=${clientId}&code=${qrCodeId}`;

    updatedData.clients[clientId].qrcodes[qrCodeId] = {
      url: qrCodeUrl,
      name: formData.qrName,
      registrations: []
    };

    saveStorageData(updatedData);

    setGeneratedQR({
      id: qrCodeId,
      url: qrCodeUrl,
      name: formData.qrName,
      clientName: isNewClient ? formData.newClientName : clients[clientId].name
    });

    setFormData({ clientId: '', qrName: '', newClientName: '' });
  };

  if (generatedQR) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">QR Code Generated</h1>
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">QR Code Created Successfully!</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Details</h3>
              <div className="space-y-2 text-left">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{generatedQR.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Client:</span>
                  <span className="ml-2 text-gray-900">{generatedQR.clientName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">QR Code ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{generatedQR.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">URL:</span>
                  <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                    {generatedQR.url}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setGeneratedQR(null)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Generate Another
              </button>
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Generate QR Code</h1>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Name *
              </label>
              <input
                type="text"
                value={formData.qrName}
                onChange={(e) => setFormData({ ...formData, qrName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Event Registration QR"
                required
              />
            </div>

            <div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientType"
                    checked={!isNewClient}
                    onChange={() => setIsNewClient(false)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Existing Client</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientType"
                    checked={isNewClient}
                    onChange={() => setIsNewClient(true)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">New Client</span>
                </label>
              </div>

              {isNewClient ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Client Name *
                  </label>
                  <input
                    type="text"
                    value={formData.newClientName}
                    onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Affiliate C"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a client...</option>
                    {Object.entries(clients).map(([clientId, client]) => (
                      <option key={clientId} value={clientId}>
                        {client.name} ({clientId})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Generate QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
