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
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

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
