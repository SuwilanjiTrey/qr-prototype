import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ onLogin, onBackToHome }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '', showPassword: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-600">Access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
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
                required
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
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBackToHome}
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;