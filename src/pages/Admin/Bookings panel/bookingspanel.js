import React, { useState } from 'react';
import './bookingspanel.css';

const BookingsPanel = () => {
  const [selectedFerry, setSelectedFerry] = useState(null);

  const ferries = [
    {
      name: "MV 2GO Maligaya dsajkhd dsajkhdasfdsfsdafsdafdsaf",
      image: "/images/ferry.jpg",
      travelTime: "30 mins",
      capacity: 250,
      seatsAvailable: 2,
      ratings: 5,
      price: 2999.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/HomeBackground.png",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/HomeBackground.png",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    }

  ];

  const departures = [
    {
      name: "djksahdjkaslhdasjkdhlaslkhjk ghjkg",
      image: "/images/ferry.jpg",
      travelTime: "30 mins",
      capacity: 250,
      seatsAvailable: 2,
      ratings: 5,
      price: 2999.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/HomeBackground.png",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image: "/images/HomeBackground.png",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    }

  ];


  const handleViewDetails = (ferry) => {
    setSelectedFerry(ferry);
  };

  return (
    <div className="bookingspanel-container">
      <div className="logo-container">
        <img src='/images/select ferry.png' alt="Logo" className="logo" />
        <h2>Departures Today</h2>
      </div>

      <div className="ferry-grid">
        {ferries.map((ferry, index) => (
          <div key={index} className="ferry-card">
            <img src={ferry.image} alt={ferry.name} className="ferry-image" />
            <span className="ferry-name">{ferry.name || 'Unnamed Ferry'}</span>
            <button
              className="view-details-button"
              onClick={() => handleViewDetails(ferry)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>


      <div className="logo-container">
        <img src='/images/select ferry.png' alt="Logo" className="logo" />
        <h2>Upcoming Departures</h2>
      </div>

      <div className="ferry-grid">
        {departures.map((departure, index) => (
          <div key={index} className="ferry-card">
            <img src={departure.image} alt={departure.name} className="ferry-image" />
            <span className="ferry-name">{departure.name}</span>
            <button
              className="view-details-button"
              onClick={() => handleViewDetails(departure)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>


      {selectedFerry && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedFerry(null)} />
          <div className="ferry-details-modal">
            <div className="modal-header">
              <h3>Ferry Details</h3>
            </div>

            <div className="modal-content">
              <div className="detail-item">
                <span className="detail-label">Ferry Name</span>
                <span className="detail-value">{selectedFerry.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Travel Time</span>
                <span className="detail-value">{selectedFerry.travelTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Capacity</span>
                <span className="detail-value">{selectedFerry.capacity}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Seats Available</span>
                <span className="detail-value">{selectedFerry.seatsAvailable}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Price</span>
                <span className="detail-value">Php {selectedFerry.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-buttons">
              <button
                className="modal-close-button"
                onClick={() => setSelectedFerry(null)}
              >
                Close
              </button>
              <button
                className="modal-view-list-button"
                onClick={() => {/*View list funtcionnnnnnnnnnnnn*/ }}
              >
                View List
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingsPanel;
