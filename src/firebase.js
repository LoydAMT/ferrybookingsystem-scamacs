import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };
