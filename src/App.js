// src/App.js
import { auth } from './firebase';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import BookNow from './pages/BookNow/BookNow';
import Schedule from './pages/Schedule/Schedule';  
import Companies from './pages/Companies/Companies';
import PaymentTab from './pages/PaymentTab/Paymenttab';
import PaymentSuccess from './pages/PaymentTab/PaymentSuccess';
import PaymentFailure from './pages/PaymentTab/PaymentFailure';
import Dashboard from './pages/Admin/Admin'; // Import the Dashboard component
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Community from './pages/Community/Community'; // Import the Community component
import ScheduleView from './pages/Schedule/ScheduleView';
import PassengerDetails from './pages/PassengerDetails/PassengerDetails';
import 'typeface-open-sans';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
  };

  return (
    <Router>
      <Navbar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} user={user} />
      {showLogin && <Login onClose={handleCloseLogin} />}
      {showSignup && <Signup onClose={handleCloseSignup} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/book-now" element={<BookNow />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/scheduleview" element={<ScheduleView />} />
        <Route path="/passengerdetails" element={<PassengerDetails />} />
        <Route path="/payment" element={<PaymentTab />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/paymentfailure" element={<PaymentFailure />} />
        <Route path="/admin" element={user ? <Dashboard /> : <Login />} /> {/* Route for Dashboard */}
        <Route path="/signup" element={<Signup onClose={handleCloseSignup} />} />
        <Route path="/community" element={<Community userId={user?.uid} />} /> {/* Route for Community */}
      </Routes>
    </Router>
  );
}

export default App;
