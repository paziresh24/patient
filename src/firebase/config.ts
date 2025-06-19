// Import the functions you need from the SDKs you need
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const firebaseConfig = {
  apiKey: publicRuntimeConfig.FIREBASE_API_KEY,
  authDomain: publicRuntimeConfig.FIREBASE_AUTH_DOMAIN,
  databaseURL: publicRuntimeConfig.FIREBASE_DATABASE_URL,
  projectId: publicRuntimeConfig.FIREBASE_PROJECT_ID,
  storageBucket: publicRuntimeConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: publicRuntimeConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId: publicRuntimeConfig.FIREBASE_APP_ID,
  measurementId: publicRuntimeConfig.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app as FirebaseApp;
