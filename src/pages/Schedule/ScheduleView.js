import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { format, parseISO, addDays, subDays } from 'date-fns';
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

        // Reference to the adminData collection
        const adminDataRef = collection(db, 'adminData');
        const adminDataSnapshot = await getDocs(adminDataRef);

        let matchedTrips = { departure: [], return: [] };

        // Loop through each admin data to access the necessary details
        for (const adminDoc of adminDataSnapshot.docs) {
          const uid = adminDoc.id; // Get UID for the admin data

          // Access the `times` field from admin data
          const adminData = adminDoc.data();
          const { times, companyName } = adminData;

          // Loop through each time in the `times` array
          for (const index in times) {
            const tripDetails = times[index]; // Get the trip details from the times array

            // Access the travel information and prices (business and economy)
            const { details, businessPrice, economyPrice } = tripDetails;

            // Split and trim the details for first and second word, and ensure no extra spaces
            const [firstWord, secondWord] = details.split('-').map((word) => word.trim());

            // Log first and second words
            console.log(`First word: "${firstWord}", Second word: "${secondWord}"`);
            console.log(`from: "${selectedFrom}", to: "${selectedTo}"`);

            // Match the first and second word with selectedFrom and selectedTo
            if (firstWord === selectedFrom.trim() && secondWord === selectedTo.trim()) {
              // Determine the price based on the class (business or economy)
              const price = businessPrice ? businessPrice : economyPrice; // Use business price if available, otherwise economy price

              // If matched, push the trip details into the matchedTrips array
              // if need makuha ang details sa selected from and to diri lang kuha sa details
              matchedTrips.departure.push({
                time: details.trim(), 
                details: details.trim(), 
                uid,
                index, 
                price, 
                companyName: companyName.trim(), 
              });

              console.log(`Matched trip found: UID: ${uid}, From: ${firstWord}, To: ${secondWord}, Time: ${details.trim()}, Price: ${price}, Company: ${companyName.trim()}`);
            }
          }
        }

        // Log the matched trips
        console.log('Matched Trips:', matchedTrips);

        // Update the state with the matched trips
        setTrips(matchedTrips);

      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    fetchTrips();
  }, [selectedFrom, selectedTo]);






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

  const handleTripSelection = (trip, isReturn) => {
    if (isReturn) {
      setSelectedReturnTrip(trip);
    } else {
      setSelectedDepartureTrip(trip);
    }
  };

  const handleContinue = () => {
    const totalPrice = (
      349 * passengers.total
    ).toFixed(2);

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
              <div
                key={index}
                className={`trip-card`}
              >
                <div className="time">{trip.time}</div>
                <div className="details">{trip.travelDetails}</div>
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
                  onClick={() => setCurrentReturnDate(date.toISOString())}
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
                  className={`trip-card ${selectedReturnTrip === trip ? 'selected' : ''}`}
                  onClick={() => handleTripSelection(trip, true)}
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