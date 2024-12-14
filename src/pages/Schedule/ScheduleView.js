import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns'; // Remove unused imports
import { fetchTrips } from '../../helpers/firebaseHelpers';
import './ScheduleView.css';

const ScheduleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFrom, selectedTo, departDate, returnDate, passengers, tripType } = location.state || {};

  const [selectedDepartureTrip, setSelectedDepartureTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);
  const [departureTrips, setDepartureTrips] = useState([]);
  const [returnTrips, setReturnTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Fetch departure trips dynamically
  useEffect(() => {
    const loadTrips = async () => {
      setLoadingTrips(true);
      try {
        const trips = await fetchTrips(selectedFrom, selectedTo, departDate);
        setDepartureTrips(trips);
      } catch (error) {
        console.error('Failed to load departure trips:', error);
      } finally {
        setLoadingTrips(false);
      }
    };
    loadTrips();
  }, [selectedFrom, selectedTo, departDate]);

  // Fetch return trips dynamically if round-trip
  useEffect(() => {
    if (tripType === 'round-trip' && returnDate) {
      const loadTrips = async () => {
        setLoadingTrips(true);
        try {
          const trips = await fetchTrips(selectedTo, selectedFrom, returnDate);
          setReturnTrips(trips);
        } catch (error) {
          console.error('Failed to load return trips:', error);
        } finally {
          setLoadingTrips(false);
        }
      };
      loadTrips();
    }
  }, [selectedTo, selectedFrom, returnDate, tripType]);

  const formattedSelectedDate = departDate ? format(parseISO(departDate), 'MMMM d, yyyy') : null;
  const formattedCurrentReturnDate = returnDate ? format(parseISO(returnDate), 'MMMM d, yyyy') : null;

  const calculateTotalPrice = () => {
    const departureCost = selectedDepartureTrip?.price || 0;
    const returnCost = selectedReturnTrip?.price || 0;
    return (departureCost + returnCost) * passengers.total;
  };

  const handleContinue = () => {
    const totalPrice = calculateTotalPrice();

    navigate('/PassengerDetails', {
      state: {
        tripType,
        selectedFrom,
        selectedTo,
        departDate: formattedSelectedDate,
        returnDate: formattedCurrentReturnDate,
        selectedDepartureTrip,
        selectedReturnTrip,
        passengers,
        totalPrice,
      },
    });
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleTripSelection = (trip, isReturn) => {
    if (isReturn) {
      setSelectedReturnTrip(trip);
    } else {
      setSelectedDepartureTrip(trip);
    }
  };

  return (
    <div className="schedule-view">
      {/* Header */}
      <header className="header">
        {/* Similar header as before */}
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Departure Schedule */}
        <section className="schedule-section">
          <h2>{selectedFrom} → {selectedTo}</h2>
          {loadingTrips ? (
            <p>Loading departure trips...</p>
          ) : departureTrips.length > 0 ? (
            <div className="trips">
              {departureTrips.map((trip) => (
                <div
                  key={trip.id}
                  className={`trip-card ${selectedDepartureTrip === trip ? 'selected' : ''}`}
                  onClick={() => handleTripSelection(trip, false)}
                >
                  <div className="time">{trip.time}</div>
                  <div className="price">₱{trip.price.toFixed(2)}</div>
                  <button>Select</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No trips available for the selected date.</p>
          )}
        </section>

        {/* Return Schedule (if round-trip) */}
        {tripType === 'round-trip' && (
          <section className="schedule-section">
            <h2>{selectedTo} → {selectedFrom}</h2>
            {loadingTrips ? (
              <p>Loading return trips...</p>
            ) : returnTrips.length > 0 ? (
              <div className="trips">
                {returnTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className={`trip-card ${selectedReturnTrip === trip ? 'selected' : ''}`}
                    onClick={() => handleTripSelection(trip, true)}
                  >
                    <div className="time">{trip.time}</div>
                    <div className="price">₱{trip.price.toFixed(2)}</div>
                    <button>Select</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No trips available for the selected date.</p>
            )}
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
              <div>₱{selectedDepartureTrip.price.toFixed(2)} x {passengers.total}</div> 
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
