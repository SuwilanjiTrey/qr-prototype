// Updated authentication utilities using Firebase Auth
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
// You'll need to import or create firebaseUtils separately
import { firebaseUtils } from '../components/data'; // Adjust path as needed



const authUtils = {
  // Sign in user with Firebase Auth
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user role from Firestore after authentication
      const userData = await firebaseUtils.getClientById(user.uid);
      
      if (userData) {
        authUtils.setCurrentUser({
          id: user.uid,
          email: user.email,
          ...userData
        });
        return userData;
      }
      
      throw new Error('User data not found in database');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Create new user account
  createUser: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore with the same ID as Auth user
      const clientData = {
        ...userData,
        email: user.email,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };
      
      // Use setDoc with the Auth user ID
      await setDoc(doc(db, 'qr_clients', user.uid), clientData);
      
      return {
        id: user.uid,
        email: user.email,
        ...clientData
      };
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

  // Rest of your existing authUtils methods remain the same
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

export default authUtils;
