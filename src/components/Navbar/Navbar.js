import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; // Update to use CSS modules

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <Link to="/">Home</Link>
        </li>
        <li className={styles.navbarItem}>
          <button onClick={onLoginClick} className={styles.loginButton}>Profile/Log In</button>
        </li>
        <li className={styles.navbarItem}>
          <Link to="/companies">Boat Schedules</Link>
        </li>
        <li className={styles.navbarItem}>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;