import React, { useState, useEffect } from 'react';
import MyTicketsModal from './MyTicketsModal';
import './MyTicketsModal.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './Profile.module.css'; 

const Profile = () => {
  // States for user data
  const [tickets, setTickets] = useState([]); // Store fetched tickets
  const [bookingHistory, setBookingHistory] = useState([]); // Store past bookings
  const [selectedTicket, setSelectedTicket] = useState(null); // Store the selected ticket for the modal
  const [ticketModalVisible, setTicketModalVisible] = useState(false); // State for ticket modal visibility
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('myTickets');
  const [ticketContent, setTicketContent] = useState('Ticket information displayed here');
  const [profilePic, setProfilePic] = useState(null); // State for profile picture file
  const [imageUrl, setImageUrl] = useState(''); // State for uploaded image URL
  const [uploadStatus, setUploadStatus] = useState(''); // State for upload status message
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [loadingModalVisible, setLoadingModalVisible] = useState(false); // State for loading modal

  useEffect(() => {
    const loadTickets = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      // If no user is currently authenticated, wait a moment
      if (!user) {
        // Add a short delay to ensure authentication is complete
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            try {
              const db = getFirestore();
              const userEmail = currentUser.email;

              const bookingsRef = collection(db, 'Bookings');
              const querySnapshot = await getDocs(bookingsRef);

              // Filter tickets: exclude past DepartDates
              const userTickets = querySnapshot.docs
                .filter((doc) => doc.data().Email === userEmail)
                .filter((doc) => {
                  const departDate = new Date(doc.data().DepartDate);
                  return departDate >= new Date(); // Only future tickets
                })
                .map((doc) => ({ id: doc.id, ...doc.data() }));

              setTickets(userTickets);
            } catch (error) {
              console.error('Error fetching tickets:', error);
              setTickets([]);
            }
          }
          // Unsubscribe to prevent memory leaks
          unsubscribe();
        });
      } else {
        // If user is already authenticated
        try {
          const db = getFirestore();
          const userEmail = user.email;

          const bookingsRef = collection(db, 'Bookings');
          const querySnapshot = await getDocs(bookingsRef);

          // Filter tickets: exclude past DepartDates
          const userTickets = querySnapshot.docs
            .filter((doc) => doc.data().Email === userEmail)
            .filter((doc) => {
              const departDate = new Date(doc.data().DepartDate);
              return departDate >= new Date(); // Only future tickets
            })
            .map((doc) => ({ id: doc.id, ...doc.data() }));

          setTickets(userTickets);
        } catch (error) {
          console.error('Error fetching tickets:', error);
          setTickets([]);
        }
      }
    };

    loadTickets();
  }, []); // Empty dependency array

  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    if (tab === 'myTickets') {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
          const userEmail = user.email;

          // Fetch all documents in the 'Bookings' collection
          const bookingsRef = collection(db, 'Bookings');
          const querySnapshot = await getDocs(bookingsRef);

          // Filter tickets: exclude past DepartDates
          const userTickets = querySnapshot.docs
            .filter((doc) => doc.data().Email === userEmail)
            .filter((doc) => {
              const departDate = new Date(doc.data().DepartDate);
              return departDate >= new Date(); // Only future tickets
            })
            .map((doc) => ({ id: doc.id, ...doc.data() }));

          setTickets(userTickets);
        } else {
          console.log('User not authenticated.');
          setTickets([]);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
      }
    } else if (tab === 'bookingHistory') {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
          const userEmail = user.email;

          // Fetch all documents in the 'Bookings' collection
          const bookingsRef = collection(db, 'Bookings');
          const querySnapshot = await getDocs(bookingsRef);

          // Get current date
          const currentDate = new Date();

          // Filter booking history: past departure dates and matching email
          const pastBookings = querySnapshot.docs
            .filter((doc) => {
              const bookingData = doc.data();
              // Check if email matches and departure date is in the past
              if (bookingData.Email === userEmail && bookingData.DepartDate) {
                // Parse the date format "12/17/2024, 4:50:49 AM"
                const departDate = new Date(bookingData.DepartDate);
                return departDate < currentDate;
              }
              return false;
            })
            .map((doc) => ({ id: doc.id, ...doc.data() }));

          setBookingHistory(pastBookings);
        } else {
          console.log('User not authenticated.');
          setBookingHistory([]);
        }
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setBookingHistory([]);
      }
    }
  };

  // Handle opening the modal with ticket details
  const viewTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setTicketModalVisible(true);
  };

  // Close the modal
  const closeTicketModal = () => {
    setSelectedTicket(null);
    setTicketModalVisible(false);
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
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setUploadStatus(''); 

      // Upload the file immediately after selection
      await handleUpload(file);
    }
  };

  // Handle upload functionality
  const handleUpload = async (file) => {
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `profile_pics/${file.name}`);

    try {
      setLoadingModalVisible(true); // Show loading modal

      // Upload the file
      await uploadBytes(storageRef, file);
      // Get the download URL
      const url = await getDownloadURL(storageRef);
      setImageUrl(url); // Update imageUrl with the new URL
      setUploadStatus();
      setModalVisible(true); // Show the success modal

      // Update Firestore with the new profile picture URL
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(getFirestore(), "users", user.uid), { profilePic: url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setLoadingModalVisible(false); // Hide loading modal after the process
    }
  };

  const closeModal = () => {
    setModalVisible(false); // Close the success modal
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
        <div className={styles.profilePic} onClick={() => document.getElementById('fileInput').click()}>
          {/* Display profile picture */}
          <img
            src={imageUrl ? imageUrl : '/images/default-profile.jpg'}
            alt="Profile"
            className={styles.profilePicture}
          />
          {/* Hidden file input */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the file input
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
          </div>
          <div className={styles.TicketDisplay}>
            {activeTab === 'myTickets' && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket.id} className={styles.TicketCards}>
                  <div className={styles.TicketWhole}>
                    <div className={styles.TicketLeftSide}>
                      <p><strong>Booking ID:</strong> {ticket.id}</p>
                      <p><strong>Booker Name:</strong> {`${ticket.FirstName1} ${ticket.LastName1}` || 'N/A'}</p>
                      <p><strong>Date:</strong> {ticket.DepartDate || 'N/A'}</p>
                    </div>

                    <div className={styles.TicketRightSide}>
                      <button
                        className={styles.ViewTicketButton}
                        onClick={() => viewTicketDetails(ticket)}
                      >
                        View Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : activeTab === 'myTickets' ? (
              <p>No tickets found.</p>
            ) : activeTab === 'bookingHistory' && bookingHistory.length > 0 ? (
              bookingHistory.map((booking) => (
                <div key={booking.id} className={styles.TicketCards}>
                  <div className={styles.TicketWhole}>
                    <div className={styles.TicketLeftSide}>
                      <p><strong>Booking ID:</strong> {booking.id}</p>
                      <p><strong>Booker Name:</strong> {`${booking.FirstName1} ${booking.LastName1}` || 'N/A'}</p>
                      <p><strong>Departure Date:</strong> {booking.DepartDate || 'N/A'}</p>
                    </div>
                    <div className={styles.TicketRightSide}>
                      <button
                        className={styles.ViewTicketButton}
                        onClick={() => viewTicketDetails(booking)}
                      >
                        View Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : activeTab === 'bookingHistory' ? (
              <p>No past bookings found.</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modal for ticket details */}
      {ticketModalVisible && selectedTicket && (
        <MyTicketsModal
          ticket={selectedTicket}
          onClose={closeTicketModal}
        />
      )}
    </div>
  );
};

export default Profile;
