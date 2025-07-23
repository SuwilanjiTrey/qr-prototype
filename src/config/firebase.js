// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Add this import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVxn88CK5NwRuOzjNdib8QSPyopYiWKZE",
  authDomain: "qed-01.firebaseapp.com",
  databaseURL: "https://qed-01-default-rtdb.firebaseio.com",
  projectId: "qed-01",
  storageBucket: "qed-01.firebasestorage.app",
  messagingSenderId: "1017704502960",
  appId: "1:1017704502960:web:91ecb6a574342574a74d75",
  measurementId: "G-SKFEGFC55G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export db so other files can use it
export { db };
