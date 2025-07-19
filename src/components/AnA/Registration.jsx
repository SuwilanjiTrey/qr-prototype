import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { localStorageUtils } from '../data.jsx';

// Registration Form Component
const RegistrationForm = ({ qrCode, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const registration = {
      ...formData,
      timestamp: new Date().toISOString(),
      qrCode: qrCode
    };
    
    localStorageUtils.addRegistration(qrCode, registration);
    onSuccess();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-center">Register Now</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
};

// Registration Page Component
const RegisterPage = () => {
  const { qrCode } = useParams();
  const [registered, setRegistered] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const clients = localStorageUtils.getClients();
    const foundClient = clients.find(c => c.qrCode === qrCode);
    setClient(foundClient);
  }, [qrCode]);

  const handleRegistrationSuccess = () => {
    setRegistered(true);
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for registering. We'll be in touch soon!</p>
          <Link
            to="/qr-prototype"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Our Event!
          </h1>
          <p className="text-xl text-gray-600">
            {client ? `Referred by: ${client.name}` : 'Join our exclusive event'}
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <RegistrationForm qrCode={qrCode} onSuccess={handleRegistrationSuccess} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;