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
  const [selectedDepartureTime, setSelectedDepartureTime] = useState(null);
const [selectedReturnTime, setSelectedReturnTime] = useState(null);


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        console.log('Fetching trip data from Firestore...');
        console.log('Selected From:', selectedFrom, 'Selected To:', selectedTo);

        const adminDataRef = collection(db, 'adminData');
        const adminDataSnapshot = await getDocs(adminDataRef);

        // Initialize both departure and return arrays
        let matchedTrips = { departure: [], return: [] };

        for (const adminDoc of adminDataSnapshot.docs) {
          const adminData = adminDoc.data();
          const { times, price, name: companyName } = adminData;

          // Iterate over `times` array to match departure and return trips
          times.forEach((timeEntry, index) => {
            const { from, to, time, travelTimeInMinutes, details } = timeEntry;

            // Match departure trips
            if (
              from.toLowerCase().trim() === selectedFrom.toLowerCase().trim() &&
              to.toLowerCase().trim() === selectedTo.toLowerCase().trim()
            ) {
              matchedTrips.departure.push({
                ddetails: details,
                dtime: time,
                travelTimeInMinutes,
                businessPrice: price.business,
                economyPrice: price.economy,
                companyName,
                index,
              });
            }

            // Match return trips
            if (
              from.toLowerCase().trim() === selectedTo.toLowerCase().trim() &&
              to.toLowerCase().trim() === selectedFrom.toLowerCase().trim()
            ) {
              matchedTrips.return.push({
                details: details,
                time: time,
                travelTimeInMinutes,
                businessPrice: price.business,
                economyPrice: price.economy,
                companyName,
                index,
              });
            }
          });
        }

        console.log('Matched Trips:', matchedTrips);
        setTrips(matchedTrips);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    // Only fetch if both locations are selected
    if (selectedFrom && selectedTo) {
      fetchTrips();
    }
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
    const selectedTripWithPriceType = { 
      ...trip, 
      priceType,
      time: isReturn ? trip.time : trip.dtime  // Normalize the time property
    };
    const selectedTime = isReturn ? trip.time : trip.dtime;
  
    if (isReturn) {
      setSelectedReturnTrip(selectedTripWithPriceType);
      setSelectedReturnTime(selectedTime);
    } else {
      setSelectedDepartureTrip(selectedTripWithPriceType);
      setSelectedDepartureTime(selectedTime);
    }
  };
  const handleContinue = () => {
    const departurePrice = selectedDepartureTrip?.priceType === 'business' 
      ? selectedDepartureTrip?.businessPrice 
      : selectedDepartureTrip?.economyPrice;
  
    const returnPrice = selectedReturnTrip?.priceType === 'business'
      ? selectedReturnTrip?.businessPrice
      : selectedReturnTrip?.economyPrice;
  
    const totalPrice = (
      (selectedDepartureTrip
        ? Number(departurePrice || 0)
        : 0) +
      (selectedReturnTrip
        ? Number(returnPrice || 0)
        : 0)
    ) * (passengers?.total || 1);
  
    navigate('/PassengerDetails', {
      state: {
        tripType,
        selectedFrom,
        selectedTo,
        departDate: formattedSelectedDate,
        returnDate: formattedCurrentReturnDate,
        selectedDepartureTrip,
        selectedReturnTrip,
        selectedDepartureTime,
        selectedReturnTime,
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
          selectedDepartureTime,
          selectedReturnTime,
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
                        <div key={index} className={`trip-card`}>
                          <div className="time">{trip.dtime}</div>
                          <div className="details">{trip.ddetails}</div>
                          <div className="price">
                            ₱
                            {selectedDepartureTrip?.dtime === trip.dtime
                              ? selectedDepartureTrip.priceType === 'Business'
                                ? trip.businessPrice
                                : trip.economyPrice
                              : 'Select a class'}
                          </div>
                          <div className="radio-container">
                            <label>
                              <input
                                type="radio"
                                name={`departureClass_${trip.dtime}`} // Unique name per trip
                                value="Business"
                                checked={
                                  selectedDepartureTrip?.dtime === trip.dtime &&
                                  selectedDepartureTrip?.priceType === 'Business'
                                }
                                onChange={() => handleTripSelection(trip, false, 'Business')}
                              />
                              <span>Business</span>
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`departureClass_${trip.dtime}`} // Unique name per trip
                                value="Economy"
                                checked={
                                  selectedDepartureTrip?.dtime === trip.dtime &&
                                  selectedDepartureTrip?.priceType === 'Economy'
                                }
                                onChange={() => handleTripSelection(trip, false, 'Economy')}
                              />
                              <span>Economy</span>
                            </label>
                          </div>
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
                        <div key={index} className={`trip-card`}>
                          <div className="time">{trip.time}</div>
                          <div className="details">{trip.details}</div>
                          <div className="price">
                            ₱
                            {selectedReturnTrip?.time === trip.time
                              ? selectedReturnTrip.priceType === 'Business'
                                ? trip.businessPrice
                                : trip.economyPrice
                              : 'Select a class'}
                          </div>
                          <div className="radio-container">
                           

                  {/* Business Class */}
                  {trip.businessPrice && (
                    <label>
                      <input
                        type="radio"
                        name={`returnClass_${trip.time}`} // Unique name per trip
                        value="Business"
                        checked={
                          selectedReturnTrip?.time === trip.time &&
                          selectedReturnTrip?.priceType === 'Business'
                        }
                        onChange={() => handleTripSelection(trip, true, 'Business')}
                      />
                      <span>Business </span>
                    </label>

                  )}
                   {/* Economy Class */}
                   <label>
                              <input
                                type="radio"
                                name={`returnClass_${trip.time}`} // Unique name per trip
                                value="Economy"
                                checked={
                                  selectedReturnTrip?.time === trip.time &&
                                  selectedReturnTrip?.priceType === 'Economy'
                                }
                                onChange={() => handleTripSelection(trip, true, 'Economy')}
                              />
                              <span>Economy </span>
                            </label>
                </div>
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
    <div>
      {formattedSelectedDate} | {selectedDepartureTime}
    </div>
    <div>{selectedDepartureTrip.priceType.toUpperCase()} Class</div>
        <div>
          ₱{' '}
          {selectedDepartureTrip.priceType === 'Business'
            ? selectedDepartureTrip.businessPrice
            : selectedDepartureTrip.economyPrice}{' '}
          x {passengers.total}
        </div>
      </>
    )}
  </div>
  {tripType === 'round-trip' && selectedReturnTrip && (
  <div className="summary-section">
    <h4>Return</h4>
    <div>{selectedTo} → {selectedFrom}</div>
    <div>
      {formattedCurrentReturnDate} | {selectedReturnTime}
    </div>
    <div>{selectedReturnTrip.priceType.toUpperCase()} Class</div>
      <div>
        ₱{' '}
        {selectedReturnTrip.priceType === 'Business'
          ? selectedReturnTrip.businessPrice
          : selectedReturnTrip.economyPrice}{' '}
        x {passengers.total}
      </div>
    </div>
  )}

  <div className="total">
    <span>Total</span>
    <span>
      ₱
      {(
        (selectedDepartureTrip
          ? Number(
              selectedDepartureTrip.priceType === 'Business'
                ? selectedDepartureTrip.businessPrice
                : selectedDepartureTrip.economyPrice
            )
          : 0) +
        (selectedReturnTrip
          ? Number(
              selectedReturnTrip.priceType === 'Business'
                ? selectedReturnTrip.businessPrice
                : selectedReturnTrip.economyPrice
            )
          : 0)
      ) *
        (passengers?.total || 1)}
    </span>
  </div>

  <button
    className="continue-btn"
    onClick={handleContinue}
    disabled={!selectedDepartureTrip || (tripType === 'round-trip' && !selectedReturnTrip)}
  >
    Continue
  </button>
  <button className="back-btn" onClick={handleBack}>
    Back
  </button>
</aside>


      <footer className="footer">
        <div></div>
      </footer>
    </div>
  );
};

export default ScheduleView;