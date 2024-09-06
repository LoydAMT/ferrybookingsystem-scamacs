//src/App.js
import { auth, db } from './firebase';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import BookNow from './pages/BookNow/BookNow';
import Companies from './pages/Companies/Companies';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
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
        <Route path="/admin" element={<Admin />} />
        <Route path="/signup" element={<Signup onClose={handleCloseSignup} />} />
      </Routes>
    </Router>
  );
}

export default App;