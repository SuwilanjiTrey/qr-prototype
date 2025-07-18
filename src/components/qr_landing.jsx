import React, { useState } from 'react';
import { QrCode, CheckCircle, Building, Calendar, MapPin, User, Mail, Phone} from 'lucide-react';



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

export default QRLandingPage;