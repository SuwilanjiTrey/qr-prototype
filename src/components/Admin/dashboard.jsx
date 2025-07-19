import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, QrCode, BarChart3, Plus, Home, Info, Phone, Settings, LogIn, UserPlus } from 'lucide-react';
import { localStorageUtils , generateId } from '../data.jsx';
import QRGenerator from '../qr_code.jsx';
import { QRCodeSVG } from 'qrcode.react';

// Admin Dashboard
const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [showQRModal, setShowQRModal] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');

  useEffect(() => {
    setClients(localStorageUtils.getClients());
  }, []);

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const newClient = {
      id: generateId(),
      name: newClientName,
      qrCode: `qr-${generateId()}`,
      url: `/register/qr-${generateId()}`,
      registrations: []
    };

    localStorageUtils.addClient(newClient);
    setClients(localStorageUtils.getClients());
    setNewClientName('');
    setShowCreateForm(false);
  };

  const totalRegistrations = clients.reduce((sum, client) => sum + client.registrations.length, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Clients</h3>
          <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Registrations</h3>
          <p className="text-3xl font-bold text-green-600">{totalRegistrations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average per Client</h3>
          <p className="text-3xl font-bold text-purple-600">
            {clients.length > 0 ? Math.round(totalRegistrations / clients.length) : 0}
          </p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.qrCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-semibold">{client.registrations.length}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <QRCodeSVG value={`${window.location.origin}/register/${client.qrCode}`} size={40} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setShowQRModal(client)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View QR
                  </button>
                  <Link
                    to={`/register/${client.qrCode}`}
                    className="text-green-600 hover:text-green-900"
                    target="_blank"
                  >
                    Test Link
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Client Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Client</h3>
            <form onSubmit={handleCreateClient}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <QRGenerator
          client={showQRModal}
          onClose={() => setShowQRModal(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;