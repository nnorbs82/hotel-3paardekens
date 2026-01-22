/**
 * Firebase Configuration for Hotel 3 Paardekens
 * This connects the application to Firebase Realtime Database for persistent storage
 * 
 * SETUP REQUIRED: Replace the placeholder values below with your actual Firebase configuration
 * See FIREBASE_SETUP.md for detailed setup instructions
 */

(function() {
  'use strict';

  // TODO: Replace these placeholder values with your actual Firebase configuration
  // Get these values from: https://console.firebase.google.com/
  // Project Settings > General > Your apps > SDK setup and configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5i8P4OqyjfVZkLQTFiOGDLweFYENgxpM",
  authDomain: "hotel-3paardekens.firebaseapp.com",
  projectId: "hotel-3paardekens",
  storageBucket: "hotel-3paardekens.firebasestorage.app",
  messagingSenderId: "671251674657",
  appId: "1:671251674657:web:a16f986234f162a92f1560"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

  // Check if Firebase SDK is loaded
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Please include Firebase scripts in your HTML.');
    return;
  }

  // Initialize Firebase if not already initialized
  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
      console.log('✓ Firebase initialized successfully');
    } else {
      console.log('✓ Firebase already initialized');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    console.error('Please check your Firebase configuration in firebase-config.js');
  }

  // Make config available globally (for debugging)
  window.FirebaseConfig = {
    isConfigured: firebaseConfig.apiKey !== "YOUR_API_KEY_HERE",
    databaseURL: firebaseConfig.databaseURL
  };

})();
