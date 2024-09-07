import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaGlobe } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Navbar = ({ onLoginClick }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('/images/HomeBackground.png');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePic(userData.profilePic || '/images/HomeBackground.png');
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

        {/* Right side: Login/Profile and Language */}
        <div className={styles.rightSection}>
          {user ? (
            <div className={styles.profileContainer}>
              <img 
                src={profilePic} 
                alt="Profile" 
                className={styles.profilePicture} 
                onClick={handleProfileClick} 
              />
              <button className={styles.logoutButton} onClick={handleSignOut}>
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className={styles.signInButton}>SIGN IN</button>
          )}
          <FaGlobe className={styles.languageIcon} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;