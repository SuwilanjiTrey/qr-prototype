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
    <div className=" p-0">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
          />
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
          />
        </div>
        
        <div>
          <select
            value={formData.ticketType}
            onChange={(e) => setFormData({...formData, ticketType: e.target.value})}
            className="w-full p-4 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none bg-white/90 backdrop-blur-sm"
          >
            <option value="general">General Admission - K150</option>
            <option value="vip">VIP Experience - K350</option>
            <option value="family">Family Pack (4 tickets) - K500</option>
          </select>
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform active:scale-95 shadow-lg"
        >
          Register Now - Join the Colors! 🎉
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
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4">
      <div className="text-7xl mb-6 animate-bounce">🎉</div>
      <h2 className="text-3xl font-bold text-green-600 mb-4">You're In!</h2>
      <p className="text-gray-600 mb-8 text-lg">Thanks for registering! We'll send you all the details soon.</p>
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

      <div className="backdrop-blur-lg bg-white/30 p-0 rounded-2xl shadow-xl max-w-lg w-full">
        <RegistrationForm qrCode={qrCode} onSuccess={handleRegistrationSuccess} />
      </div>
    </div>
  </div>
);

};

export default RegisterPage;