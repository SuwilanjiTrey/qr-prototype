// Firebase Database Schema and Utilities for QR Registration System
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase'; // Assuming you have firebase.js configured

/*
FIRESTORE DATABASE SCHEMA (Using existing project with qr_ prefixes):

Collections Structure:
1. qr_clients/
   - clientId (auto-generated document ID)
   - name: string
   - email: string  
   - phone: string
   - password: string (hashed in production using Firebase Auth)
   - role: 'client' | 'admin'
   - qrCode: string
   - url: string
   - createdAt: timestamp
   - lastUpdated: timestamp

2. qr_registrations/
   - registrationId (auto-generated document ID)
   - clientId: string (reference to client)
   - qrCode: string
   - name: string
   - email: string
   - phone: string
   - timestamp: timestamp
   - createdAt: timestamp

3. qr_admin/ (single document for admin settings)
   - settings (map)
     - initialized: boolean
     - lastUpdated: timestamp

Note: Security rules are configured to allow initialization without authentication.
*/

// Firebase utilities for client operations
const firebaseUtils = {
  // Check if system is initialized
  isSystemInitialized: async () => {
    try {
      const adminSettingsRef = doc(db, 'qr_admin', 'settings');
      const adminSettingsSnap = await getDoc(adminSettingsRef);
      return adminSettingsSnap.exists() && adminSettingsSnap.data()?.settings?.initialized === true;
    } catch (error) {
      console.error('Error checking system initialization:', error);
      return false;
    }
  },

  // Get all clients (admin only)
  getClients: async () => {
    try {
      const clientsRef = collection(db, 'qr_clients');
      const snapshot = await getDocs(clientsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  // Add new client
  addClient: async (clientData) => {
    try {
      const clientsRef = collection(db, 'qr_clients');
      const docRef = await addDoc(clientsRef, {
        ...clientData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...clientData
      };
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  },

  // Get client by ID
  getClientById: async (clientId) => {
    try {
      const clientRef = doc(db, 'qr_clients', clientId);
      const clientSnap = await getDoc(clientRef);
      
      if (clientSnap.exists()) {
        return {
          id: clientSnap.id,
          ...clientSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  // Update client data
  updateClient: async (clientId, updatedData) => {
    try {
      const clientRef = doc(db, 'qr_clients', clientId);
      await updateDoc(clientRef, {
        ...updatedData,
        lastUpdated: serverTimestamp()
      });
      
      // Return updated client data
      return await firebaseUtils.getClientById(clientId);
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  // Find client by QR code
  getClientByQRCode: async (qrCode) => {
    try {
      const clientsRef = collection(db, 'qr_clients');
      const q = query(clientsRef, where('qrCode', '==', qrCode));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error finding client by QR code:', error);
      return null;
    }
  },

  // Initialize admin account - UPDATED to work without authentication
  initializeAdmin: async () => {
    try {
      // First check if already initialized
      const isInitialized = await firebaseUtils.isSystemInitialized();
      if (isInitialized) {
        console.log('System already initialized');
        return null;
      }

      // Create admin client first
      const adminData = {
        name: 'Admin',
        qrCode: 'admin-qr',
        url: '/register/admin-qr',
        email: 'admin@system.com',
        password: 'admin123', // Hash this in production with Firebase Auth
        role: 'admin'
      };
      
      const adminClient = await firebaseUtils.addClient(adminData);
      
      // Mark admin as initialized
      const adminSettingsRef = doc(db, 'qr_admin', 'settings');
      await setDoc(adminSettingsRef, {
        settings: {
          initialized: true,
          adminClientId: adminClient.id,
          lastUpdated: serverTimestamp()
        }
      });
      
      return adminClient;
    } catch (error) {
      console.error('Error initializing admin:', error);
      throw error;
    }
  }
};

// Registration utilities
const registrationUtils = {
  // Add new registration
  addRegistration: async (qrCode, registrationData) => {
    try {
      // Find client by QR code
      const client = await firebaseUtils.getClientByQRCode(qrCode);
      let clientId;
      
      if (client) {
        clientId = client.id;
      } else {
        // Assign to admin if QR code not found
        const adminClient = await registrationUtils.getAdminClient();
        clientId = adminClient ? adminClient.id : null;
      }
      
      if (!clientId) {
        throw new Error('No valid client found for registration');
      }
      
      const registrationsRef = collection(db, 'qr_registrations');
      const docRef = await addDoc(registrationsRef, {
        ...registrationData,
        clientId,
        qrCode,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...registrationData,
        clientId,
        qrCode
      };
    } catch (error) {
      console.error('Error adding registration:', error);
      throw error;
    }
  },

  // Get registrations by QR code
  getRegistrationsByQRCode: async (qrCode) => {
    try {
      const registrationsRef = collection(db, 'qr_registrations');
      const q = query(
        registrationsRef, 
        where('qrCode', '==', qrCode),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching registrations by QR code:', error);
      return [];
    }
  },

  // Get registrations by client ID
  getRegistrationsByClientId: async (clientId) => {
    try {
      const registrationsRef = collection(db, 'qr_registrations');
      const q = query(
        registrationsRef, 
        where('clientId', '==', clientId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching registrations by client ID:', error);
      return [];
    }
  },

  // Get all registrations (admin only)
  getAllRegistrations: async () => {
    try {
      const registrationsRef = collection(db, 'qr_registrations');
      const q = query(registrationsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching all registrations:', error);
      return [];
    }
  },

  // Get admin client
  getAdminClient: async () => {
    try {
      const clientsRef = collection(db, 'qr_clients');
      const q = query(clientsRef, where('role', '==', 'admin'));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin client:', error);
      return null;
    }
  }
};

// Authentication utilities (for Firebase Auth integration)
const authUtils = {
  // Validate admin login
  validateAdmin: async (email, password) => {
    try {
      const clientsRef = collection(db, 'qr_clients');
      const q = query(
        clientsRef, 
        where('role', '==', 'admin'),
        where('email', '==', email)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const adminDoc = snapshot.docs[0];
        const adminData = adminDoc.data();
        
        // In production, use Firebase Auth for proper password handling
        if (adminData.password === password) {
          const { password: _, ...userDataWithoutPassword } = adminData;
          return {
            id: adminDoc.id,
            ...userDataWithoutPassword
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error validating admin:', error);
      return null;
    }
  },

  // Validate client login
  validateClient: async (email, password) => {
    try {
      const clientsRef = collection(db, 'qr_clients');
      const q = query(
        clientsRef, 
        where('role', '==', 'client'),
        where('email', '==', email)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const clientDoc = snapshot.docs[0];
        const clientData = clientDoc.data();
        
        // In production, use Firebase Auth for proper password handling
        if (clientData.password === password) {
          const { password: _, ...userDataWithoutPassword } = clientData;
          return {
            id: clientDoc.id,
            ...userDataWithoutPassword
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error validating client:', error);
      return null;
    }
  },

  // Session management (you might want to use Firebase Auth instead)
  getCurrentUser: () => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  setCurrentUser: (userData) => {
    try {
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      sessionStorage.setItem('userRole', userData.role);
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  getCurrentRole: () => {
    return sessionStorage.getItem('userRole') || null;
  },

  clearAuth: () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
  },

  isAuthenticated: () => {
    return authUtils.getCurrentUser() !== null && authUtils.getCurrentRole() !== null;
  },

  isAdmin: () => {
    return authUtils.getCurrentRole() === 'admin';
  },

  isClient: () => {
    return authUtils.getCurrentRole() === 'client';
  }
};

// Client operations utilities
const clientOperationsUtils = {
  // Get client data with registrations
  getClientData: async (clientId) => {
    try {
      const client = await firebaseUtils.getClientById(clientId);
      if (!client) return null;
      
      const registrations = await registrationUtils.getRegistrationsByClientId(clientId);
      
      return {
        ...client,
        registrations
      };
    } catch (error) {
      console.error('Error getting client data:', error);
      return null;
    }
  },

  // Update client landing URL
  updateClientLandingUrl: async (clientId, newUrl) => {
    try {
      const updatedClient = await firebaseUtils.updateClient(clientId, { 
        url: newUrl
      });
      
      if (updatedClient) {
        console.log(`Updated client ${clientId} URL to: ${newUrl}`);
        return updatedClient;
      }
      
      console.error(`Client ${clientId} not found`);
      return null;
    } catch (error) {
      console.error('Error updating client URL:', error);
      return null;
    }
  },

  // Get registration statistics
  getRegistrationStats: (registrations) => {
    if (!registrations || !Array.isArray(registrations)) {
      return { today: 0, yesterday: 0, week: 0, total: 0 };
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const todayRegistrations = registrations.filter(reg => {
      const regDate = reg.timestamp?.toDate ? reg.timestamp.toDate() : new Date(reg.timestamp);
      return regDate.toDateString() === today.toDateString();
    }).length;

    const yesterdayRegistrations = registrations.filter(reg => {
      const regDate = reg.timestamp?.toDate ? reg.timestamp.toDate() : new Date(reg.timestamp);
      return regDate.toDateString() === yesterday.toDateString();
    }).length;

    const weekRegistrations = registrations.filter(reg => {
      const regDate = reg.timestamp?.toDate ? reg.timestamp.toDate() : new Date(reg.timestamp);
      return regDate >= lastWeek;
    }).length;

    return {
      today: todayRegistrations,
      yesterday: yesterdayRegistrations,
      week: weekRegistrations,
      total: registrations.length
    };
  },

  // Initialize sample client data
  initializeSampleClient: async () => {
    try {
      const sampleClientData = {
        name: 'AlphaPromo Marketing',
        qrCode: 'qr-abc123',
        email: 'contact@alphapromo.com',
        phone: '+260 123 456 789',
        password: 'client123',
        role: 'client',
        url: '/register/qr-abc123'
      };

      // Check if sample client already exists
      const existingClient = await firebaseUtils.getClientByQRCode(sampleClientData.qrCode);
      if (!existingClient) {
        const newClient = await firebaseUtils.addClient(sampleClientData);
        
        // Add sample registrations
        const sampleRegistrations = [
          {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+260 111 222 333'
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+260 444 555 666'
          },
          {
            name: 'Mike Johnson',
            email: 'mike@example.com',
            phone: '+260 777 888 999'
          }
        ];

        for (const registration of sampleRegistrations) {
          await registrationUtils.addRegistration(sampleClientData.qrCode, registration);
        }
        
        return newClient;
      }
      return existingClient;
    } catch (error) {
      console.error('Error initializing sample client:', error);
      throw error;
    }
  },

  // Initialize the entire system - call this on app startup
  initializeSystem: async () => {
    try {
      console.log('Initializing QR Registration System...');
      
      // Check if system is already initialized
      const isInitialized = await firebaseUtils.isSystemInitialized();
      if (isInitialized) {
        console.log('System already initialized');
        return { success: true, message: 'System already initialized' };
      }

      // Initialize admin
      console.log('Creating admin account...');
      const adminClient = await firebaseUtils.initializeAdmin();
      
      // Initialize sample client
      console.log('Creating sample client...');
      const sampleClient = await clientOperationsUtils.initializeSampleClient();
      
      console.log('System initialization completed successfully');
      return { 
        success: true, 
        message: 'System initialized successfully',
        adminClient,
        sampleClient
      };
    } catch (error) {
      console.error('Error initializing system:', error);
      return { 
        success: false, 
        message: 'System initialization failed',
        error: error.message
      };
    }
  }
};

// Generate unique ID (though Firestore auto-generates IDs)
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Export all utilities
export { 
  firebaseUtils, 
  registrationUtils, 
  authUtils,
  clientOperationsUtils 
};
