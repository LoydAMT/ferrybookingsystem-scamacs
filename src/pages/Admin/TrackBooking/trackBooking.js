import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import './trackbooking.css';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUsersAndBookings = async () => {
      try {
        const db = getFirestore();
        
        // Fetch Bookings
        const bookingsCollection = collection(db, 'Bookings');
        const bookingsSnapshot = await getDocs(bookingsCollection);
        const bookingsList = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch Users
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        // Create a mapping of email to user info
        const userMapping = {};
        usersSnapshot.docs.forEach((userDoc) => {
          const userData = userDoc.data();
          userMapping[userData.email] = {
            firstName: userData.firstName,
            lastName: userData.lastName
          };
        });

        setUserInfo(userMapping);
        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersAndBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    console.log('Attempting to cancel booking with ID:', bookingId);
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (confirm) {
      try {
        const db = getFirestore();
        const bookingDoc = doc(db, 'Bookings', bookingId);
        await deleteDoc(bookingDoc);
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
        alert('Booking has been successfully canceled.');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to cancel the booking. Please try again.');
      }
    }
  };

  const handleMove = (booking) => {
    console.log('Move clicked for booking:', booking);
    alert('Move functionality is not implemented yet.');
  };

  const filteredDetails = bookings.filter((booking) =>
    Object.values(booking).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bookings-container">
      <div className="search-bars">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Reference Number</th>
            <th>Booked By</th>
            <th>Passenger Names</th>
            <th>Depart Date</th>
            <th>Trip Type</th>
            <th>Total Passengers</th>
            <th>Total Price</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDetails.map((booking) => {
            // Get booked by information
            const bookedByUser = userInfo[booking.Email] || {};
            const bookedByName = bookedByUser.firstName && bookedByUser.lastName
              ? `${bookedByUser.firstName} ${bookedByUser.lastName}`
              : 'Unknown';

            return (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{bookedByName}</td>
                <td>
                  {Object.keys(booking)
                    .filter((key) => key.startsWith('FirstName'))
                    .map(
                      (key) =>
                        `${booking[key]} ${
                          booking[`LastName${key.slice(9)}`] || ''
                        }`
                    )
                    .join(', ')}
                </td>
                <td>{booking.DepartDate}</td>
                <td>{booking.TripType}</td>
                <td>{booking.TotalPassengers}</td>
                <td>₱{booking.TotalPrice}</td>
                <td>{booking.Email}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button cancel-button"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="action-button move-button"
                      onClick={() => handleMove(booking)}
                    >
                      Move
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;