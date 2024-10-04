import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './Profile.module.css';

const Profile = () => {
  // States for user data
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('myTickets');
  const [ticketContent, setTicketContent] = useState('Ticket information displayed here');
  const [profilePic, setProfilePic] = useState(null); // State for profile picture file
  const [imageUrl, setImageUrl] = useState(''); // State for uploaded image URL
  const [uploadStatus, setUploadStatus] = useState(''); // State for upload status message

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
            setImageUrl(userDoc.data().profilePic); // Set existing profile picture URL
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
    if (!userData || !userData.lastName || !userData.firstName) {
      return 'Loading...';
    }

    const lastname = userData.lastName;
    const firstname = userData.firstName;

    return `${lastname} ${firstname}`;
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setUploadStatus(''); // Clear any previous status
    }
  };

  // Handle upload functionality
  const handleUpload = async () => {
    if (!profilePic) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `profile_pics/${profilePic.name}`);

    try {
      // Upload the file
      await uploadBytes(storageRef, profilePic);
      // Get the download URL
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      setUploadStatus('Upload successful!');

      // Update Firestore with the new profile picture URL
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(getFirestore(), "users", user.uid), { profilePic: url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Cover photo */}
      <div className={styles.coverPhoto}>
        <img
          src={userData && userData.coverPhoto ? userData.coverPhoto : '/images/cover-default.png'}
          alt="Cover"
          className={styles.coverPhotoImage}
        />
        <div className={styles.profilePic}>
          {/* Display profile picture */}
          <img
            src={imageUrl ? imageUrl : '/images/default-profile.jpg'}
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

        <div className={styles.uploadSection}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload} className={styles.uploadButton}>Upload Profile Picture</button>
          {uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
