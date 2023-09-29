// Code to initialize Firebase storage
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const serviceAccount = require('../chrome-extension-backend-822eb-firebase-adminsdk-49y3y-3c67cbbd18.json');

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase Admin with the service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: firebaseConfig.storageBucket,
});

// Access Firebase services via admin
const storage = admin.storage();

