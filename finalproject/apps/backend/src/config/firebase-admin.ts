// backend/src/config/firebase-admin.ts
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('🟡 Inicialized Firebase Admin ...');

// VVerify that the required environment variables are set
if (!admin.apps.length) {
  try {
    // Verify that all required environment variables are present
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_CLIENT_EMAIL || 
        !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Requiered firabase enviroment variables are missing.');
    }

    // Replace escaped newlines in the private key (if present)
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    throw error;
  }
} else {
  console.log('Firebase Admin already initialized, using existing instance');
}

export default admin;