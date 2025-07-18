import React from 'react';
import { QrCode, Users, BarChart3 } from 'lucide-react';

const LandingPage = ({ onLoginClick, onDemoQRClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">QR Track Pro</span>
            </div>
            <button
              onClick={onLoginClick}
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
              onClick={onLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={onDemoQRClick}
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
};

export default LandingPage;