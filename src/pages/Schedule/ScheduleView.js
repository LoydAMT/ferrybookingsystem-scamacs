import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays } from 'date-fns'; // Import addDays to adjust date
import './ScheduleView.css';

const ScheduleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFrom, selectedTo, departDate, returnDate, passengers } = location.state || {};

  const [selectedDepartureTrip, setSelectedDepartureTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);
  const [selectedDate, setSelectedDate] = useState(departDate); // Track the selected departure date
  const [currentReturnDate, setCurrentReturnDate] = useState(returnDate); // Track the selected return date

  const trips = [
    { time: '4:00 AM', price: 349.00 },
    { time: '9:00 AM', price: 349.00 },
    { time: '11:00 AM', price: 349.00 },
    { time: '4:00 PM', price: 349.00 },
    { time: '6:00 PM', price: 349.00 },
  ];

  // Dynamically generate the next 6 days based on the given date
  const generateDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 6; i++) {
      dates.push(addDays(parseISO(startDate), i));
    }
    return dates;
  };

  // Function to handle selecting a departure date
  const handleDepartureDateChange = (date) => {
    setSelectedDate(date); // Set the selected departure date
  };

  // Function to handle selecting a return date
  const handleReturnDateChange = (date) => {
    setCurrentReturnDate(date); // Set the selected return date
  };

  const handleTripSelection = (trip, isReturn) => {
    if (isReturn) {
      setSelectedReturnTrip(trip);
    } else {
      setSelectedDepartureTrip(trip);
    }
  };

  const handleContinue = () => {
    console.log('Continuing with selected trips');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formattedSelectedDate = format(parseISO(selectedDate), 'MMMM d, yyyy'); 
  const formattedCurrentReturnDate = format(parseISO(currentReturnDate), 'MMMM d, yyyy'); 
  const dynamicDepartureDates = generateDates(departDate); 
  const dynamicReturnDates = generateDates(returnDate); 

  return (
    <div className="schedule-view">
      <header className="header">
        <div className="format">
          <span>{selectedFrom}</span>
          <span className="arrow">↔</span>
          <span>{selectedTo}</span>
        </div>
        <div className="passengers">
          <div className="format">{passengers.total}</div>
          <div>Passenger/s</div>
        </div>
        <div className="dateDepart">
          <div className="format">{formattedSelectedDate}</div> {/* Show selected departure date */}
          <div>Departure</div>
        </div>
        <div className="dateReturn">
          <div className="format">{formattedCurrentReturnDate}</div> {/* Show selected return date */}
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
            {dynamicDepartureDates.map((date, index) => (
              <div
                key={index}
                className={`date ${format(date, 'yyyy-MM-dd') === format(parseISO(selectedDate), 'yyyy-MM-dd') ? 'active' : ''}`}
                onClick={() => handleDepartureDateChange(date.toISOString())} 
              >
                {format(date, 'dd')} {/* Show day number */}
              </div>
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
            {dynamicReturnDates.map((date, index) => (
              <div
                key={index}
                className={`date ${format(date, 'yyyy-MM-dd') === format(parseISO(currentReturnDate), 'yyyy-MM-dd') ? 'active' : ''}`}
                onClick={() => handleReturnDateChange(date.toISOString())} 
              >
                {format(date, 'dd')} {/* Show day number */}
              </div>
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
              <div>{formattedSelectedDate} | {selectedDepartureTrip.time}</div>
              <div>₱{selectedDepartureTrip.price.toFixed(2)} x {passengers.total}</div> {/* Price breakdown */}
            </>
          )}
        </div>
        <div className="summary-section">
          <h4>Return</h4>
          {selectedReturnTrip && (
            <>
              <div>{selectedTo} → {selectedFrom}</div>
              <div>{formattedCurrentReturnDate} | {selectedReturnTrip.time}</div>
              <div>₱{selectedReturnTrip.price.toFixed(2)} x {passengers.total}</div> {/* Price breakdown */}
            </>
          )}
        </div>
        <div className="total">
          <span>Total</span>
          <span>
            ₱{(
              ((selectedDepartureTrip?.price || 0) + (selectedReturnTrip?.price || 0)) * passengers.total
            ).toFixed(2)}
          </span>
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
