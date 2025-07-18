// Helper functions for the QR tracking system

export const getClientStats = (clients, registrations, qrClicks, clientId = null) => {
  const targetClients = clientId ? clients.filter(c => c.id === clientId) : clients;
  
  return targetClients.map(client => {
    const clientRegistrations = registrations.filter(reg => reg.clientId === client.id);
    const clientClicks = qrClicks.filter(click => click.clientId === client.id);
    const conversionRate = clientClicks.length > 0 ? 
      (clientClicks.filter(click => click.converted).length / clientClicks.length * 100).toFixed(1) : 0;
    
    return {
      ...client,
      registrations: clientRegistrations.length,
      clicks: clientClicks.length,
      conversionRate: conversionRate,
      lastRegistration: clientRegistrations
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.timestamp
    };
  });
};

export const createQRClick = (clientId) => {
  return {
    id: Date.now(),
    clientId: clientId,
    timestamp: new Date().toISOString(),
    converted: false
  };
};

export const createRegistration = (clientId, userData) => {
  return {
    id: Date.now(),
    clientId: clientId,
    userName: userData.name,
    email: userData.email,
    phone: userData.phone,
    timestamp: new Date().toISOString()
  };
};