import React from 'react';
import styles from './Login.module.css';

function Login({ onClose }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login attempt");
  };

  return (
    <div className={styles.loginOverlay}>
      <div className={styles.loginForm}>
        <div className={styles.header}>
          <img
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/862ba8ef16dcce19f4abbeb410002c45ecd86692ff43e21dea50b03224812831?apiKey=58b165f68bc74f159c175e4d9cf0f581&"
            alt="Swift Sail"
          />
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email" required />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Password" required />
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
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/35f94a3bf969b7f054c8cac92a2d55712d80d797db0f64412832681b03c8a814?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Google" />
            Google
          </button>
          <button className={styles.facebookButton}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/57796a6c7a546ce39901e060fe3e3d975d8b67964881f4b04452e5fc2624df25?apiKey=58b165f68bc74f159c175e4d9cf0f581&" alt="Facebook" />
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
