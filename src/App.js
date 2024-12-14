import { auth } from './firebase';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track Firebase auth state loading
  const adminEmail = "swiftsail.ferries@gmail.com"; // Admin email

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth state has been resolved
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

  const ProtectedRoute = ({ children }) => {
    if (loading) return null; // Prevent rendering until auth state is resolved
    if (!user || user.email !== adminEmail) {
      // Trigger the "Access Denied" notification
      toast.error("Access Denied: Unauthorized attempt to access the admin panel.");
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <>
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Signup onClose={handleCloseSignup} />} />
          <Route path="/community" element={<Community userId={user?.uid} />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default App;
