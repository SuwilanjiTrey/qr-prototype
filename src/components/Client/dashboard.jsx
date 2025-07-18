import React from 'react';
import { Building, QrCode, Users, TrendingUp, LogOut, CheckCircle, User, Mail, Phone, Calendar } from 'lucide-react';
import { getClientStats } from '../../utils/helper.jsx';

const ClientDashboard = ({ currentUser, clients, registrations, qrClicks, onLogout, onTestQR }) => {
  const clientStats = getClientStats(clients, registrations, qrClicks, currentUser.clientId)[0];
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
                onClick={onLogout}
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
                  onClick={() => onTestQR(currentUser.clientId)}
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

export default ClientDashboard;