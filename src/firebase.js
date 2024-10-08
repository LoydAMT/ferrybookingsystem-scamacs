// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Add if using Storage

const firebaseConfig = {
  apiKey: "AIzaSyDLTOiX6wQuDWPwnXa34XUQxKLegRzVwXQ",
  authDomain: "swiftsail-a35c3.firebaseapp.com",
  projectId: "swiftsail-a35c3",
  storageBucket: "swiftsail-a35c3.appspot.com",
  messagingSenderId: "908848432093",
  appId: "1:908848432093:web:afb58ccfd823d2fe746c34",
  measurementId: "G-1EHMC7PB9N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Add if using Storage

