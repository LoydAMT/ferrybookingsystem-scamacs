import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays, subDays } from 'date-fns';
import './ScheduleView.css';

const ScheduleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFrom, selectedTo, departDate, returnDate, passengers, tripType } = location.state || {};

  const [selectedDepartureTrip, setSelectedDepartureTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);
  const [selectedDate, setSelectedDate] = useState(departDate); // Track the selected departure date
  const [currentReturnDate, setCurrentReturnDate] = useState(returnDate); // Track the selected return date
  const [startDate, setStartDate] = useState(parseISO(departDate)); // Track the start date for departure range
  const [startReturnDate, setStartReturnDate] = useState(parseISO(returnDate)); // Track the start date for return range

  const trips = [
    { time: '4:00 AM', price: 349.00 },
    { time: '9:00 AM', price: 349.00 },
    { time: '11:00 AM', price: 349.00 },
    { time: '4:00 PM', price: 349.00 },
    { time: '6:00 PM', price: 349.00 },
  ];

  const generateDates = (start) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(start, i));
    }
    return dates;
  };

  const handleDepartureDateChange = (date) => {
    setSelectedDate(date); // Set the selected departure date
  };

  const handleNextDateRange = () => {
    setStartDate(addDays(startDate, 7)); // Move the start date for departure forward by 7 days
  };

  const handlePreviousDateRange = () => {
    setStartDate(subDays(startDate, 7)); // Move the start date for departure backward by 7 days
  };

  const handleNextReturnDateRange = () => {
    setStartReturnDate(addDays(startReturnDate, 7)); // Move the start date for return forward by 7 days
  };

  const handlePreviousReturnDateRange = () => {
    setStartReturnDate(subDays(startReturnDate, 7)); // Move the start date for return backward by 7 days
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
  const formattedCurrentReturnDate = currentReturnDate ? format(parseISO(currentReturnDate), 'MMMM d, yyyy') : null;
  const dynamicDepartureDates = generateDates(startDate);
  const dynamicReturnDates = generateDates(startReturnDate);

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
        {tripType === 'round-trip' && (
          <div className="dateReturn">
            <div className="format">{formattedCurrentReturnDate}</div> {/* Show selected return date */}
            <div>Return</div>
          </div>
        )}
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
            <button onClick={handlePreviousDateRange}>&lt;</button>
            {dynamicDepartureDates.map((date, index) => (
              <div
                key={index}
                className={`date ${format(date, 'yyyy-MM-dd') === format(parseISO(selectedDate), 'yyyy-MM-dd') ? 'active' : ''}`}
                onClick={() => handleDepartureDateChange(date.toISOString())}
              >
                {format(date, 'dd')} {/* Show day number */}
              </div>
            ))}
            <button onClick={handleNextDateRange}>&gt;</button>
          </div>
          <div className="trips">
            {trips.map((trip, index) => (
              <div
                key={index}
                className={`trip-card ${selectedDepartureTrip === trip ? 'selected' : ''}`} // Apply 'selected' class if trip is selected
                onClick={() => handleTripSelection(trip, false)} // Handle trip selection for departure
              >
                <div className="time">{trip.time}</div>
                <div className="price">₱{trip.price.toFixed(2)}</div>
                <button>Select</button>
              </div>
            ))}
          </div>
        </section>

        {tripType === 'round-trip' && (
          <section className="schedule-section">
            <h2>{selectedTo} → {selectedFrom}</h2>
            <div className="date-selector">
              <button onClick={handlePreviousReturnDateRange}>&lt;</button>
              {dynamicReturnDates.map((date, index) => (
                <div
                  key={index}
                  className={`date ${format(date, 'yyyy-MM-dd') === format(parseISO(currentReturnDate), 'yyyy-MM-dd') ? 'active' : ''}`}
                  onClick={() => setCurrentReturnDate(date.toISOString())} // Handle return date click
                >
                  {format(date, 'dd')}
                </div>
              ))}
              <button onClick={handleNextReturnDateRange}>&gt;</button>
            </div>
            <div className="trips">
              {trips.map((trip, index) => (
                <div
                  key={index}
                  className={`trip-card ${selectedReturnTrip === trip ? 'selected' : ''}`} // Apply 'selected' class if return trip is selected
                  onClick={() => handleTripSelection(trip, true)} // Handle return trip selection
                >
                  <div className="time">{trip.time}</div>
                  <div className="price">₱{trip.price.toFixed(2)}</div>
                  <button>Select</button>
                </div>
              ))}
            </div>
          </section>
        )}
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
        {tripType === 'round-trip' && selectedReturnTrip && (
          <div className="summary-section">
            <h4>Return</h4>
            <div>{selectedTo} → {selectedFrom}</div>
            <div>{formattedCurrentReturnDate} | {selectedReturnTrip.time}</div>
            <div>₱{selectedReturnTrip.price.toFixed(2)} x {passengers.total}</div>
          </div>
        )}
        <div className="total">
          <span>Total</span>
          <span>
            ₱{(
              ((selectedDepartureTrip?.price || 0) + (selectedReturnTrip?.price || 0)) * passengers.total
            ).toFixed(2)}
          </span>
        </div>
        <button className="continue-btn" onClick={handleContinue}>Continue</button>
        <button className="back-btn" onClick={handleBack}>Back</button>
      </aside>

      <footer className="footer">
        <div></div>
      </footer>
    </div>
  );
};

export default ScheduleView;
