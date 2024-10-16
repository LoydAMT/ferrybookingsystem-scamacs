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
  const [tripType, setTripType] = useState('round-trip');
  const [fromLocations, setFromLocations] = useState([]);
  const [toLocations, setToLocations] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [loadingFrom, setLoadingFrom] = useState(true);
  const [loadingTo, setLoadingTo] = useState(false);
  const [error, setError] = useState(null);
  const [searchCompleted, setSearchCompleted] = useState(false); // Manage the state to toggle views
  const navigate = useNavigate();

  // Background rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Fetch all "From" locations when the component mounts
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

  // Fetch "To" locations when a "From" location is selected
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
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (selectedFrom && selectedTo) {
      setSearchCompleted(true);
      navigate('/scheduleview', {
        state: {
          selectedFrom,
          selectedTo,
          departDate: document.getElementById('depart').value,
          returnDate: document.getElementById('return').value
        }
      });
    } else {
      alert('Please select both "From" and "To" locations.');
    }
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
  // Replace this with some valid JSX or an empty fragment
  <div>
    {/* You can add some placeholder text here */}
    <p>Search Completed!</p>
  </div>
) : (
  <>
    <div className="content-container">
      <h1 className="main-title">{backgrounds[currentBackground].text}</h1>

      <form className="booking-form" onSubmit={handleSearch}>
        {error && <p className="error-message">{error}</p>}
        
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
              disabled={loadingFrom || error}
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
              onChange={(e) => setSelectedTo(e.target.value)}
              disabled={!selectedFrom || loadingTo || error}
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
