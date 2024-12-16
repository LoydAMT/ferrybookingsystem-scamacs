import React from 'react';
import './MyTicketsModal.css';
import './Photos/SWIFT_SAIL_9.png';

const MyTicketsModal = ({ ticket, onClose }) => {
  const passengers = [];

  if (ticket.FirstName1 && ticket.LastName1) {
    passengers.push({ FirstName: ticket.FirstName1, LastName: ticket.LastName1 });
  }

  // Add additional passengers (2, 3, etc.) dynamically
  if (ticket.FirstName2 && ticket.LastName2) {
    passengers.push({ FirstName: ticket.FirstName2, LastName: ticket.LastName2 });
  }

  if (ticket.FirstName3 && ticket.LastName3) {
    passengers.push({ FirstName: ticket.FirstName3, LastName: ticket.LastName3 });
  }

  if (ticket.FirstName4 && ticket.LastName4) {
    passengers.push({ FirstName: ticket.FirstName4, LastName: ticket.LastName4 });
  }

  if (ticket.FirstName5 && ticket.LastName5) {
    passengers.push({ FirstName: ticket.FirstName5, LastName: ticket.LastName5 });
  }
  // Continue adding as many passengers as needed...


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>

        <div className="TopPart">
        <img src="/images/SWIFT_SAIL_9.png" alt="Logo" className="Logo" />
        <h3>Itinerary Receipt</h3>
        </div>
        <hr />
        <div className="CenterPart">
          <div className="CenterLeftPart">
          <h3>Booking Details</h3>
          <p>Status: Confirmed</p>
          <p>Booking Date: </p>
          <p>{ticket.TimeBought || 'N/A'}</p>
          <p>Email: {ticket.Email || 'N/A'} </p>
          </div>

          <div className="CenterRightPart">
          <h3>BOOKING REFERENCE NUMBER:</h3>
          <p><strong>{ticket.id}</strong></p>
          </div>
        </div>

        <hr />

        <div className="CenterBottomPart">
          <h3>Guest Details</h3>
          {/* Loop through passengers and display each one */}
          {passengers.length > 0 && passengers.map((passenger, index) => (
            <div key={index}>
              <p><strong>Passenger {index + 1}:</strong> {`${passenger.FirstName} ${passenger.LastName}`}</p>
            </div>
          ))}
        </div>

        {/* Show Departure Date */}
        <h3>
          <p><strong>Departure Date:</strong> {ticket.DepartDate || 'N/A'}</p>
          <p><strong>Destination:</strong> {ticket.SelectedRet || 'N/A'}</p>
        </h3>
        <hr />

      </div>
    </div>
  );
};

export default MyTicketsModal;
