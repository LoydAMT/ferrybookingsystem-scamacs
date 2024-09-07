// src/pages/Companies.js
import React from 'react';
import './Companies.css';

const Companies = () => {
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
    }
  ];


  const renderStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <div className="ferry-selection">
      <div className="logo-container">
        <img src='/images/select ferry.png' alt="Logo" className="logo" />
        <h2>Select Ferry</h2>
      </div>
      {ferries.map((ferry, index) => (
        <div key={index} className="ferry-card">
          <img src={ferry.image} alt={ferry.name} className="ferry-image" />
          <div className="ferry-details">
            <h3>{ferry.name}</h3>
            <p>Travel Time: {ferry.travelTime}</p>
            <p>Capacity: {ferry.capacity} Passengers</p>
            <p>Seats Available: {ferry.seatsAvailable}</p>
            <p className="ratings">Ratings: {renderStars(ferry.ratings)}</p>
            <p className="price">Price: Php {ferry.price.toFixed(2)}</p>
            <button className="select-button">Select Ferry</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Companies;
