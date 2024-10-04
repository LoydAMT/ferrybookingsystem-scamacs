import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaGlobe, FaSignOutAlt } from 'react-icons/fa'; // Import the log-out icon
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Navbar = ({ onLoginClick }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('/images/default-profile.jpg');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePic(userData.profilePic || '/images/default-profile.jpg');
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Hide navbar for admin page
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* Left side: Logo */}
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src="/images/SWIFT_SAIL_9.png" alt="Logo" className={styles.logo} />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <ul className={styles.navbarList}>
          <li className={styles.navbarItem}>
            <Link 
              to="/" 
              className={location.pathname === '/' ? styles.active : ''}
            >
              Home
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link 
              to="/companies" 
              className={location.pathname === '/companies' ? styles.active : ''}
            >
              Companies
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link 
              to="/schedule" 
              className={location.pathname === '/schedule' ? styles.active : ''}
            >
              Schedule
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link 
              to="/community" 
              className={location.pathname === '/community' ? styles.active : ''}
            >
              Community
            </Link>
          </li>
        </ul>

        {/* Right side: Login/Profile and Language */}
        <div className={styles.rightSection}>
          <FaGlobe className={styles.languageIcon} />

          {user ? (
            <div className={styles.profileContainer} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img 
                src={profilePic} 
                alt="Profile" 
                className={styles.profilePicture} 
                onClick={handleProfileClick} 
              />
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleProfileClick} className={styles.profileButton}>Profile</button>
                  <button onClick={handleSignOut} className={styles.signOutButton}>
                    Sign Out <FaSignOutAlt className={styles.logoutIcon} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onLoginClick} className={styles.signInButton}>SIGN IN</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
