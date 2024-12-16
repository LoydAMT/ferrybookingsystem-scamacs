import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './trackbooking.css'; // Import the external CSS file

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const db = getFirestore();
        const bookingsCollection = collection(db, 'Bookings');
        const bookingsSnapshot = await getDocs(bookingsCollection);
        const bookingsList = bookingsSnapshot.docs.map(doc => doc.data());
        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

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
           
          </tr>
        </thead>
        <tbody>
        {filteredDetails.map((booking, index) => (
            <tr key={index}>
               <td>
                {Object.keys(booking)
                  .filter(key => key.startsWith('FirstName'))
                  .map(
                    key =>
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
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
