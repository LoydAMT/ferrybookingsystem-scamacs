import './PassengerDetails.css';
import { useLocation } from 'react-router-dom';

const PassengerDetails = () => {
  const location = useLocation();
  const {
    tripType = '',
    selectedFrom = '',
    selectedTo = '',
    departDate = '',
    returnDate = '',
    selectedDepartureTrip = { time: '', price: 0 },
    selectedReturnTrip = { time: '', price: 0 },
    passengers = { total: 0 },
    totalPrice = 0,
  } = location.state || {};

  return (
    <div className="Passenger-Details">
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
          <div className="format">{departDate}</div>
          <div>Departure</div>
        </div>
        {tripType === 'round-trip' && (
          <div className="dateReturn">
            <div className="format">{returnDate}</div>
            <div>Return</div>
          </div>
        )}
      </header>

      <div className="Main-Content">
        <div className="PDHeaders">
          <div className='PicandHead'>
          <img src='/images/default-profile.jpg' className='ProfilePhoto'/>
          <h2 className="subhead">Passenger Details</h2>
          </div>
          <div className="SUBHEADS">
          <p className="subhead1">Selected Destination: {selectedTo}</p>
          <p className="subhead2">From: {selectedFrom}</p>
          </div>
        </div>
        <div className="PassengerInformation">
        <div className="PassengerForms">
        {Array.from({ length: passengers.total }).map((_, index) => (
              <div key={index} className="Forms">
                <h3>Adult {index + 1}</h3>
                <label>
                  First Name*
                  <input type="text" placeholder="Enter first name" required />
                </label>
                <label>
                  Last Name*
                  <input type="text" placeholder="Enter last name" required />
                </label>
                <label>
                  Day of Birth*
                  <input type="text" placeholder="DD" required />
                  <input type="text" placeholder="Month" required />
                  <input type="text" placeholder="YYYY" required />
                </label>
                <label>
                  Nationality*
                  <input type="text" placeholder="Select Nationality" required />
                </label>
                <label>
                  <input type="checkbox" />
                  I am a Student/Senior Citizen/Person with Disability.
                </label>
              </div>
            ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;