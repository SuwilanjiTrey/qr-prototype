import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { firebaseUtils } from '../components/data';

const authUtils = {
  // Sign in user with Firebase Auth
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user role from Firestore after authentication
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

  // Create new user account
  createUser: async (email, password, userData) => {
    let userCredential;

    try {
      // First create the Firebase Auth user
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Prepare client data
      const clientData = {
        ...userData,
        email: user.email,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        passwordInitialized: true
      };
      
      // Create the document with the same ID as the Auth UID
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
      
      // If Firestore write failed, delete the Auth user to keep consistency
      if (userCredential && userCredential.user) {
        try {
          await deleteUser(userCredential.user);
        } catch (deleteError) {
          console.error('Error cleaning up failed user creation:', deleteError);
        }
      }
      
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
        // User is signed in, get their data from Firestore
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
        // User is signed out
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
    return authUtils.getCurrentUser() !== null && authUtils.getCurrentRole() !== null;
  },

  isAdmin: () => {
    return authUtils.getCurrentRole() === 'admin';
  },

  isClient: () => {
    return authUtils.getCurrentRole() === 'client';
  },

  // Password initialization helpers
  validateClientCredentials: async (email, qrCode) => {
    try {
      const client = await firebaseUtils.getClientByQRCode(qrCode);
      
      if (!client) {
        return { valid: false, error: 'Invalid QR code' };
      }
      
      if (client.email !== email) {
        return { valid: false, error: 'Email does not match QR code' };
      }
      
      if (client.passwordInitialized) {
        return { valid: false, error: 'Password already initialized. Use regular login.' };
      }
      
      return { valid: true, client };
    } catch (error) {
      console.error('Error validating client credentials:', error);
      return { valid: false, error: 'Validation failed' };
    }
  },

  // Initialize client password
  initializeClientPassword: async (email, qrCode, password) => {
    try {
      // Validate credentials first
      const validation = await authUtils.validateClientCredentials(email, qrCode);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const client = validation.client;

      // Create Firebase Auth account and update Firestore
      const fullUserData = await authUtils.createUser(email, password, {
        name: client.name,
        role: client.role,
        qrCode: client.qrCode,
        url: client.url,
        phone: client.phone || ''
      });

      return fullUserData;
    } catch (error) {
      console.error('Error initializing client password:', error);
      throw error;
    }
  }
};

export default authUtils;
