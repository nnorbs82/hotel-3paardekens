/**
 * Firebase Configuration for Hotel 3 Paardekens
 * This connects the application to Firebase Realtime Database and Storage for persistent storage
 * 
 * SETUP REQUIRED: Replace the placeholder values below with your actual Firebase configuration
 * See FIREBASE_SETUP.md for detailed setup instructions
 */

(function() {
  'use strict';

  // Firebase configuration
  // Get these values from: https://console.firebase.google.com/
  // Project Settings > General > Your apps > SDK setup and configuration
  //
  // SECURITY NOTE: These credentials are safe to expose in client-side code.
  // Firebase uses security rules to control access, not credential secrecy.
  // Ensure you configure proper security rules and domain restrictions in
  // the Firebase Console to prevent unauthorized access.
  const firebaseConfig = {
    apiKey: "AIzaSyD5i8P4OqyjfVZkLQTFiOGDLweFYENgxpM",
    authDomain: "hotel-3paardekens.firebaseapp.com",
    databaseURL: "https://hotel-3paardekens-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hotel-3paardekens",
    storageBucket: "hotel-3paardekens.firebasestorage.app",
    messagingSenderId: "671251674657",
    appId: "1:671251674657:web:a16f986234f162a92f1560"
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
      console.log('✓ Database URL:', firebaseConfig.databaseURL);
      console.log('✓ Storage Bucket:', firebaseConfig.storageBucket);
    } else {
      console.log('✓ Firebase already initialized');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    console.error('Please check your Firebase configuration in firebase-config.js');
  }

  // Make config available globally (for debugging)
  window.FirebaseConfig = {
    isConfigured: true,
    databaseURL: firebaseConfig.databaseURL,
    storageBucket: firebaseConfig.storageBucket
  };

})();
