import './PassengerDetails.css';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

const PassengerDetails = () => {
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate(-1, {
      state: {
        previousInputs: {
          tripType,
          selectedFrom,
          selectedTo,
          departDate,
          returnDate,
          selectedDepartureTrip,
          selectedReturnTrip,
          passengers,
          totalPrice,
        },
      },
    });
  };

  const handleProceedToPayment = () => {
    // You can add form validation here before proceeding
    navigate('/payment', {
      state: {
        tripType,
        selectedFrom,
        selectedTo,
        departDate,
        returnDate,
        selectedDepartureTrip,
        selectedReturnTrip,
        passengers,
        totalPrice,
        // Add any additional passenger details collected from the form
      }
    });
  };

  const [isStudentOrSenior, setIsStudentOrSenior] = useState(false);
  const [idFile, setIdFile] = useState(null); // To store the selected ID file
  const [idPreview, setIdPreview] = useState(null); // To store the preview URL

  const handleIdChange = (e) => {
    const file = e.target.files[0]; // Get the first file selected by the user
    if (file) {
        setIdFile(file); // Store the file in the state

        const reader = new FileReader();
        reader.onloadend = () => {
            setIdPreview(reader.result); // Set the preview URL
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
    } else {
        setIdPreview(null); // Reset the preview if no file is selected
    }
};

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

                <div className="PassengerType">
                  <h3>Adult {index + 1}</h3>
                </div>

                <div className="PassengerInputs">
                  <div className="InputHeaders"> 
                    <h4 className="Headers">Name <br/> <span className="subtext">Please make sure that you enter your name exactly as shown on your Valid ID</span></h4>
                    <h4 className="Headers">Day of Birth</h4>
                  </div>
              <div className="FirstRow">
  <div className="TboxInputs1">
    <h4 className="Headers">
      First Name<span className="required">*</span>
    </h4>
    <input className="Tbox" type="text" placeholder="Enter first name" required />
  </div>
  
  <div className="TboxInputs2">
    <h4 className="Headers">
      Last Name<span className="required">*</span>
    </h4>
    <input className="Tbox" type="text" placeholder="Enter last name" required />
  </div>

  <div className="TboxInputs3">
    <div className="day">
      <h4 className="Headers">
        Day<span className="required">*</span>
      </h4>
      <select className="TboxDate" required>
        <option value="">Day</option>
        {Array.from({ length: 31 }, (_, index) => (
          <option key={index + 1} value={index + 1}>{index + 1}</option>
        ))}
      </select>
    </div>
    
    <div className="month">
      <h4 className="Headers">
        Month<span className="required">*</span>
      </h4>
      <select className="TboxDate" required>
        <option value="">Month</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </div>
    
    <div className="year">
      <h4 className="Headers">
        Year<span className="required">*</span>
      </h4>
      <select className="TboxDate" required>
        <option value="">Year</option>
        {Array.from({ length: 100 }, (_, index) => (
          <option key={2024 - index} value={2024 - index}>{2024 - index}</option>
        ))}
      </select>
    </div>
  </div>
</div>

              <div className="TboxInputs">
                <h4 className="Headers">
                  Nationality<span className="required">*</span>
                </h4>
                <select className="Tbox2" required>
                <option value="">Select Nationality</option>
                <option value="Filipino">Filipino</option>
                <option value="American">American</option>
                <option value="British">British</option>
                <option value="Canadian">Canadian</option>
                <option value="Filipino">Filipino</option>
                <option value="Indian">Indian</option>
                <option value="Japanese">Japanese</option>
                <option value="Chinese">Chinese</option>
                <option value="Australian">Australian</option>
                {/* Add more options as needed */}
                </select>
              </div>
                
              <div className="TboxInputs4">
      <h4 className="Headers">
        <input
          type="checkbox"
          className="Checkbox"
          onChange={(e) => setIsStudentOrSenior(e.target.checked)} // Update state on change
        />{' '}
        <span> </span>
        I am a Student/Senior Citizen/Person with Disability.
      </h4>

      {isStudentOrSenior && ( // Show upload section only if checked
        <div className="id-upload">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleIdChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('file-upload').click();
            }}
            className="upload-button"
          >
            Upload File Here
          </button>
          {idPreview && <img src={idPreview} alt="ID Preview" className="id-preview" />}
        </div>
      )}
    </div>
                </div>
              </div>
            ))}
        </div>

        </div>

        <div className="ContactInformation">
          <div className="PDHeaders">
          <h2 className="CIHeader">Contact Information</h2>
          <p className="CISubtext">Let us know how we may reach you if there are changes or questions related to your booking and payment. 
            We will be sending your itenerary to email below</p>
          </div>
        
        <div className="ContactInformationForm">
          <div className="CIFirstRow">
            <div className="CIInputs1">
            <h4 className="CIHeaders">
            Guest Name<span className="required">*</span>
            </h4>
            <input className="Tbox" type="text" placeholder="scamacs@gmail.com" required />
          </div>
        
          <div className="CIInputs2">
            <h4 className="CIHeaders">
            Email<span className="required">*</span>
            </h4>
            <input className="Tbox" type="text" placeholder="Enter Email" required />
          </div>
        </div>
          <div className="CISecondRow">
          <div className="CIInputs3">
            <h4 className="CIHeaders">
            Contact Number<span className="required">*</span>
            </h4>
          <div className="ContactNumber">
          <div className="AreaCode">
            <select className="Tbox" required>
            <option value="">Select Area Code</option>
              <option value="+63">Philippines (+63)</option>
              <option value="+1">United States (+1)</option>
              <option value="+44">United Kingdom (+44)</option>
              <option value="+61">Australia (+61)</option>
              <option value="+81">Japan (+81)</option>
              <option value="+91">India (+91)</option>
              <option value="+86">China (+86)</option>
              <option value="+33">France (+33)</option>
              <option value="+49">Germany (+49)</option>
              <option value="+82">South Korea (+82)</option>
              {/* Add more options as needed */}
            </select>
            </div>
            <div className="Number">
            <input className="Tbox" type="text" placeholder="9XX XXXX XXX" required />
            </div>    
          </div>
            
          </div>

          <div className="CIInputs4">
            <h4 className="CIHeaders">
            Retype Email<span className="required">*</span>
            </h4>
            <input className="Tbox" type="text" placeholder="scamacs@gmail.com" required />
          </div>
        </div>
      </div>
        <div className="Confirmation">
        <div className="ConfCheckBox">
        <h4 className="Headers">
        <input type="checkbox" className="Checkbox"/>
        <span className="subtext3">I confirm that I have read, understood, and agree to the updated Ferry Demure <a href="/privacy-policy" className="privacy-policy">Privacy Policy</a>, which provides additional information on 
        how my Personal Information is used. <span className="required">*</span>
        </span>
        </h4>  
        </div>
        </div>  
        </div>
        <div className="Buttons">
          <div className="Back">
          <button className="BackButton" onClick={handleBack}>Back</button>
          </div>
          <div className="Proceed">
          <button className="ProceedButton" onClick={handleProceedToPayment}>Proceed to Payment</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PassengerDetails;