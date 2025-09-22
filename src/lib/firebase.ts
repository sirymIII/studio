// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore }m 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-1591778599-3abae',
  appId: '1:511672447236:web:0af17d1d465723b8c56051',
  apiKey: 'AIzaSyCpBTkvvxSqnUT9BeYeWLwiv58cSs3TfS8',
  authDomain: 'studio-1591778599-3abae.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '511672447236',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
