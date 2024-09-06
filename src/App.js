import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import BookNow from './pages/BookNow/BookNow';
import Companies from './pages/Companies/Companies';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <Router>
      <Navbar onLoginClick={handleLoginClick} />
      {showLogin && <Login onClose={handleCloseLogin} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-now" element={<BookNow />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;