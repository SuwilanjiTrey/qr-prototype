import React from 'react';
import { QrCode, Users, BarChart3, Building, TrendingUp, LogOut } from 'lucide-react';
import { getClientStats } from '../../utils/helper';

const AdminDashboard = ({ 
  currentUser, 
  clients, 
  registrations, 
  qrClicks, 
  onLogout, 
  onTestQR 
}) => {
  const totalClicks = qrClicks.length;
  const totalConversions = qrClicks.filter(click => click.converted).length;
  const overallConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(1) : 0;
  const clientStats = getClientStats(clients, registrations, qrClicks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">System Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Clients</p>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Registrations</p>
                  <p className="text-2xl font-bold">{registrations.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total QR Clicks</p>
                  <p className="text-2xl font-bold">{totalClicks}</p>
                </div>
                <QrCode className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold">{overallConversionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Client Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Industry</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">QR Clicks</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Registrations</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientStats.map(client => (
                    <tr key={client.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{client.name}</div>
                        <div className="text-sm text-gray-500">ID: {client.id}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{client.industry}</td>
                      <td className="py-3 px-4">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                          {client.clicks}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {client.registrations}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {client.conversionRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onTestQR(client.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Test QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;