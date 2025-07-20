import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
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

if (!qrCode) {
  return <div className="text-center mt-20 text-red-600">Invalid or missing QR Code in URL.</div>;
}


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
  <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 overflow-hidden">
    
    {/* 🔵 Animated gradient blobs */}
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-32 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    {/* 🟢 Main content */}
    <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-center mb-12 text-white">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">🎉 Welcome to Our Event!</h1>
        <p className="mt-4 text-xl">
          {client ? `Referred by: ${client.name}` : 'Join our exclusive celebration'}
        </p>
      </div>

      <div className="backdrop-blur-lg bg-white/30 p-10 rounded-2xl shadow-xl max-w-lg w-full">
        <RegistrationForm qrCode={qrCode} onSuccess={handleRegistrationSuccess} />
      </div>
    </div>
  </div>
);

};

export default RegisterPage;