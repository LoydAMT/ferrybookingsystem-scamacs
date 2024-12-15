import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { addMinutes, parse } from 'date-fns';
import './ScheduleView.css';

const ScheduleView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const db = getFirestore();
  const { selectedFrom, selectedTo, departDate, returnDate, passengers, tripType } = location.state || {};

  const [selectedDepartureTrip, setSelectedDepartureTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);
  const [selectedDate, setSelectedDate] = useState(departDate);
  const [currentReturnDate, setCurrentReturnDate] = useState(returnDate);
  const [startDate, setStartDate] = useState(parseISO(departDate));
  const [startReturnDate, setStartReturnDate] = useState(returnDate ? parseISO(returnDate) : null);
  const [trips, setTrips] = useState({ departure: [], return: [] });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        console.log('Fetching trip data from Firestore...');
        console.log('Selected From:', selectedFrom, 'Selected To:', selectedTo);

        const adminDataRef = collection(db, 'adminData');
        const adminDataSnapshot = await getDocs(adminDataRef);

        let matchedTrips = { departure: [], return: [] };

        for (const adminDoc of adminDataSnapshot.docs) {
          const adminData = adminDoc.data();
          const { times, price, from, to, name: companyName } = adminData;

          // Validate if the route matches
          if (from.trim() === selectedFrom.trim() && to.trim() === selectedTo.trim()) {
            // Process each time entry
            times.forEach((timeEntry, index) => {
              const departureDetails = timeEntry.details;
              const departureTime = timeEntry.time;
              const travelTimeInMinutes = timeEntry.travelTimeInMinutes;

              matchedTrips.departure.push({
                details: departureDetails,
                time: departureTime,
                travelTimeInMinutes,
                businessPrice: price.business,
                economyPrice: price.economy,
                companyName,
                index
              });
            });
          }

          // Check for return trips (opposite direction)
          if (from.trim() === selectedTo.trim() && to.trim() === selectedFrom.trim()) {
            times.forEach((timeEntry, index) => {
              const returnDetails = timeEntry.details;
              const returnTime = timeEntry.time;
              const travelTimeInMinutes = timeEntry.travelTimeInMinutes;

              matchedTrips.return.push({
                details: returnDetails,
                time: returnTime,
                travelTimeInMinutes,
                businessPrice: price.business,
                economyPrice: price.economy,
                companyName,
                index
              });
            });
          }
        }

        console.log('Matched Trips:', matchedTrips);
        setTrips(matchedTrips);

      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    fetchTrips();
  }, [selectedFrom, selectedTo, db]);

  const generateDates = (start) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(start, i));
    }
    return dates;
  };

  const handleDepartureDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleNextDateRange = () => {
    setStartDate(addDays(startDate, 7));
  };

  const handlePreviousDateRange = () => {
    setStartDate(subDays(startDate, 7));
  };

  const handleNextReturnDateRange = () => {
    setStartReturnDate(addDays(startReturnDate, 7));
  };

  const handlePreviousReturnDateRange = () => {
    setStartReturnDate(subDays(startReturnDate, 7));
  };

  const handleTripSelection = (trip, isReturn, priceType) => {
    const selectedTripWithPriceType = { ...trip, priceType };
    if (isReturn) {
      setSelectedReturnTrip(selectedTripWithPriceType);
    } else {
      setSelectedDepartureTrip(selectedTripWithPriceType);
    }
  };
  const handleContinue = () => {
    console.log('Departure Trip:', selectedDepartureTrip);
    console.log('Return Trip:', selectedReturnTrip);
  
    const departurePrice = selectedDepartureTrip?.priceType === 'business' 
      ? selectedDepartureTrip?.businessPrice 
      : selectedDepartureTrip?.economyPrice;
    
    const returnPrice = selectedReturnTrip?.priceType === 'business'
      ? selectedReturnTrip?.businessPrice
      : selectedReturnTrip?.economyPrice;
  
    console.log('Departure Price:', departurePrice);
    console.log('Return Price:', returnPrice);
  
    const totalPrice = ((departurePrice || 0) + (returnPrice || 0)) * passengers.total /10;
  
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
        totalPrice: totalPrice.toFixed(2),
      }
    });
  };

  const handleBack = () => {
    navigate(-1, {
      state: {
        previousInputs: {
          tripType,
          selectedFrom,
          selectedTo,
          departDate,
          returnDate,
          adults: passengers.adults,
          children: passengers.children,
          students: passengers.students,
          pwd: passengers.pwd,
          seniors: passengers.seniors,
        }
      }
    });
  };

  const formattedSelectedDate = format(parseISO(selectedDate), 'MMMM d, yyyy');
  const formattedCurrentReturnDate = currentReturnDate ? format(parseISO(currentReturnDate), 'MMMM d, yyyy') : null;
  const dynamicDepartureDates = generateDates(startDate);
  const dynamicReturnDates = startReturnDate ? generateDates(startReturnDate) : [];

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
          <div className="format">{formattedSelectedDate}</div>
          <div>Departure</div>
        </div>
        {tripType === 'round-trip' && (
          <div className="dateReturn">
            <div className="format">{formattedCurrentReturnDate}</div>
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
                {format(date, 'dd')}
              </div>
            ))}
            <button onClick={handleNextDateRange}>&gt;</button>
          </div>
          <div className="trips">
            {trips.departure.map((trip, index) => (
              <div key={index} className="trip-card-container">
                {/* Economy Trip Card */}
                <div className={`trip-card ${selectedDepartureTrip?.index === trip.index && selectedDepartureTrip?.priceType === 'economy' ? 'selected' : ''}`}>
                  <div className="time">{trip.time}</div>
                  <div className="details">{trip.details}</div>
                  <div className="details">Economy Class</div>
                  <div className="price">₱{trip.economyPrice}</div>
                  <div className="company">{trip.companyName}</div>
                  <button onClick={() => handleTripSelection(trip, false, 'economy')}>
                    Select Economy
                  </button>
                </div>

                {/* Business Trip Card */}
                {trip.businessPrice && (
                  <div className={`trip-card ${selectedDepartureTrip?.index === trip.index && selectedDepartureTrip?.priceType === 'business' ? 'selected' : ''}`}>
                    <div className="time">{trip.time}</div>
                    <div className="details">{trip.details}</div>
                    <div className="details">Business Class</div>
                    <div className="price">₱{trip.businessPrice}</div>
                    <div className="company">{trip.companyName}</div>
                    <button onClick={() => handleTripSelection(trip, false, 'business')}>
                      Select Business
                    </button>
                  </div>
                )}
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
                  onClick={() => setCurrentReturnDate(date.toISOString())}
                >
                  {format(date, 'dd')}
                </div>
              ))}
              <button onClick={handleNextReturnDateRange}>&gt;</button>
            </div>
            <div className="trips">
              {trips.return.map((trip, index) => (
                <div key={index} className="trip-card-container">
                  {/* Economy Trip Card */}
                  <div className={`trip-card ${selectedReturnTrip?.index === trip.index && selectedReturnTrip?.priceType === 'economy' ? 'selected' : ''}`}>
                    <div className="time">{trip.time}</div>
                    <div className="details">{trip.details}</div>
                    <div className="details">Economy Class</div>
                    <div className="price">₱{trip.economyPrice}</div>
                    <div className="company">{trip.companyName}</div>
                    <button onClick={() => handleTripSelection(trip, true, 'economy')}>
                      Select Economy
                    </button>
                  </div>

                  {/* Business Trip Card */}
                  {trip.businessPrice && (
                    <div className={`trip-card ${selectedReturnTrip?.index === trip.index && selectedReturnTrip?.priceType === 'business' ? 'selected' : ''}`}>
                      <div className="time">{trip.time}</div>
                      <div className="details">{trip.details}</div>
                      <div className="details">Business Class</div>
                      <div className="price">₱{trip.businessPrice}</div>
                      <div className="company">{trip.companyName}</div>
                      <button onClick={() => handleTripSelection(trip, true, 'business')}>
                        Select Business
                      </button>
                    </div>
                  )}
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
              <div>{selectedDepartureTrip.priceType.toUpperCase()} Class</div>
              <div>₱{
                selectedDepartureTrip.priceType === 'business' 
                  ? selectedDepartureTrip.businessPrice 
                  : selectedDepartureTrip.economyPrice
              } x {passengers.total}</div>
            </>
          )}
        </div>
        {tripType === 'round-trip' && selectedReturnTrip && (
          <div className="summary-section">
            <h4>Return</h4>
            <div>{selectedTo} → {selectedFrom}</div>
            <div>{formattedCurrentReturnDate} | {selectedReturnTrip.time}</div>
            <div>{selectedReturnTrip.priceType.toUpperCase()} Class</div>
            <div>₱{
              selectedReturnTrip.priceType === 'business'
                ? selectedReturnTrip.businessPrice
                : selectedReturnTrip.economyPrice
            } x {passengers.total}</div>
          </div>
        )}
        <div className="total">
          <span>Total</span>
          <span>
            ₱{(
              ((selectedDepartureTrip?.priceType === 'business' ? selectedDepartureTrip?.businessPrice : selectedDepartureTrip?.economyPrice) || 0) +
              ((selectedReturnTrip?.priceType === 'business' ? selectedReturnTrip?.businessPrice : selectedReturnTrip?.economyPrice) || 0)
            ) * passengers.total / 10}
          </span>
        </div>
        <button 
          className="continue-btn" 
          onClick={handleContinue}
          disabled={!selectedDepartureTrip || (tripType === 'round-trip' && !selectedReturnTrip)}
        >
          Continue
        </button>
        <button className="back-btn" onClick={handleBack}>Back</button>
      </aside>

      <footer className="footer">
        <div></div>
      </footer>
    </div>
  );
};

export default ScheduleView;