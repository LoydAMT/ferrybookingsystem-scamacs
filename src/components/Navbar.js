// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/profile">Profile/Log In</Link>
        </li>
        <li className="navbar-item">
          <Link to="/book-now">Book Now</Link>
        </li>
        <li className="navbar-item">
          <Link to="/companies">Boat Schedules</Link>
        </li>
        <li className="navbar-item">
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
