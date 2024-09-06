import React, { useState } from 'react';
import styles from './Profile.module.css';

const Profile = () => {
  
  // Ticket Informations
  const [activeTab, setActiveTab] = useState('myTickets');
  const [ticketContent, setTicketContent] = useState('Ticket information displayed here');

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

  return (
    <div className={styles.container}>
      {/* cover photo */}
      <div
        className={styles.coverPhoto}>
        {/* Add cover photo here */}

        <div className={styles.profilePic}>
          {/* Add profile picture here */}
        </div>
        <h2 className={styles.username}>Username</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.personalInfo}>
          <h3>Personal Information</h3>
          <p><strong>Full Name:</strong> Name Name</p>
          <p><strong>E-mail:</strong> scamacs@gmail.com</p>
          <p><strong>Phone Number:</strong> +63923-1234-123</p>
          <p><strong>Date of Birth:</strong> 01 January 2000</p>
          <p><strong>Address:</strong> Cebu City, Cebu, Philippines</p>
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
