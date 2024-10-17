import React, { useState } from 'react';
import './bookingspanel.css';

const BookingsPanel = () => {
  const [selectedFerry, setSelectedFerry] = useState(null);

  const ferries = [
    {
      name: "MV 2GO Maligaya",
      image: "/images/ferry.jpg",
      travelTime: "30 mins",
      capacity: 250,
      seatsAvailable: 2,
      ratings: 5,
      price: 2999.00
    },
    {
      name: "MV LITE Ferry 1",
      image:  "/images/HomeBackground.png",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image:  "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image:  "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image:  "/images/ferry.jpg",
      travelTime: "40 mins",
      capacity: 200,
      seatsAvailable: 20,
      ratings: 4,
      price: 1599.00
    },
    {
      name: "MV LITE Ferry 1",
      image:  "/images/HomeBackground.png",
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
        <h2>Select Ferry</h2>
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

      {selectedFerry && (
        <div className="ferry-details-modal">
          <h3>Ferry Details: {selectedFerry.name}</h3>
          <p>Travel Time: {selectedFerry.travelTime}</p>
          <p>Capacity: {selectedFerry.capacity}</p>
          <p>Seats Available: {selectedFerry.seatsAvailable}</p>
          <p>Price: Php {selectedFerry.price.toFixed(2)}</p>
          <button onClick={() => setSelectedFerry(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default BookingsPanel;
