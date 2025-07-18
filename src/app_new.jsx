import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Eye, Users, BarChart3, Calendar, MapPin, Phone, Mail, User, CheckCircle, ExternalLink, Copy, Share2 } from 'lucide-react';

// QR Code Generator Component
const QRCodeGenerator = ({ data, size = 200 }) => {
  const canvasRef = useRef(null);
  
  // Simple QR code pattern generator (visual representation)
  const generateQRPattern = (text, size) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const moduleSize = size / 25; // 25x25 grid
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Generate pattern based on text
    const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const shouldFill = (seed + i * 31 + j * 17) % 3 === 0;
        
        if (shouldFill) {
          ctx.fillStyle = '#000';
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Add corner markers
    const cornerSize = moduleSize * 3;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize);
    
    // Add white centers to corners
    ctx.fillStyle = '#fff';
    const centerSize = moduleSize;
    ctx.fillRect(moduleSize, moduleSize, centerSize, centerSize);
    ctx.fillRect(size - cornerSize + moduleSize, moduleSize, centerSize, centerSize);
    ctx.fillRect(moduleSize, size - cornerSize + moduleSize, centerSize, centerSize);
  };
  
  useEffect(() => {
    generateQRPattern(data, size);
  }, [data, size]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className="border-2 border-gray-300 rounded-lg shadow-lg"
    />
  );
};

// QR Code Management Dashboard
const QRManagementDashboard = ({ clients, registrations, qrClicks, onSimulateQR }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const getClientStats = (clientId) => {
    const clientRegistrations = registrations.filter(r => r.clientId === clientId);
    const clientClicks = qrClicks.filter(q => q.clientId === clientId);
    const conversions = clientClicks.filter(q => q.converted).length;
    const conversionRate = clientClicks.length > 0 ? (conversions / clientClicks.length * 100).toFixed(1) : 0;
    
    return {
      totalClicks: clientClicks.length,
      totalRegistrations: clientRegistrations.length,
      conversionRate: conversionRate
    };
  };
  
  const generateQRUrl = (clientId) => {
    return `${window.location.origin}?client=${clientId}`;
  };
  
  const downloadQRCode = (clientId) => {
    const canvas = document.querySelector(`canvas[data-client="${clientId}"]`);
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-code-${clientId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };
  
  const copyQRUrl = (clientId) => {
    const url = generateQRUrl(clientId);
    navigator.clipboard.writeText(url);
    alert('QR URL copied to clipboard!');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">QR Code Management</h1>
                <p className="text-gray-600">Generate and track QR codes for your clients</p>
              </div>
            </div>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-medium hover:scale-105 transition-transform shadow-lg"
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>
          
          {showAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Clicks</p>
                    <p className="text-3xl font-bold">{qrClicks.length}</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Registrations</p>
                    <p className="text-3xl font-bold">{registrations.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Avg Conversion Rate</p>
                    <p className="text-3xl font-bold">
                      {qrClicks.length > 0 ? (qrClicks.filter(q => q.converted).length / qrClicks.length * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-200" />
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map(client => {
              const stats = getClientStats(client.id);
              return (
                <div key={client.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{client.name}</h3>
                      <p className="text-gray-600 text-sm">{client.industry}</p>
                      <p className="text-gray-500 text-xs">ID: {client.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                      <div className="text-2xl font-bold text-green-600">{stats.conversionRate}%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <QRCodeGenerator data={generateQRUrl(client.id)} size={150} />
                      <canvas data-client={client.id} style={{ display: 'none' }} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{stats.totalClicks}</div>
                      <div className="text-xs text-gray-600">Total Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{stats.totalRegistrations}</div>
                      <div className="text-xs text-gray-600">Registrations</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadQRCode(client.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform"
                    >
                      <Download className="h-4 w-4 inline mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => copyQRUrl(client.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform"
                    >
                      <Copy className="h-4 w-4 inline mr-1" />
                      Copy URL
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onSimulateQR(client.id)}
                    className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform"
                  >
                    <ExternalLink className="h-4 w-4 inline mr-1" />
                    Test QR Scan
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// QR Landing Page Component
const QRLandingPage = ({ clientCode, clients, onRegistration }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const client = clients.find(c => c.id === clientCode);
  
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = onRegistration(formData);
      if (success) {
        setIsSuccess(true);
      }
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid QR Code</h1>
          <p className="text-gray-600">The QR code you scanned is not valid or has expired.</p>
        </div>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your registration with <span className="font-bold text-blue-600">{client.name}</span> has been successful!
          </p>
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-2xl">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Registration Complete</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-2xl mb-4">
              <QrCode className="h-8 w-8 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome!</h1>
            <p className="text-gray-600">
              You've scanned the QR code for <span className="font-bold text-blue-600">{client.name}</span>
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 mt-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {client.industry}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Active since {client.created}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your phone number"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Registering...
                </div>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By registering, you agree to receive communications from {client.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Demo Component
const QRSystemDemo = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [clientCode, setClientCode] = useState('');
  const [clients] = useState([
    { id: 'ABC123', name: 'TechCorp Solutions', industry: 'Technology', created: '2024-01-15', status: 'active' },
    { id: 'DEF456', name: 'Green Energy Ltd', industry: 'Energy', created: '2024-01-20', status: 'active' },
    { id: 'GHI789', name: 'Health Plus Clinic', industry: 'Healthcare', created: '2024-02-01', status: 'active' }
  ]);
  
  const [registrations, setRegistrations] = useState([
    { id: 1, clientId: 'ABC123', userName: 'John Doe', email: 'john@example.com', phone: '+1234567890', timestamp: '2024-02-15T10:30:00Z' },
    { id: 2, clientId: 'ABC123', userName: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', timestamp: '2024-02-16T14:20:00Z' },
    { id: 3, clientId: 'DEF456', userName: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', timestamp: '2024-02-17T09:15:00Z' }
  ]);
  
  const [qrClicks, setQrClicks] = useState([
    { id: 1, clientId: 'ABC123', timestamp: '2024-02-15T10:25:00Z', converted: true },
    { id: 2, clientId: 'ABC123', timestamp: '2024-02-15T11:15:00Z', converted: false },
    { id: 3, clientId: 'DEF456', timestamp: '2024-02-17T09:10:00Z', converted: true }
  ]);
  
  const handleRegistration = (userData) => {
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
    
    return true;
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
    setCurrentView('landing');
  };
  
  return (
    <div className="font-sans">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-2xl">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-xl transition-all ${
              currentView === 'dashboard' 
                ? 'bg-white text-black shadow-lg' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            <QrCode className="h-5 w-5 inline mr-2" />
            Dashboard
          </button>
          {clientCode && (
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-4 py-2 rounded-xl transition-all ${
                currentView === 'landing' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <ExternalLink className="h-5 w-5 inline mr-2" />
              Landing Page
            </button>
          )}
        </div>
      </div>
      
      {/* Current View */}
      {currentView === 'dashboard' ? (
        <QRManagementDashboard 
          clients={clients}
          registrations={registrations}
          qrClicks={qrClicks}
          onSimulateQR={simulateQRScan}
        />
      ) : (
        <QRLandingPage 
          clientCode={clientCode}
          clients={clients}
          onRegistration={handleRegistration}
        />
      )}
    </div>
  );
};

export default QRSystemDemo;