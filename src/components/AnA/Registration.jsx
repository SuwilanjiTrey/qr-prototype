import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { registrationUtils } from '../data.jsx';
import { authUtils } from '../../utils/auth_util.jsx'; // Import from the separate auth utils file

// Registration Form Component
const RegistrationForm = ({ qrCode, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'general'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    
    try {
      const registration = {
        ...formData,
        timestamp: new Date().toISOString(),
        qrCode: qrCode
      };
      
      const result = await registrationUtils.addRegistration(qrCode, registration);
      console.log('Registration successful:', result);
      onSuccess();
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  return (
    <div className="p-0">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
            required
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
            required
          />
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
            required
          />
        </div>
        
        <div>
          <select
            value={formData.ticketType}
            onChange={(e) => handleInputChange('ticketType', e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
          >
            <option value="general">General Admission - K150</option>
            <option value="vip">VIP Experience - K350</option>
            <option value="family">Family Pack (4 tickets) - K500</option>
          </select>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Registering...' : 'Register Now - Join the Colors! 🎉'}
        </button>
      </div>
    </div>
  );
};

// Registration Page Component
const RegisterPage = () => {
  const { qrCode } = useParams();
  const [registered, setRegistered] = useState(false);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!qrCode) {
          setError('No QR code provided');
          return;
        }

        // Use the registrationUtils to find client by QR code
        // We'll need to get this from firebaseUtils since registrationUtils 
        // doesn't have getClientByQRCode method
        const { firebaseUtils } = await import('../data.jsx');
        const foundClient = await firebaseUtils.getClientByQRCode(qrCode);
        
        setClient(foundClient);
        
        if (!foundClient) {
          console.log(`No specific client found for QR code: ${qrCode}, will assign to admin`);
        }
      } catch (error) {
        console.error('Error fetching client:', error);
        setError('Failed to load registration form');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [qrCode]);

  const handleRegistrationSuccess = () => {
    setRegistered(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading registration form...</p>
        </div>
      </div>
    );
  }
/*
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4">
          <div className="text-7xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
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
  */

  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4">
          <div className="text-7xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">You're In!</h2>
          <p className="text-gray-600 mb-8 text-lg">Thanks for registering! We'll send you all the details soon.</p>
          <div className="space-y-4">
            <Link
              to="/qr-prototype"
              className="block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
            {client && (
              <p className="text-sm text-gray-500">
                Referred by: {client.name}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 overflow-hidden">
      
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-32 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center mb-12 text-white">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">🎉 Welcome to Our Event!</h1>
          <p className="mt-4 text-xl">
            {client ? `Referred by: ${client.name}` : 'Join our exclusive celebration'}
          </p>
          {qrCode && (
            <p className="mt-2 text-sm opacity-75">
              QR Code: {qrCode}
            </p>
          )}
        </div>

        <div className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl max-w-lg w-full">
          <RegistrationForm qrCode={qrCode} onSuccess={handleRegistrationSuccess} />
        </div>
        
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-black/20 text-white p-4 rounded-lg text-sm max-w-lg w-full">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>QR Code: {qrCode || 'None provided'}</p>
            <p>Client Found: {client ? client.name : 'None (will assign to admin)'}</p>
            <p>Client ID: {client ? client.id : 'N/A'}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
