import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, QrCode, BarChart3, Plus, Home, Info, Phone, Settings, LogIn, UserPlus } from 'lucide-react';
import { firebaseUtils, generateId } from '../data.jsx';
import QRGenerator from '../qr_code.jsx';
import { QRCodeSVG } from 'qrcode.react';

// Admin Dashboard
const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [showQRModal, setShowQRModal] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const clientsData = await firebaseUtils.getClients();
      
      // Transform the data to include registrations count
      const clientsWithStats = await Promise.all(
        clientsData.map(async (client) => {
          try {
            // Get registrations for this client
            const { registrationUtils } = await import('../data.jsx');
            const registrations = await registrationUtils.getRegistrationsByClientId(client.id);
            return {
              ...client,
              registrations: registrations || []
            };
          } catch (err) {
            console.error(`Error loading registrations for client ${client.id}:`, err);
            return {
              ...client,
              registrations: []
            };
          }
        })
      );
      
      setClients(clientsWithStats);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    try {
      setError(null);
      const qrCode = `qr-${generateId()}`;
      const newClientData = {
        name: newClientName,
        qrCode: qrCode,
        url: `/register/${qrCode}`,
        email: `${newClientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
        phone: '',
        password: 'client123', // In production, generate a secure password
        role: 'client'
      };

      const addedClient = await firebaseUtils.addClient(newClientData);
      
      // Add the new client to the state with empty registrations
      setClients(prevClients => [
        ...prevClients,
        { ...addedClient, registrations: [] }
      ]);
      
      setNewClientName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Failed to create client. Please try again.');
    }
  };

  const totalRegistrations = clients.reduce((sum, client) => sum + (client.registrations?.length || 0), 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={loadClients}
            className="ml-4 text-red-800 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

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
                  <div className="text-xs text-gray-400">{client.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-semibold">{client.registrations?.length || 0}</span>
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
        
        {clients.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500">
            No clients found. Create your first client to get started!
          </div>
        )}
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
                <p className="text-xs text-gray-500 mt-1">
                  A unique QR code and email will be automatically generated
                </p>
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
