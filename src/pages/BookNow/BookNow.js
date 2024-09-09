// src/pages/BookNow.js
import React, { useState, useEffect } from 'react';
import './BookNow.css';

const backgrounds = [
  { image: '/images/HomeBackground.png', text: 'Bantayan Islands' },
  { image: '/images/Bohol.jpg', text: 'Bohol' },
  { image: '/images/Ilocos.jpg', text: 'Ilocos' }
];

const BookNow = () => {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [tripType, setTripType] = useState('round-trip');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="travel-booking">
      <main className="main-content">
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${backgrounds[currentBackground].image})`,
          }}
        />
        <div className="content-container">
          <h1 className="main-title">{backgrounds[currentBackground].text}</h1>
          <div className="booking-form">
            <div className="form-group">
              <label className="form-label">Trip Type</label>
              <select
                className="form-input"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
              >
                <option value="round-trip">Round-trip</option>
                <option value="one-way">One-way</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="from">From</label>
                <input
                  className="form-input"
                  id="from"
                  type="text"
                  placeholder="Bantayan Islands"
                  value="Bantayan Islands"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="to">To</label>
                <input
                  className="form-input"
                  id="to"
                  type="text"
                  placeholder="Select Destination"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="depart">Depart</label>
                <input
                  className="form-input"
                  id="depart"
                  type="date"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="return">Return</label>
                <input
                  className="form-input"
                  id="return"
                  type="date"
                  disabled={tripType === 'one-way'}
                />
              </div>
            </div>

            <div className="passenger-types">
              {['Adults', 'Children', 'Student', 'PWD', 'Senior'].map((type) => (
                <div key={type} className="form-group">
                  <label className="form-label">{type}</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    defaultValue={type === 'Adults' ? 1 : 0}
                  />
                </div>
              ))}
            </div>

            <button className="search-button">Search Ferries</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookNow;
