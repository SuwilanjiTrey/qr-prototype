import React, { useState, useEffect } from 'react';
import { QrCode, Users, BarChart3, CheckCircle, User, Building, Lock, Eye, EyeOff, LogOut, Settings, TrendingUp, Calendar, Mail, Phone } from 'lucide-react';

const QRTrackingSystem = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '', showPassword: false });
  const [clientCode, setClientCode] = useState('');
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [clients, setClients] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [qrClicks, setQrClicks] = useState([]);

  // Demo users for authentication
  const demoUsers = [
    { id: 1, email: 'admin@system.com', password: 'admin123', role: 'admin', name: 'System Administrator' },
    { id: 2, email: 'techcorp@client.com', password: 'client123', role: 'client', name: 'TechCorp Manager', clientId: 'ABC123' },
    { id: 3, email: 'greenenergy@client.com', password: 'client123', role: 'client', name: 'Green Energy Manager', clientId: 'DEF456' },
    { id: 4, email: 'healthplus@client.com', password: 'client123', role: 'client', name: 'Health Plus Manager', clientId: 'GHI789' }
  ];

  // Initialize demo data
  useEffect(() => {
    const demoClients = [
      { id: 'ABC123', name: 'TechCorp Solutions', industry: 'Technology', created: '2024-01-15', status: 'active' },
      { id: 'DEF456', name: 'Green Energy Ltd', industry: 'Energy', created: '2024-01-20', status: 'active' },
      { id: 'GHI789', name: 'Health Plus Clinic', industry: 'Healthcare', created: '2024-02-01', status: 'active' }
    ];

    const demoRegistrations = [
      { id: 1, clientId: 'ABC123', userName: 'John Doe', email: 'john@example.com', phone: '+1234567890', timestamp: '2024-02-15T10:30:00Z' },
      { id: 2, clientId: 'ABC123', userName: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', timestamp: '2024-02-16T14:20:00Z' },
      { id: 3, clientId: 'DEF456', userName: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', timestamp: '2024-02-17T09:15:00Z' },
      { id: 4, clientId: 'GHI789', userName: 'Alice Brown', email: 'alice@example.com', phone: '+1234567893', timestamp: '2024-02-18T16:45:00Z' },
      { id: 5, clientId: 'ABC123', userName: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1234567894', timestamp: '2024-02-19T11:30:00Z' }
    ];

    const demoQrClicks = [
      { id: 1, clientId: 'ABC123', timestamp: '2024-02-15T10:25:00Z', converted: true },
      { id: 2, clientId: 'ABC123', timestamp: '2024-02-15T11:15:00Z', converted: false },
      { id: 3, clientId: 'ABC123', timestamp: '2024-02-16T14:15:00Z', converted: true },
      { id: 4, clientId: 'DEF456', timestamp: '2024-02-17T09:10:00Z', converted: true },
      { id: 5, clientId: 'GHI789', timestamp: '2024-02-18T16:40:00Z', converted: true },
      { id: 6, clientId: 'ABC123', timestamp: '2024-02-19T11:25:00Z', converted: true },
      { id: 7, clientId: 'ABC123', timestamp: '2024-02-20T15:30:00Z', converted: false },
      { id: 8, clientId: 'DEF456', timestamp: '2024-02-21T08:45:00Z', converted: false }
    ];

    setClients(demoClients);
    setRegistrations(demoRegistrations);
    setQrClicks(demoQrClicks);

    // Check for QR code parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const qrClient = urlParams.get('client');
    if (qrClient) {
      setClientCode(qrClient);
      // Track QR click
      const newClick = {
        id: Date.now(),
        clientId: qrClient,
        timestamp: new Date().toISOString(),
        converted: false
      };
      setQrClicks(prev => [...prev, newClick]);
      setCurrentView('qr-landing');
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = demoUsers.find(u => u.email === loginData.email && u.password === loginData.password);
    
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else if (user.role === 'client') {
        setCurrentView('client-dashboard');
      }
      setLoginData({ email: '', password: '', showPassword: false });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    
    if (!userData.name || !userData.email) {
      alert('Please fill in all required fields');
      return;
    }

    const newRegistration = {
      id: Date.now(),
      clientId: clientCode,
      userName: userData.name,
      email: userData.email,
      phone: userData.phone,
      timestamp: new Date().toISOString()
    };

    setRegistrations(prev => [...prev, newRegistration]);
    
    // Mark QR click as converted
    setQrClicks(prev => prev.map(click => 
      click.clientId === clientCode && !click.converted ? 
      { ...click, converted: true } : click
    ));
    
    setRegistrationSuccess(true);
    setUserData({ name: '', email: '', phone: '' });
    
    setTimeout(() => {
      setRegistrationSuccess(false);
    }, 3000);
  };

  const getClientStats = (clientId = null) => {
    const targetClients = clientId ? clients.filter(c => c.id === clientId) : clients;
    
    return targetClients.map(client => {
      const clientRegistrations = registrations.filter(reg => reg.clientId === client.id);
      const clientClicks = qrClicks.filter(click => click.clientId === client.id);
      const conversionRate = clientClicks.length > 0 ? 
        (clientClicks.filter(click => click.converted).length / clientClicks.length * 100).toFixed(1) : 0;
      
      return {
        ...client,
        registrations: clientRegistrations.length,
        clicks: clientClicks.length,
        conversionRate: conversionRate,
        lastRegistration: clientRegistrations
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.timestamp
      };
    });
  };

  const simulateQRScan = (clientId) => {
    const newClick = {
      id: Date.now(),
      clientId: clientId,
      timestamp: new Date().toISOString(),
      converted: false
    };
    setQrClicks(prev => [...prev, newClick]);
    setClientCode(clientId);
    setCurrentView('qr-landing');
  };

  // Landing Page (Default)
  const renderLanding = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">QR Track Pro</span>
            </div>
            <button
              onClick={() => setCurrentView('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Track Every QR Code Interaction</h1>
          <p className="text-xl text-gray-600 mb-8">Powerful analytics and user tracking for your QR code campaigns</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentView('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => simulateQRScan('ABC123')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Try Demo QR
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">QR Code Generation</h3>
            <p className="text-gray-600">Create unlimited QR codes for your clients with unique tracking</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
            <p className="text-gray-600">Track scans, conversions, and user registrations in real-time</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">User Management</h3>
            <p className="text-gray-600">Manage multiple clients and track their individual performance</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Demo Credentials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Admin Access</h3>
              <p className="text-sm text-gray-600">Email: admin@system.com</p>
              <p className="text-sm text-gray-600">Password: admin123</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Client Access</h3>
              <p className="text-sm text-gray-600">Email: techcorp@client.com</p>
              <p className="text-sm text-gray-600">Password: client123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Login Page
  const renderLogin = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-600">Access your dashboard</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={loginData.showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setLoginData({...loginData, showPassword: !loginData.showPassword})}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {loginData.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            Sign In
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // QR Landing Page (for users scanning QR codes)
  const renderQRLanding = () => {
    const client = clients.find(c => c.id === clientCode);
    
    if (!client) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <QrCode className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid QR Code</h2>
            <p className="text-gray-600 mb-6">This QR code is not recognized.</p>
            <button
              onClick={() => setCurrentView('landing')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          {registrationSuccess ? (
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">Your registration with {client.name} was successful. We'll be in touch soon!</p>
              <button
                onClick={() => setCurrentView('landing')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to {client.name}!</h2>
                <p className="text-gray-600">Please register to get started with us.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleRegistration}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                >
                  Register Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Admin Dashboard
  const renderAdminDashboard = () => {
    const totalClicks = qrClicks.length;
    const totalConversions = qrClicks.filter(click => click.converted).length;
    const overallConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(1) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {currentUser.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">System Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Clients</p>
                    <p className="text-2xl font-bold">{clients.length}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Registrations</p>
                    <p className="text-2xl font-bold">{registrations.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total QR Clicks</p>
                    <p className="text-2xl font-bold">{totalClicks}</p>
                  </div>
                  <QrCode className="h-8 w-8 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Conversion Rate</p>
                    <p className="text-2xl font-bold">{overallConversionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Client Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Industry</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">QR Clicks</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Registrations</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getClientStats().map(client => (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{client.name}</div>
                          <div className="text-sm text-gray-500">ID: {client.id}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{client.industry}</td>
                        <td className="py-3 px-4">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                            {client.clicks}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {client.registrations}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            {client.conversionRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => simulateQRScan(client.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Test QR
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
      </div>
    );
  };

  // Client Dashboard
  const renderClientDashboard = () => {
    const clientStats = getClientStats(currentUser.clientId)[0];
    const clientRegistrations = registrations.filter(reg => reg.clientId === currentUser.clientId);
    const clientClicks = qrClicks.filter(click => click.clientId === currentUser.clientId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">Client Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {currentUser.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{clientStats?.name}</h1>
            <p className="text-gray-600 mb-6">Your QR Code Performance Dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">QR Code Clicks</p>
                    <p className="text-2xl font-bold">{clientStats?.clicks || 0}</p>
                  </div>
                  <QrCode className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Registrations</p>
                    <p className="text-2xl font-bold">{clientStats?.registrations || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                    <p className="text-2xl font-bold">{clientStats?.conversionRate || 0}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your QR Code</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">QR Code ID</p>
                      <p className="text-sm text-gray-600 font-mono">{currentUser.clientId}</p>
                    </div>
                    <QrCode className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => simulateQRScan(currentUser.clientId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Test Your QR Code
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {clientClicks.slice(-5).reverse().map(click => (
                    <div key={click.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${click.converted ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {click.converted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <QrCode className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {click.converted ? 'QR Scan + Registration' : 'QR Scan Only'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(click.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">User Registrations</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientRegistrations.map(reg => (
                      <tr key={reg.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-800">{reg.userName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{reg.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{reg.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 text-sm">
                              {new Date(reg.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {clientRegistrations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No registrations yet. Share your QR code to start collecting leads!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {currentView === 'landing' && renderLanding()}
      {currentView === 'login' && renderLogin()}
      {currentView === 'qr-landing' && renderQRLanding()}
      {currentView === 'admin-dashboard' && renderAdminDashboard()}
      {currentView === 'client-dashboard' && renderClientDashboard()}
    </div>
  );
};

export default QRTrackingSystem;