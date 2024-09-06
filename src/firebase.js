// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLTOiX6wQuDWPwnXa34XUQxKLegRzVwXQ",
  authDomain: "swiftsail-a35c3.firebaseapp.com",
  projectId: "swiftsail-a35c3",
  storageBucket: "swiftsail-a35c3.appspot.com",
  messagingSenderId: "908848432093",
  appId: "1:908848432093:web:afb58ccfd823d2fe746c34",
  measurementId: "G-1EHMC7PB9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
