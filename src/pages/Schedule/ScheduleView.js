import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import './ScheduleView.css';

const ScheduleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFrom, selectedTo, departDate, returnDate } = location.state || {};

  const [selectedDepartureTrip, setSelectedDepartureTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);

  const trips = [
    { time: '4:00 AM', price: 349.00 },
    { time: '9:00 AM', price: 349.00 },
    { time: '11:00 AM', price: 349.00 },
    { time: '4:00 PM', price: 349.00 },
    { time: '6:00 PM', price: 349.00 },
  ];

  const dates = ['06', '07', '08', '09', '10', '11'];

  const handleTripSelection = (trip, isReturn) => {
    if (isReturn) {
      setSelectedReturnTrip(trip);
    } else {
      setSelectedDepartureTrip(trip);
    }
  };

  const handleContinue = () => {
    // Handle the continue action
    console.log('Continuing with selected trips');
  };

  const handleBack = () => {
    navigate(-1);
  };
  const dateDepart = departDate;
  const formattedDateDepart = format(parseISO(dateDepart), 'MMMM d, yyyy');
  //console.log(formattedDateDepart);

  const dateReturn = returnDate;
  const formattedDateReturn = format(parseISO(dateReturn), 'MMMM d, yyyy');
  //console.log(formattedDateReturn);

  return (
    <div className="schedule-view">
      <header className="header">
        <div className="format">
          <span>{selectedFrom}</span>
          <span className="arrow">↔</span>
          <span>{selectedTo}</span>
        </div>
        <div className="passengers">
            <div className="format">1</div>
            <div>Passenger/s</div>
        </div>

        <div className="dateDepart">
            <div className="format">{formattedDateDepart}</div>
            <div>Departure</div>
        </div>
        <div className="dateReturn">
            <div className="format">{formattedDateReturn}</div>
            <div>Return</div>
        </div>

      </header>

      <main className="main-content">
        <div className="tabs">
          <div className="tab active">Schedules</div>
          <div className="tab">Passenger Details</div>
          <div className="tab">Payment</div>
          <div className="tab">Complete</div>
        </div>

        <section className="schedule-section">
          <h2>{selectedFrom} → {selectedTo}</h2>
          <div className="date-selector">
            {dates.map(date => (
              <div key={date} className={`date ${date === '08' ? 'active' : ''}`}>{date}</div>
            ))}
          </div>
          <div className="trips">
            {trips.map((trip, index) => (
              <div key={index} className="trip-card">
                <div className="time">{trip.time}</div>
                <div className="price">₱{trip.price.toFixed(2)}</div>
                <button onClick={() => handleTripSelection(trip, false)}>Select</button>
              </div>
            ))}
          </div>
        </section>

        <section className="schedule-section">
          <h2>{selectedTo} → {selectedFrom}</h2>
          <div className="date-selector">
            {dates.map(date => (
              <div key={date} className={`date ${date === '08' ? 'active' : ''}`}>{date}</div>
            ))}
          </div>
          <div className="trips">
            {trips.map((trip, index) => (
              <div key={index} className="trip-card">
                <div className="time">{trip.time}</div>
                <div className="price">₱{trip.price.toFixed(2)}</div>
                <button onClick={() => handleTripSelection(trip, true)}>Select</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="summary">
        <h3>Summary</h3>
        <div className="summary-section">
          <h4>Departure</h4>
          {selectedDepartureTrip && (
            <>
              <div>{selectedFrom} → {selectedTo}</div>
              <div>{departDate} | {selectedDepartureTrip.time}</div>
              <div>₱{selectedDepartureTrip.price.toFixed(2)}</div>
            </>
          )}
        </div>
        <div className="summary-section">
          <h4>Return</h4>
          {selectedReturnTrip && (
            <>
              <div>{selectedTo} → {selectedFrom}</div>
              <div>{returnDate} | {selectedReturnTrip.time}</div>
              <div>₱{selectedReturnTrip.price.toFixed(2)}</div>
            </>
          )}
        </div>
        <div className="total">
          <span>Total</span>
          <span>₱{((selectedDepartureTrip?.price || 0) + (selectedReturnTrip?.price || 0)).toFixed(2)}</span>
        </div>
        <button className="continue-btn" onClick={handleContinue}>Continue</button>
      </aside>

      <footer className="footer">
        <button className="back-btn" onClick={handleBack}>Back</button>
        <div>
          <a href="#">About</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default ScheduleView;