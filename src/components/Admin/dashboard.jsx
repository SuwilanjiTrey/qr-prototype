import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, QrCode, BarChart3, Plus, Home, Info, Phone, Settings, LogIn, UserPlus, Trash2, Eye, EyeOff } from 'lucide-react';
import { firebaseUtils, generateId } from '../data.jsx';
import QRGenerator from '../qr_code.jsx';
import { QRCodeSVG } from 'qrcode.react';

// Admin Dashboard
const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [showQRModal, setShowQRModal] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

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

  const handleInputChange = (field, value) => {
    setNewClientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewClientData(prev => ({ ...prev, password }));
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClientData.name.trim() || !newClientData.password.trim()) return;

    try {
      setError(null);
      const qrCode = `qr-${generateId()}`;
      
      // Generate email if not provided
      const email = newClientData.email.trim() || 
        `${newClientData.name.toLowerCase().replace(/\s+/g, '')}${Date.now()}@client.com`;

      const clientData = {
        name: newClientData.name.trim(),
        email: email,
        phone: newClientData.phone.trim() || '',
        password: newClientData.password.trim(),
        qrCode: qrCode,
        url: `/register/${qrCode}`,
        role: 'client'
      };

      const addedClient = await firebaseUtils.addClient(clientData);
      
      // Add the new client to the state with empty registrations
      setClients(prevClients => [
        ...prevClients,
        { ...addedClient, registrations: [] }
      ]);
      
      // Reset form
      setNewClientData({
        name: '',
        email: '',
        phone: '',
        password: ''
      });
      setShowCreateForm(false);
      setShowPassword(false);
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Failed to create client. Please try again.');
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      setDeleteLoading(clientId);
      setError(null);
      
      await firebaseUtils.deleteClient(clientId);
      
      // Remove client from state
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Failed to delete client. Please try again.');
    } finally {
      setDeleteLoading(null);
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
    <div className="container mx-auto my-32 px-4 py-8">
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
                Contact
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
                  <div className="text-sm text-gray-900">{client.email}</div>
                  {client.phone && (
                    <div className="text-xs text-gray-500">{client.phone}</div>
                  )}
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowQRModal(client)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View QR Code"
                    >
                      View QR
                    </button>
                    <Link
                      to={`/register/${client.qrCode}`}
                      className="text-green-600 hover:text-green-900"
                      target="_blank"
                      title="Test Registration Link"
                    >
                      Test Link
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(client)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Client"
                      disabled={deleteLoading === client.id}
                    >
                      {deleteLoading === client.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Client</h3>
            <form onSubmit={handleCreateClient}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newClientData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email (optional - will auto-generate if empty)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newClientData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newClientData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Generate Random Password
                  </button>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <p><strong>Note:</strong> A unique QR code will be automatically generated for this client.</p>
                  <p>The client can use the provided credentials to log in and manage their registrations.</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewClientData({ name: '', email: '', phone: '', password: '' });
                    setShowPassword(false);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Client</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently delete the client and all their registrations ({showDeleteConfirm.registrations?.length || 0} registrations). 
              This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClient(showDeleteConfirm.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
                disabled={deleteLoading}
              >
                {deleteLoading === showDeleteConfirm.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Delete Client'
                )}
              </button>
            </div>
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
