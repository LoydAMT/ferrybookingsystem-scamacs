import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import './trackbooking.css';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        const bookingsCollection = collection(db, 'Bookings');
        const bookingsSnapshot = await getDocs(bookingsCollection);
        const bookingsList = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id, // Capture the document ID
          ...doc.data(),
        }));
        console.log('Fetched bookings:', bookingsList); // Debugging log
        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    console.log('Attempting to cancel booking with ID:', bookingId); // Debugging log
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (confirm) {
      try {
        const db = getFirestore();
        const bookingDoc = doc(db, 'Bookings', bookingId); // Use booking ID to get the document
        await deleteDoc(bookingDoc); // Delete the booking document from Firestore
        setBookings(bookings.filter((booking) => booking.id !== bookingId)); // Update state to reflect the cancellation
        alert('Booking has been successfully canceled.');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to cancel the booking. Please try again.');
      }
    }
  };

  const handleMove = (booking) => {
    console.log('Move clicked for booking:', booking); // Debugging log
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
          {filteredDetails.map((booking) => (
            <tr key={booking.id}>
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
                    onClick={() => handleCancel(booking.id)} // Pass document ID to handleCancel
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
