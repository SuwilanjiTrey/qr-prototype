import { Users, QrCode, BarChart3, Plus, Home, Info, Phone, Settings, LogIn, UserPlus } from 'lucide-react';

// About Page
const AboutPage = () => {
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to QR Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your QR code performance, manage registrations, and analyze user engagement with our powerful analytics platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">QR Code Generation</h3>
            <p className="text-gray-600">Create unique QR codes for your marketing campaigns</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <BarChart3 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Real-time Analytics</h3>
            <p className="text-gray-600">Track scans, registrations, and user engagement</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">User Management</h3>
            <p className="text-gray-600">Manage client relationships and track performance</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Current Events</h2>
            
          
        </div>
      </div>
    </div>
  );
};
export default AboutPage;
