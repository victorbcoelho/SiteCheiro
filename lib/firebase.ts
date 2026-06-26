import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

if (typeof window !== 'undefined') {
  console.log('[Sinesia Firebase] PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ NÃO CONFIGURADO');
  console.log('[Sinesia Firebase] isConfigured:', isConfigured);
}

export const app = isConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db = isConfigured && app ? getFirestore(app) : null;

if (typeof window !== 'undefined') {
  console.log('[Sinesia Firebase] db conectado:', db ? '✅ SIM' : '❌ NÃO — leads vão para localStorage');
}
