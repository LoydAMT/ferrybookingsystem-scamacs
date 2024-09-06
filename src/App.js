import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import BookNow from './pages/BookNow/BookNow';
import Companies from './pages/Companies/Companies';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
      <Navbar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick}/>
      {showLogin && <Login onClose={handleCloseLogin} />}
      {showSignup && <Signup onClose={handleCloseSignup} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-now" element={<BookNow />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/signup" element={<Signup />}/> */}
        <Route path="/signup" element={<Signup onClose={handleCloseSignup} />} />
      </Routes>
    </Router>
  );
}

export default App;