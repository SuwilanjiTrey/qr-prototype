// Demo data and users for the QR tracking system
export const demoUsers = [
  { id: 1, email: 'admin@system.com', password: 'admin123', role: 'admin', name: 'System Administrator' },
  { id: 2, email: 'techcorp@client.com', password: 'client123', role: 'client', name: 'TechCorp Manager', clientId: 'ABC123' },
  { id: 3, email: 'greenenergy@client.com', password: 'client123', role: 'client', name: 'Green Energy Manager', clientId: 'DEF456' },
  { id: 4, email: 'healthplus@client.com', password: 'client123', role: 'client', name: 'Health Plus Manager', clientId: 'GHI789' }
];

export const demoClients = [
  { id: 'ABC123', name: 'TechCorp Solutions', industry: 'Technology', created: '2024-01-15', status: 'active' },
  { id: 'DEF456', name: 'Green Energy Ltd', industry: 'Energy', created: '2024-01-20', status: 'active' },
  { id: 'GHI789', name: 'Health Plus Clinic', industry: 'Healthcare', created: '2024-02-01', status: 'active' }
];

export const demoRegistrations = [
  { id: 1, clientId: 'ABC123', userName: 'John Doe', email: 'john@example.com', phone: '+1234567890', timestamp: '2024-02-15T10:30:00Z' },
  { id: 2, clientId: 'ABC123', userName: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', timestamp: '2024-02-16T14:20:00Z' },
  { id: 3, clientId: 'DEF456', userName: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', timestamp: '2024-02-17T09:15:00Z' },
  { id: 4, clientId: 'GHI789', userName: 'Alice Brown', email: 'alice@example.com', phone: '+1234567893', timestamp: '2024-02-18T16:45:00Z' },
  { id: 5, clientId: 'ABC123', userName: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1234567894', timestamp: '2024-02-19T11:30:00Z' }
];

export const demoQrClicks = [
  { id: 1, clientId: 'ABC123', timestamp: '2024-02-15T10:25:00Z', converted: true },
  { id: 2, clientId: 'ABC123', timestamp: '2024-02-15T11:15:00Z', converted: false },
  { id: 3, clientId: 'ABC123', timestamp: '2024-02-16T14:15:00Z', converted: true },
  { id: 4, clientId: 'DEF456', timestamp: '2024-02-17T09:10:00Z', converted: true },
  { id: 5, clientId: 'GHI789', timestamp: '2024-02-18T16:40:00Z', converted: true },
  { id: 6, clientId: 'ABC123', timestamp: '2024-02-19T11:25:00Z', converted: true },
  { id: 7, clientId: 'ABC123', timestamp: '2024-02-20T15:30:00Z', converted: false },
  { id: 8, clientId: 'DEF456', timestamp: '2024-02-21T08:45:00Z', converted: false }
];