import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function Login({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAdminRedirect = (email) => {
    if (email === 'swiftsail.ferries@gmail.com') {
      navigate('/admin'); // Redirect to admin route
    } else {
      navigate('/'); // Redirect to home or user dashboard
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);

      handleAdminRedirect(userCredential.user.email);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          name: user.displayName,
          lastLogin: new Date(),
        },
        { merge: true }
      );
      console.log('User logged in and data stored:', user);

      handleAdminRedirect(user.email);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = () => handleSocialLogin(new GoogleAuthProvider());
  const handleFacebookLogin = () => handleSocialLogin(new FacebookAuthProvider());

  return (
    <div className={styles.loginOverlay}>
      <div className={styles.loginForm}>
        <div className={styles.closeButton}>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <div className={styles.header}>
          <img
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/862ba8ef16dcce19f4abbeb410002c45ecd86692ff43e21dea50b03224812831?apiKey=58b165f68bc74f159c175e4d9cf0f581&"
            alt="Swift Sail"
          />
        </div>
        <h2 className={styles.loginTitle}>Log In</h2>
        {error && (
          <div className={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.rememberForget}>
            <label style={{ color: '#0366FC' }}>
              <input type="checkbox" /> Remember Me?
            </label>
            <a href="#" style={{ color: '#F74E4E' }}>Forget Password?</a>
          </div>
          <button type="submit" className={styles.loginButton}>Log In</button>
        </form>
        <div className={styles.divider}>
          <span>or continue with</span>
        </div>
        <div className={styles.socialLogin}>
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/35f94a3bf969b7f054c8cac92a2d55712d80d797db0f64412832681b03c8a814?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Google" />
            Google
          </button>
          <button onClick={handleFacebookLogin} className={styles.facebookButton}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/57796a6c7a546ce39901e060fe3e3d975d8b67964881f4b04452e5fc2624df25?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Facebook" />
            Facebook
          </button>
        </div>
        <div className={styles.signupPrompt}>
          <p>Don't have an account yet? <a href="#" className={styles.signupLink} onClick={() => navigate('/signup')}>Sign Up for Free</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
