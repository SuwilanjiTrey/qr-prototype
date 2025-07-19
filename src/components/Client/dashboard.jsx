import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { BarChart3, Users, QrCode, Calendar, TrendingUp, Download, ExternalLink, RefreshCw } from 'lucide-react';

import { clientStorageUtils } from '../data.jsx';


const ClientDashboard = ({ clientId = 'client-abc123' }) => {
  const [clientData, setClientData] = useState(null);
  const [stats, setStats] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [newLandingUrl, setNewLandingUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load client data
    const data = clientStorageUtils.getClientData(clientId);
    setClientData(data);
    setStats(clientStorageUtils.getRegistrationStats(data.registrations));
    setNewLandingUrl(`/register/${data.qrCode}`);
    setLoading(false);
  }, [clientId]);

  const handleRefreshData = () => {
    setLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      const data = clientStorageUtils.getClientData(clientId);
      setClientData(data);
      setStats(clientStorageUtils.getRegistrationStats(data.registrations));
      setLoading(false);
    }, 1000);
  };

  const handleUpdateLandingUrl = (e) => {
    e.preventDefault();
    clientStorageUtils.updateClientLandingUrl(clientId, newLandingUrl);
    setShowUrlEditor(false);
    alert('Landing page URL updated successfully!');
  };

  const downloadQRCode = () => {
    // Simple QR code download simulation
    alert('QR Code download started! (This would trigger actual download)');
  };

  const exportRegistrations = () => {
    const csvContent = [
      'Name,Email,Phone,Registration Date',
      ...clientData.registrations.map(reg => 
        `${reg.name},${reg.email},${reg.phone},${new Date(reg.timestamp).toLocaleString()}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientData.name}-registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Client Not Found</h2>
          <p className="text-gray-600">Unable to load client dashboard.</p>
        </div>
      </div>
    );
  }

  const qrUrl = `${window.location.origin}/register/${clientData.qrCode}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Client Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {clientData.name}!</p>
            </div>
            <button
              onClick={handleRefreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.today > stats.yesterday ? '↗️' : '↘️'} vs yesterday ({stats.yesterday})
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-green-600">{stats.week}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.total > 0 ? Math.round((stats.total / 100) * 100) : 0}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Estimated</p>
          </div>
        </div>

        {/* QR Code Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Your QR Code</h3>
            <div className="text-center mb-4">
              <QRCodeSVG value={qrUrl} size={150} />
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowQRModal(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>View Full Size</span>
              </button>
              <button
                onClick={downloadQRCode}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Landing Page Settings</h3>
              <button
                onClick={() => setShowUrlEditor(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit URL
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Landing Page URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={qrUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code ID
                </label>
                <input
                  type="text"
                  value={clientData.qrCode}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Recent Registrations</h3>
              <button
                onClick={exportRegistrations}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientData.registrations.map((registration, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{registration.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{registration.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{registration.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {new Date(registration.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(registration.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {clientData.registrations.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No registrations yet. Share your QR code to start collecting registrations!
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">Your QR Code</h3>
            <div className="text-center mb-4">
              <QRCodeSVG value={qrUrl} size={250} />
            </div>
            <p className="text-sm text-gray-600 mb-4 text-center break-all">
              {qrUrl}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={downloadQRCode}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Editor Modal */}
      {showUrlEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Landing Page URL</h3>
            <form onSubmit={handleUpdateLandingUrl}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landing Page Path
                </label>
                <input
                  type="text"
                  value={newLandingUrl}
                  onChange={(e) => setNewLandingUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/register/your-qr-code"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Full URL: {window.location.origin}{newLandingUrl}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUrlEditor(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;