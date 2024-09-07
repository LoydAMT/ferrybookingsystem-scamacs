import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styles from './Profile.module.css';

const Profile = () => {
  // States for user data
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('myTickets');
  const [ticketContent, setTicketContent] = useState('Ticket information displayed here');
  


  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update ticketContent based on the selected tab
    switch (tab) {
      case 'myTickets':
        setTicketContent('Content for My Tickets');
        break;
      case 'bookingHistory':
        setTicketContent('Content for Booking History');
        break;
      case 'bookmarks':
        setTicketContent('Content for Bookmarks');
        break;
      default:
        setTicketContent('Ticket information displayed here');
    }
  };
 // Format date of birth
 const formatDateOfBirth = () => {
  if (!userData || !userData.birthMonth || !userData.birthDay || !userData.birthYear) {
    return 'Loading...';
  }

  const month = userData.birthMonth;
  const day = userData.birthDay;
  const year = userData.birthYear;

  return `${month} ${day}, ${year}`;
};
// Format name
const fullName = () => {
  if (!userData || !userData.lastName ||  !userData.firstName) {
    return 'Loading...';
  }

  const lastname = userData.lastName ;
  const firstname = userData.firstName;

  return `${lastname} ${firstname}`;
};

  return (
    <div className={styles.container}>
    {/* cover photo */}
    <div className={styles.coverPhoto}>
      {/* Add cover photo here */}
      <div className={styles.profilePic}>
        {/* Add profile picture here */}
        <img
            src={userData && userData.profilePic ? userData.profilePic : '/images/profile.jpg'}
            alt="Profile"
            className={styles.profilePicture}
          />
        </div>
      <h2 className={styles.username}>{fullName()}</h2>
    </div>

    <div className={styles.content}>
      <div className={styles.personalInfo}>
        <h3>Personal Information</h3>
        <p><strong>Username:</strong> {userData ? userData.username : ''}</p>
        <p><strong>E-mail:</strong> {userData ? userData.email : ''}</p>
        <p><strong>Phone Number:</strong> {userData ? userData.contactNumber : ''}</p>
        <p><strong>Date of Birth:</strong> {formatDateOfBirth()}</p>
        <p><strong>Address:</strong> {userData ? userData.municipality : ''}</p>
      </div>

      <div className={styles.ticketInfo}>
        <div className={styles.tabs}>
          <button
            className={activeTab === 'myTickets' ? styles.activeTab : ''}
            onClick={() => handleTabChange('myTickets')}
          >
            My Tickets
          </button>
          <button
            className={activeTab === 'bookingHistory' ? styles.activeTab : ''}
            onClick={() => handleTabChange('bookingHistory')}
          >
            Booking History
          </button>
          <button
            className={activeTab === 'bookmarks' ? styles.activeTab : ''}
            onClick={() => handleTabChange('bookmarks')}
          >
            Bookmarks
          </button>
        </div>
        <div className={styles.ticketDisplay}>
          <p>{ticketContent}</p>
        </div>
      </div>
    </div>
  </div>
);
};

export default Profile;
