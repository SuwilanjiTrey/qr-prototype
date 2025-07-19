// LocalStorage utilities
const localStorageUtils = {
  getClients: () => {
    const clients = localStorage.getItem('clients');
    return clients ? JSON.parse(clients) : [];
  },

  saveClients: (clients) => {
    localStorage.setItem('clients', JSON.stringify(clients));
  },

  addClient: (client) => {
    const clients = localStorageUtils.getClients();
    clients.push(client);
    localStorageUtils.saveClients(clients);
  },

  addRegistration: (qrCode, registration) => {
    const clients = localStorageUtils.getClients();
    const client = clients.find(c => c.qrCode === qrCode);

    if (client) {
      client.registrations.push(registration);
    } else {
      // Assign to admin if QR code not found
      const adminClient = clients.find(c => c.name === 'Admin');
      if (adminClient) {
        adminClient.registrations.push(registration);
      }
    }

    localStorageUtils.saveClients(clients);
  },

  getRegistrationsByQR: (qrCode) => {
    const clients = localStorageUtils.getClients();
    const client = clients.find(c => c.qrCode === qrCode);
    return client ? client.registrations : [];
  },

  initializeAdmin: () => {
    const clients = localStorageUtils.getClients();
    if (!clients.find(c => c.name === 'Admin')) {
      const adminClient = {
        id: 'admin-default',
        name: 'Admin',
        qrCode: 'admin-qr',
        url: '/register/admin-qr',
        email: 'admin@system.com',
        password: 'admin123', // Add password field for admin
        role: 'admin',
        registrations: []
      };
      localStorageUtils.addClient(adminClient);
    }
  },

  // Find client by ID
  getClientById: (clientId) => {
    const clients = localStorageUtils.getClients();
    return clients.find(c => c.id === clientId);
  },

  // Update client data
  updateClient: (clientId, updatedData) => {
    const clients = localStorageUtils.getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex !== -1) {
      clients[clientIndex] = { ...clients[clientIndex], ...updatedData };
      localStorageUtils.saveClients(clients);
      return clients[clientIndex];
    }
    return null;
  }
};

// Authentication utilities
const authUtils = {
  // Validate admin login (for demo purposes)
  validateAdmin: (email, password) => {
    // Check against stored admin data in localStorage
    const clients = localStorageUtils.getClients();
    const admin = clients.find(c => c.role === 'admin' && c.email === email);
    
    if (admin && admin.password === password) {
      // Don't return password in user data
      const { password: _, ...userDataWithoutPassword } = admin;
      return userDataWithoutPassword;
    }
    return null;
  },

  // Validate client login
  validateClient: (email, password) => {
    const clients = localStorageUtils.getClients();
    // In a real app, passwords would be hashed
    const client = clients.find(c => 
      c.email === email && 
      c.password === password && 
      c.role === 'client'
    );
    
    if (client) {
      // Don't return password in user data
      const { password: _, ...userDataWithoutPassword } = client;
      return userDataWithoutPassword;
    }
    return null;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get current user role
  getCurrentRole: () => {
    return localStorage.getItem('userRole') || null;
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return authUtils.getCurrentUser() !== null && authUtils.getCurrentRole() !== null;
  },

  // Check if user is admin
  isAdmin: () => {
    return authUtils.getCurrentRole() === 'admin';
  },

  // Check if user is client
  isClient: () => {
    return authUtils.getCurrentRole() === 'client';
  }
};

// Sample client data for testing
const sampleClientData = {
  id: 'client-abc123',
  name: 'AlphaPromo Marketing',
  qrCode: 'qr-abc123',
  email: 'contact@alphapromo.com',
  phone: '+260 123 456 789',
  password: 'client123', // In real app, this would be hashed
  role: 'client',
  registrations: [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+260 111 222 333',
      timestamp: '2025-07-19T08:30:00Z',
      qrCode: 'qr-abc123'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+260 444 555 666',
      timestamp: '2025-07-19T10:15:00Z',
      qrCode: 'qr-abc123'
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+260 777 888 999',
      timestamp: '2025-07-18T16:45:00Z',
      qrCode: 'qr-abc123'
    }
  ]
};

// Utility functions for client operations
const clientStorageUtils = {
  getClientData: (clientId) => {
    // Try to get from localStorage first
    const client = localStorageUtils.getClientById(clientId);
    if (client) {
      return client;
    }
    
    // Fall back to sample data for demo
    return sampleClientData;
  },

  updateClientLandingUrl: (clientId, newUrl) => {
    const updatedClient = localStorageUtils.updateClient(clientId, { 
      url: newUrl,
      lastUpdated: new Date().toISOString()
    });
    
    if (updatedClient) {
      console.log(`Updated client ${clientId} URL to: ${newUrl}`);
      return updatedClient;
    }
    
    console.error(`Client ${clientId} not found`);
    return null;
  },

  getRegistrationStats: (registrations) => {
    if (!registrations || !Array.isArray(registrations)) {
      return { today: 0, yesterday: 0, week: 0, total: 0 };
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const todayRegistrations = registrations.filter(reg =>
      new Date(reg.timestamp).toDateString() === today.toDateString()
    ).length;

    const yesterdayRegistrations = registrations.filter(reg =>
      new Date(reg.timestamp).toDateString() === yesterday.toDateString()
    ).length;

    const weekRegistrations = registrations.filter(reg =>
      new Date(reg.timestamp) >= lastWeek
    ).length;

    return {
      today: todayRegistrations,
      yesterday: yesterdayRegistrations,
      week: weekRegistrations,
      total: registrations.length
    };
  },

  // Initialize sample client data if not exists
  initializeSampleClient: () => {
    const clients = localStorageUtils.getClients();
    if (!clients.find(c => c.id === sampleClientData.id)) {
      localStorageUtils.addClient(sampleClientData);
    }
  }
};

// Generate unique ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Export all utilities
export { 
  localStorageUtils, 
  clientStorageUtils, 
  authUtils,
  sampleClientData 
};