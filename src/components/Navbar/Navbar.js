import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaGlobe } from 'react-icons/fa'; // Import Font Awesome Globe icon

const Navbar = ({ onLoginClick }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left side: Logo */}
        <div className={styles.logoContainer}>
          <img src="/images/SWIFT_SAIL_9.png" alt="Logo" className={styles.logo} />
        </div>

        {/* Center: Navigation Links */}
        <ul className={styles.navbarList}>
          <li className={styles.navbarItem}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.navbarItem}>
            <Link to="/companies">Companies</Link>
          </li>
          <li className={styles.navbarItem}>
            <Link to="/schedule">Schedule</Link>
          </li>
          <li className={styles.navbarItem}>
            <Link to="/community">Community</Link>
          </li>
        </ul>

        {/* Right side: Language icon first, then Sign In button */}
        <div className={styles.rightSection}>
          <FaGlobe className={styles.languageIcon} />
          <button onClick={onLoginClick} className={styles.signInButton}>SIGN IN</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
