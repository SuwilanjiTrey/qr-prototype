// Firebase Database Schema and Utilities for QR Registration System
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc,
  query, 
  where, 
  limit,
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

// ==================== CORE FIREBASE UTILITIES ====================
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

  // Initialize admin account - SIMPLE AND SECURE
  initializeAdmin: async () => {
    try {
      // Check if already initialized
      const isInitialized = await firebaseUtils.isSystemInitialized();
      if (isInitialized) {
        console.log('System already initialized');
        return null;
      }

      console.log('Creating admin account...');

      // Create Firebase Auth user for admin
      const adminCredential = await createUserWithEmailAndPassword(
        auth, 
        'admin@system.com', 
        'admin123'
      );
      
      const adminUid = adminCredential.user.uid;

      // Create admin document in qr_client collection
      const adminData = {
        name: 'System Admin',
        email: 'admin@system.com',
        phone: '+260 000 000 000',
        role: 'admin',
        qrCode: 'admin-qr-code',
        url: '/register/admin-qr-code',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        passwordInitialized: true
      };

      await setDoc(doc(db, 'qr_client', adminUid), adminData);

      // Mark system as initialized
      await setDoc(doc(db, 'qr_admin', 'settings'), {
        settings: {
          initialized: true,
          adminUid: adminUid,
          lastUpdated: serverTimestamp()
        }
      });

      console.log('Admin created with UID:', adminUid);
      return { id: adminUid, ...adminData };

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin already exists, marking system as initialized');
        
        // Find existing admin and mark system as initialized
        const existingAdmin = await firebaseUtils.getAdminUser();
        if (existingAdmin) {
          await setDoc(doc(db, 'qr_admin', 'settings'), {
            settings: {
              initialized: true,
              adminUid: existingAdmin.id,
              lastUpdated: serverTimestamp()
            }
          });
          return existingAdmin;
        }
      }
      console.error('Error initializing admin:', error);
      throw error;
    }
  },

  // Get admin user
  getAdminUser: async () => {
    try {
      const clientsRef = collection(db, 'qr_client');
      const q = query(clientsRef, where('role', '==', 'admin'), limit(1));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting admin user:', error);
      return null;
    }
  },

  // Get all clients (admin only)
  getClients: async () => {
    try {
      const clientsRef = collection(db, 'qr_client');
      const q = query(clientsRef, where('role', '==', 'client'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  // Add new client (admin only) - ENHANCED VERSION
  addClient: async (clientData) => {
    try {
      console.log('Creating client with data:', clientData);
      
      // Generate unique QR code if not provided
      const qrCode = clientData.qrCode || `qr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      // Prepare client data for Firestore
      const firestoreClientData = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone || '',
        qrCode: qrCode,
        url: `/register/${qrCode}`,
        role: 'client',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        passwordInitialized: true // Since admin is setting the password
      };

      // Create Firebase Auth user with the provided password
      console.log('Creating Firebase Auth user...');
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        clientData.email, 
        clientData.password
      );
      
      const clientUid = userCredential.user.uid;
      console.log('Firebase Auth user created with UID:', clientUid);

      // Create client document in Firestore with the same UID
      await setDoc(doc(db, 'qr_client', clientUid), firestoreClientData);
      console.log('Client document created in Firestore');

      // Return the complete client data
      return {
        id: clientUid,
        ...firestoreClientData
      };
    } catch (error) {
      console.error('Error adding client:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email address is already in use. Please use a different email.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      }
      
      throw error;
    }
  },

  // Get client by ID
  getClientById: async (clientId) => {
    try {
      const clientRef = doc(db, 'qr_client', clientId);
      const clientSnap = await getDoc(clientRef);
      
      if (clientSnap.exists()) {
        return { id: clientSnap.id, ...clientSnap.data() };
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
      const clientRef = doc(db, 'qr_client', clientId);
      await updateDoc(clientRef, {
        ...updatedData,
        lastUpdated: serverTimestamp()
      });
      
      return await firebaseUtils.getClientById(clientId);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client (admin only) - ENHANCED VERSION
  deleteClient: async (clientId) => {
    try {
      console.log('Deleting client with ID:', clientId);
      
      // First, get client data to check if it exists
      const clientData = await firebaseUtils.getClientById(clientId);
      if (!clientData) {
        throw new Error('Client not found');
      }

      // Delete associated registrations first
      console.log('Deleting client registrations...');
      const registrationsRef = collection(db, 'qr_registrations');
      const q = query(registrationsRef, where('clientId', '==', clientId));
      const snapshot = await getDocs(q);
      
      const deleteRegistrationPromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteRegistrationPromises);
      console.log(`Deleted ${snapshot.docs.length} registrations`);

      // Delete client document from Firestore
      console.log('Deleting client document...');
      await deleteDoc(doc(db, 'qr_client', clientId));
      
      // Note: We're not deleting the Firebase Auth user here because:
      // 1. It requires special admin privileges or the user to be currently signed in
      // 2. The client document deletion is sufficient for the app functionality
      // 3. If needed, Firebase Auth cleanup can be handled separately via Admin SDK
      
      console.log('Client deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Find client by QR code
  getClientByQRCode: async (qrCode) => {
    try {
      console.log("searching qr-code: ", qrCode)
      const clientsRef = collection(db, 'qr_client');
      console.log("check1: collection--✅️");
      const q = query(clientsRef, where('qrCode', '==', qrCode), limit(1));
      console.log("check 2: query--✅️", q);
      const snapshot = await getDocs(q);
      console.log("check 3: snapshot--✅️", snapshot);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      else{console.log("snapshot not found--❌️")}
      return null;
    } catch (error) {
      console.error('Error finding client by QR code:', error);
      return null;
    }
  },

  // Validate client credentials (for login)
  validateClientCredentials: async (email, password) => {
    try {
      // Try to sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get client data from Firestore
      const clientData = await firebaseUtils.getClientById(user.uid);
      
      if (clientData && clientData.role === 'client') {
        return {
          id: user.uid,
          email: user.email,
          ...clientData
        };
      }
      
      // Sign out if not a valid client
      await signOut(auth);
      return null;
    } catch (error) {
      console.error('Error validating client credentials:', error);
      return null;
    }
  },

  // Change password for current user
  changeUserPassword: async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      console.log('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('New password is too weak. Please use at least 6 characters.');
      }
      throw error;
    }
  },

  // Delete current user account (client self-deletion)
  deleteCurrentUserAccount: async (currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      const userId = user.uid;
      console.log('Deleting current user account:', userId);

      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Delete associated registrations first
      console.log('Deleting user registrations...');
      const registrationsRef = collection(db, 'qr_registrations');
      const q = query(registrationsRef, where('clientId', '==', userId));
      const snapshot = await getDocs(q);
      
      const deleteRegistrationPromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteRegistrationPromises);
      console.log(`Deleted ${snapshot.docs.length} registrations`);

      // Delete user document from Firestore
      console.log('Deleting user document...');
      await deleteDoc(doc(db, 'qr_client', userId));

      // Delete Firebase Auth user
      console.log('Deleting Firebase Auth user...');
      await deleteUser(user);

      console.log('User account deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user account:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log out and log back in before deleting your account');
      }
      throw error;
    }
  }
};

// ==================== AUTHENTICATION UTILITIES ====================
const authUtils = {
  // Sign in user with Firebase Auth
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userData = await firebaseUtils.getClientById(user.uid);
      
      if (userData) {
        const fullUserData = {
          id: user.uid,
          email: user.email,
          ...userData
        };
        
        authUtils.setCurrentUser(fullUserData);
        return fullUserData;
      }
      
      throw new Error('User data not found in database');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Create new user account (for password initialization)
  createUser: async (email, password, userData) => {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create/update user document with the same ID as Auth UID
      const clientData = {
        ...userData,
        email: user.email,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        passwordInitialized: true
      };
      
      await setDoc(doc(db, 'qr_client', user.uid), clientData);
      
      const fullUserData = {
        id: user.uid,
        email: user.email,
        ...clientData
      };
      
      authUtils.setCurrentUser(fullUserData);
      return fullUserData;
      
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      authUtils.clearAuth();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Listen for authentication state changes
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await firebaseUtils.getClientById(user.uid);
        if (userData) {
          const fullUserData = {
            id: user.uid,
            email: user.email,
            ...userData
          };
          authUtils.setCurrentUser(fullUserData);
          callback(fullUserData);
        } else {
          callback(null);
        }
      } else {
        authUtils.clearAuth();
        callback(null);
      }
    });
  },

  // Session management
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
    return authUtils.getCurrentUser() !== null;
  },

  isAdmin: () => {
    return authUtils.getCurrentRole() === 'admin';
  },

  isClient: () => {
    return authUtils.getCurrentRole() === 'client';
  }
};

// ==================== REGISTRATION UTILITIES ====================
const registrationUtils = {
  // Add new registration
  addRegistration: async (qrCode, registrationData) => {
    try {
      // Find client by QR code
      const client = await firebaseUtils.getClientByQRCode(qrCode);
      
      if (!client) {
        throw new Error('Invalid QR code');
      }
      
      const registrationsRef = collection(db, 'qr_registrations');
      const docRef = await addDoc(registrationsRef, {
        ...registrationData,
        clientId: client.id,
        qrCode: qrCode,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...registrationData,
        clientId: client.id,
        qrCode
      };
    } catch (error) {
      console.error('Error adding registration:', error);
      throw error;
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

  // Delete registration (admin or client owner)
  deleteRegistration: async (registrationId) => {
    try {
      await deleteDoc(doc(db, 'qr_registrations', registrationId));
      return true;
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  }
};

// ==================== CLIENT OPERATIONS UTILITIES ====================
const clientOperationsUtils = {
  // Initialize sample client data
  initializeSampleClient: async () => {
    try {
      const sampleQRCode = 'qr-abc123';
      
      // Check if sample client already exists
      const existingClient = await firebaseUtils.getClientByQRCode(sampleQRCode);
      if (existingClient) {
        console.log('Sample client already exists');
        return existingClient;
      }

      const sampleClientData = {
        name: 'AlphaPromo Marketing',
        phone: '+260 123 456 789',
        email: 'alphapromo@client.com',
        password: 'sample123', // Default password for sample client
        qrCode: sampleQRCode,
        url: `/register/${sampleQRCode}`,
        role: 'client'
      };

      const newClient = await firebaseUtils.addClient(sampleClientData);

      // Add sample registrations
      const sampleRegistrations = [
        { name: 'John Doe', email: 'john@example.com', phone: '+260 111 222 333' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '+260 444 555 666' },
        { name: 'Mike Johnson', email: 'mike@example.com', phone: '+260 777 888 999' }
      ];

      for (const registration of sampleRegistrations) {
        await registrationUtils.addRegistration(sampleQRCode, registration);
      }
      
      console.log('Sample client initialized');
      return newClient;
    } catch (error) {
      console.error('Error initializing sample client:', error);
      throw error;
    }
  },

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
      return await firebaseUtils.updateClient(clientId, { url: newUrl });
    } catch (error) {
      console.error('Error updating client landing URL:', error);
      throw error;
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

  // Bulk operations for clients
  bulkDeleteClients: async (clientIds) => {
    try {
      const deletePromises = clientIds.map(clientId => firebaseUtils.deleteClient(clientId));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Error in bulk delete clients:', error);
      throw error;
    }
  },

  // Get client statistics for admin dashboard
  getClientStatistics: async () => {
    try {
      const clients = await firebaseUtils.getClients();
      const allRegistrations = await registrationUtils.getAllRegistrations();
      
      // Group registrations by client
      const registrationsByClient = {};
      allRegistrations.forEach(reg => {
        if (!registrationsByClient[reg.clientId]) {
          registrationsByClient[reg.clientId] = [];
        }
        registrationsByClient[reg.clientId].push(reg);
      });

      // Calculate statistics
      const totalClients = clients.length;
      const totalRegistrations = allRegistrations.length;
      const averageRegistrationsPerClient = totalClients > 0 ? Math.round(totalRegistrations / totalClients) : 0;
      
      // Find most active client
      let mostActiveClient = null;
      let maxRegistrations = 0;
      
      clients.forEach(client => {
        const clientRegistrations = registrationsByClient[client.id] || [];
        if (clientRegistrations.length > maxRegistrations) {
          maxRegistrations = clientRegistrations.length;
          mostActiveClient = {
            ...client,
            registrationCount: clientRegistrations.length
          };
        }
      });

      return {
        totalClients,
        totalRegistrations,
        averageRegistrationsPerClient,
        mostActiveClient,
        clientsWithRegistrations: clients.map(client => ({
          ...client,
          registrations: registrationsByClient[client.id] || []
        }))
      };
    } catch (error) {
      console.error('Error getting client statistics:', error);
      throw error;
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate secure random password
export const generateSecurePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic validation)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString();
};

// Export all utilities
export { 
  firebaseUtils, 
  registrationUtils, 
  authUtils,
  clientOperationsUtils 
};
