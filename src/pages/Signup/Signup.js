//src/pages/Signup/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Ensure this path is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import styles from './Signup.module.css';

function Signup({ onClose }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        contactNumber: '',
        email: '',
        password: '',
        birthMonth: '',
        birthDay: '',
        birthYear: '',
        gender: '',
        municipality: '',
        district: '',
        region: '',
        agreeTerms: false
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Prepare user data for Firestore (excluding sensitive information)
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                contactNumber: formData.contactNumber,
                email: formData.email,
                birthMonth: formData.birthMonth,
                birthDay: formData.birthDay,
                birthYear: formData.birthYear,
                gender: formData.gender,
                municipality: formData.municipality,
                district: formData.district,
                region: formData.region,
                profilePic:'/images/default-profile.jpg',
                coverPhoto:'/images/cover-default.png',
                createdAt: new Date()
            };

            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), userData);

            console.log('User signed up successfully');
            onClose();
            navigate('/dashboard'); // Adjust this route as needed
        } catch (error) {
            console.error('Error signing up:', error);
            setError(error.message);
        }
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

    return (
        <div className={styles.signupOverlay}>
            <div className={styles.signupForm}>
            <div className={styles.closeButton}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
            </div>
                <div className={styles.header}>
                <div className={styles.signupText}>
                    <h1>Sign Up</h1>
                    <p>It's ferry fast and easy!</p>
                </div>

                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/862ba8ef16dcce19f4abbeb410002c45ecd86692ff43e21dea50b03224812831?apiKey=58b165f68bc74f159c175e4d9cf0f581&"
                        alt="Swift Sail"
                    />
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit}>
                <div className={styles.nameGroup}>
                    <div className={styles.inputGroup}>
                        <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <select name="countryCode" value={formData.countryCode} onChange={handleChange}>
                            <option value="PH +63">PH +63</option>
                            {/* Add other country codes as needed */}
                        </select>
                        <input
                            type="tel"
                            name="contactNumber"
                            placeholder="XXX - XXXX - XXX"
                            required
                            value={formData.contactNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.birthdateGroup}>
                        <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} required>
                            <option value="">Month</option>
                            {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                        <select name="birthDay" value={formData.birthDay} onChange={handleChange} required>
                            <option value="">Day</option>
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        <select name="birthYear" value={formData.birthYear} onChange={handleChange} required>
                            <option value="">Year</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.genderGroup}>
                        <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                        />
                        <label htmlFor="female">Female</label>
                        <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                        />
                        <label htmlFor="male">Male</label>
                        <input
                            type="radio"
                            id="prefer_not_to_say"
                            name="gender"
                            value="prefer_not_to_say"
                            checked={formData.gender === 'prefer_not_to_say'}
                            onChange={handleChange}
                        />
                        <label htmlFor="prefer_not_to_say">Prefer not to say</label>
                    </div>

                    <div className={styles.addressGroup}>
                        <select name="municipality" value={formData.municipality} onChange={handleChange} required>
                            <option value="">Select Municipality</option>
                            <option value="Cebu City">Cebu City</option>
                            <option value="Mandaue City">Mandaue City</option>
                            <option value="Lapu-Lapu City">Lapu-Lapu City</option>
                            <option value="Danao City">Danao City</option>
                            <option value="Carcar City">Carcar City</option>
                            <option value="Tagbilaran City">Tagbilaran City</option>
                            <option value="Dumaguete City">Dumaguete City</option>
                            <option value="Iloilo City">Iloilo City</option>
                            <option value="Bacolod City">Bacolod City</option>
                            <option value="Cagayan de Oro City">Cagayan de Oro City</option>
                        </select>
                        <select name="district" value={formData.district} onChange={handleChange} required>
                            <option value="">Select District</option>
                            <option value="1st District of Cebu">1st District of Cebu</option>
                            <option value="2nd District of Cebu">2nd District of Cebu</option>
                            <option value="3rd District of Cebu">3rd District of Cebu</option>
                            <option value="1st District of Negros Occidental">1st District of Negros Occidental</option>
                            <option value="2nd District of Negros Occidental">2nd District of Negros Occidental</option>
                            <option value="1st District of Iloilo">1st District of Iloilo</option>
                            <option value="2nd District of Iloilo">2nd District of Iloilo</option>
                            <option value="1st District of Bohol">1st District of Bohol</option>
                            <option value="2nd District of Bohol">2nd District of Bohol</option>
                            <option value="1st District of Misamis Oriental">1st District of Misamis Oriental</option>
                        </select>
                        <select name="region" value={formData.region} onChange={handleChange} required>
                            <option value="">Select Region</option>
                            <option value="Region VII (Central Visayas)">Region VII (Central Visayas)</option>
                            <option value="Region VI (Western Visayas)">Region VI (Western Visayas)</option>
                            <option value="Region XI (Davao Region)">Region XI (Davao Region)</option>
                            <option value="Region X (Northern Mindanao)">Region X (Northern Mindanao)</option>
                            <option value="Region V (Bicol Region)">Region V (Bicol Region)</option>
                            <option value="Region IX (Zamboanga Peninsula)">Region IX (Zamboanga Peninsula)</option>
                            <option value="NCR (National Capital Region)">NCR (National Capital Region)</option>
                            <option value="CAR (Cordillera Administrative Region)">CAR (Cordillera Administrative Region)</option>
                        </select>
                    </div>
                    <div className={styles.addressGroup}>
                        <input
                            type="text"
                            name="addressSuggestion"
                            placeholder="Enter address information to get suggestions"
                            value={formData.addressSuggestion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.termsGroup}>
                        <label>
                            <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            required
                            />
                            I agree to the<a href="#">Terms and Conditions</a>
                        </label>
                    </div>

                    <button type="submit" className={styles.createAccountButton}>Create Account</button>
                </form>

                <div className={styles.loginPrompt}>
                    <p>Already have an account? <a href="#" onClick={() => navigate('/login')}>Log In</a></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;