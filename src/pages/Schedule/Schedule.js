import React, { useState, useEffect } from 'react';  
import { db } from '../../firebase'; 
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import './Schedule.css';

const backgrounds = [
  { image: '/images/HomeBackground.png', text: 'Bantayan Islands' },
  { image: '/images/Bohol.jpg', text: 'Bohol' },
  { image: '/images/Ilocos.jpg', text: 'Ilocos' }
];

const Schedule = () => {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [tripType, setTripType] = useState('round-trip'); // One-way or round-trip
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [loadingFrom, setLoadingFrom] = useState(true);
  const [loadingTo, setLoadingTo] = useState(false);
  const [error, setError] = useState(null);  
  const [dateError, setDateError] = useState('');  
  const [searchCompleted, setSearchCompleted] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFromLocations = async () => {
      setLoadingFrom(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'Location'));
        const locations = querySnapshot.docs.map((doc) => doc.id);
        setFromLocations(locations);
        setLoadingFrom(false);
      } catch (err) {
        setError('Failed to load "From" locations.');
        setLoadingFrom(false);
      }
    };
    fetchFromLocations();
  }, []);

  useEffect(() => {
    const fetchToLocations = async () => {
      if (selectedFrom) {
        setLoadingTo(true);
        try {
          const docRef = doc(db, 'Location', selectedFrom);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const destinations = data.to || [];
            setToLocations(destinations);
          } else {
            setToLocations([]);
          }
          setLoadingTo(false);
        } catch (err) {
          setError('Failed to load "To" locations.');
          setLoadingTo(false);
        }
      }
    };

    fetchToLocations();
  }, [selectedFrom]);

  const handleFromChange = (e) => {
    setSelectedFrom(e.target.value);
    setSelectedTo('');
    setError(null);  
  };

  const handleToChange = (e) => {
    setSelectedTo(e.target.value);
    setError(null);  
  };

  const validateDates = () => {
    const departDate = document.getElementById('depart').value;
    const returnDate = document.getElementById('return').value;
    const today = new Date().toISOString().split('T')[0]; 
    if (!departDate || (tripType === 'round-trip' && !returnDate)) {
      setDateError('Please fill in the required dates.');
      return false;
    }

    if (departDate < today) {
      setDateError('Depart date cannot be in the past.');
      return false;
    }

    if (tripType === 'round-trip' && returnDate < departDate) {
      setDateError('Return date cannot be before the depart date.');
      return false;
    }

    setDateError(''); 
    return true;
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const students = parseInt(document.getElementById('students').value) || 0;
    const pwd = parseInt(document.getElementById('pwd').value) || 0;
    const seniors = parseInt(document.getElementById('seniors').value) || 0;
    const totalPassengers = adults + children + students + pwd + seniors;

    if (!selectedFrom || !selectedTo) {
      setError('Please select both "From" and "To" locations.');
      return;
    }

    if (!validateDates()) {
      return;
    }

    // Pass form data to ScheduleView
    setSearchCompleted(true);
    navigate('/scheduleview', {
      state: {
        selectedFrom,
        selectedTo,
        departDate: document.getElementById('depart').value,
        returnDate: tripType === 'round-trip' ? document.getElementById('return').value : null, // Only pass return date for round-trip
        passengers: {
          adults,
          children,
          students,
          pwd,
          seniors,
          total: totalPassengers
        },
        tripType // Pass the tripType to indicate if it's one-way or round-trip
      }
    });
  };

  return (
    <div 
      className="travel-booking" 
      style={{ 
        backgroundColor: searchCompleted ? 'lightblue' : 'initial',
        backgroundImage: searchCompleted ? 'none' : `url(${backgrounds[currentBackground].image})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh' 
      }}
    >
      <main className="main-content">
      {searchCompleted ? (
        <div>
          <p>Search Completed!</p>
        </div>
      ) : (
        <>
          <div className="content-container">
            <h1 className="main-title">{backgrounds[currentBackground].text}</h1>

            <form className="booking-form" onSubmit={handleSearch}>
              {error && <p className="error-message">{error}</p>}
              {dateError && <p className="error-message">{dateError}</p>}

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
                  <select
                    className="form-input"
                    id="from"
                    value={selectedFrom}
                    onChange={handleFromChange}
                    disabled={loadingFrom}
                  >
                    <option value="">Select Origin</option>
                    {fromLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="to">To</label>
                  <select
                    className="form-input"
                    id="to"
                    value={selectedTo}
                    onChange={handleToChange}
                    disabled={!selectedFrom || loadingTo}
                  >
                    <option value="">Select Destination</option>
                    {toLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
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
                    disabled={tripType === 'one-way'} // Disable return date input for one-way trip
                  />
                </div>
              </div>

              <div className="passenger-types">
                <div className="form-group">
                  <label className="form-label">Adults</label>
                  <input
                    className="form-input"
                    id="adults"
                    type="number"
                    min="1"
                    defaultValue={1}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Children</label>
                  <input
                    className="form-input"
                    id="children"
                    type="number"
                    min="0"
                    defaultValue={0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Students</label>
                  <input
                    className="form-input"
                    id="students"
                    type="number"
                    min="0"
                    defaultValue={0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PWD</label>
                  <input
                    className="form-input"
                    id="pwd"
                    type="number"
                    min="0"
                    defaultValue={0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Seniors</label>
                  <input
                    className="form-input"
                    id="seniors"
                    type="number"
                    min="0"
                    defaultValue={0}
                  />
                </div>
              </div>

              <button type="submit" className="search-button">Search Schedule</button>
            </form>
          </div>
        </>
      )}

      </main>
    </div>
  );
};

export default Schedule;
