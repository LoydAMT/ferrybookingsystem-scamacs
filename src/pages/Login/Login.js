import React from 'react';
import styles from './Login.module.css';

function Login({ onClose }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add login logic here
    console.log("Login attempt");
  };

  return (
    <div className={styles.loginOverlay}>
      <div className={styles.loginForm}>
        <div className={styles.header}>
          <h2>Log In</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <div className={styles.rememberForget}>
            <label>
              <input type="checkbox" /> Remember Me?
            </label>
            <a href="#">Forget Password?</a>
          </div>
          <button type="submit" className={styles.loginButton}>Log In</button>
        </form>
        <div className={styles.divider}>
          <span>or continue with</span>
        </div>
        <div className={styles.socialLogin}>
          <button className={styles.googleButton}>
            <img src="/google-icon.png" alt="Google" />
            Google
          </button>
          <button className={styles.facebookButton}>
            <img src="/facebook-icon.png" alt="Facebook" />
            Facebook
          </button>
        </div>
        <div className={styles.signupPrompt}>
          <p>Don't have an account yet? <a href="#">Sign Up for Free</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;