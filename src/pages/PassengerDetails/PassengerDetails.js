import './PassengerDetails.css';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
    selectedDepartureTime ='',
    selectedReturnTime = '',
    totalPrice = 0,
  } = location.state || {};

  const [user, setUser] = useState(null);
  const [passengerIds, setPassengerIds] = useState(
    Array.from({ length: passengers.total }, () => ({ file: null, preview: null }))
  );

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is logged in, update state
      } else {
        setUser(null); // User is not logged in, clear state
      }
    });

    // Local storage handling
    const savedPassengerDetails = JSON.parse(localStorage.getItem("passengerDetails")) || {};
    if (Object.keys(savedPassengerDetails).length > 0) {
      setPassengerIds(savedPassengerDetails.passengerIds || []);
    }

    return () => unsubscribe();
  }, []);

  // Save passenger details to localStorage whenever passengerIds change
  useEffect(() => {
    if (passengerIds.length > 0) {
      const passengerDetails = {
        passengerIds,
      };
      localStorage.setItem("passengerDetails", JSON.stringify(passengerDetails));
    }
  }, [passengerIds]);

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

  const isLoggedIn = user !== null;

  const handleProceedToPayment = () => {
    if (!isLoggedIn) {
      alert("You need to log in first to book a schedule.");
      navigate('/login');
      return;
    }

    const requiredInputs = document.querySelectorAll(".Tbox, .TboxDate, .Checkbox");
    let allValid = true;

    requiredInputs.forEach((input) => {
      if (!input) return;
      if (input.type === "checkbox" && !input.checked) allValid = false;
      else if (input.value === "" || input.value === null || input.value === undefined) allValid = false;
    });

    if (!allValid) {
      alert("Please complete all required fields.");
      return;
    }

    // Gather Passenger Details
    const passengerDetails = Array.from(document.querySelectorAll(".Forms")).map((form, index) => {
      const firstName = form.querySelector(".TboxInputs1 input")?.value || '';
      const lastName = form.querySelector(".TboxInputs2 input")?.value || '';
      const nationality = form.querySelector(".Tbox2")?.value || '';
      const day = form.querySelector(".day select")?.value || '';
      const month = form.querySelector(".month select")?.value || '';
      const year = form.querySelector(".year select")?.value || '';
      const birthDate = `${year}-${month}-${day}`;
  
      return {
        passType: getPassengerType(index),
        firstName,
        lastName,
        nationality,
        birthDate,
        idUpload: passengerIds[index].preview,
      };
    });

    // Gather Contact Information (Email)
    const email = document.querySelector(".CIInputs2 input")?.value || '';
    const guestName = document.querySelector(".CIInputs1 input")?.value || '';

    // Save all the relevant details into localStorage
    const allDetails = {
      passengerIds,
      tripType,
      selectedFrom,
      selectedTo,
      departDate,
      returnDate,
      selectedDepartureTrip,
      selectedReturnTrip,
      selectedDepartureTime,
      selectedReturnTime,
      passengers,
      totalPrice,

      passengerDetails, // Add passenger details here
      email, // Add email here
    };

    localStorage.setItem("passengerDetails", JSON.stringify(allDetails));

    // Navigate to Payment Page and pass the necessary details in state
    navigate('/payment', {
      state: {
        contactDetails: {
          guestName,
          email,
        },
        passengerDetails,  // Pass the passengerDetails object here
        passengerTypeCounts: {
          adults: passengers.adults,
          children: passengers.children,
          students: passengers.students,
          pwd: passengers.pwd,
          seniors: passengers.seniors || 0  // Add this if not already present
        },
        passengerIds: passengerIds,
        tripType,
        selectedFrom,
        selectedTo,
        departDate,
        returnDate,
        selectedDepartureTrip,
        selectedReturnTrip,
        selectedDepartureTime,
        selectedReturnTime,
        passengers,
        totalPrice,
      },
    });
  };

  // Helper function to determine passenger type based on index
  const getPassengerType = (index) => {
    if (index < passengers.adults) return 'Adult';
    if (index < passengers.adults + passengers.children) return 'Child';
    if (index < passengers.adults + passengers.children + passengers.students) return 'Student';
    if (index < passengers.adults + passengers.children + passengers.students + passengers.pwd) return 'PWD';
    return 'Senior Citizen';
  };

  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  const handleIdChange = (index) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedIds = [...passengerIds];
        updatedIds[index] = {
          file: file,
          preview: reader.result,
        };
        setPassengerIds(updatedIds);
      };
      reader.readAsDataURL(file);
    } else {
      const updatedIds = [...passengerIds];
      updatedIds[index] = { file: null, preview: null };
      setPassengerIds(updatedIds);
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
        {Array.from({ length: passengers.total }).map((_, index) => {
          let passengerType = 'Adult'; // Default to Adult
          let typeIndex = 0;

          if (index < passengers.adults) {
            passengerType = 'Adult';
            typeIndex = index + 1;
          } else if (index < passengers.adults + passengers.children) {
            passengerType = 'Child';
            typeIndex = index - passengers.adults + 1;
          } else if (index < passengers.adults + passengers.children + passengers.students) {
            passengerType = 'Student';
            typeIndex = index - (passengers.adults + passengers.children) + 1;
          } else if (index < passengers.adults + passengers.children + passengers.students + passengers.pwd) {
            passengerType = 'PWD';
            typeIndex = index - (passengers.adults + passengers.children + passengers.students) + 1;
          } else {
            passengerType = 'Senior Citizen';
            typeIndex = index - (passengers.adults + passengers.children + passengers.students + passengers.pwd) + 1;
          }

          return (
              <div key={index} className="Forms">
                <div className="PassengerType">
                  <h3>{passengerType} {typeIndex}</h3>
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
      {(passengerType === 'Student' || passengerType === 'Senior Citizen' || passengerType === 'PWD' || passengerType === 'Child') && (
          <div className="TboxInputs4">
            <div className="id-upload">
            <input
              id={`file-upload-${index}`}
              type="file"
              accept="image/*"
              onChange={handleIdChange(index)}
              style={{ display: 'none' }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`file-upload-${index}`).click();
              }}
              className="upload-button"
            >
              Upload File Here
            </button>
            <div>
            {passengerIds[index].preview && (
              <img 
                src={passengerIds[index].preview} 
                alt={`ID Preview for Passenger ${index + 1}`} 
                className="id-preview" 
              />
        )}</div>
            </div>
          </div>
        )}
    </div>
                </div>
              </div>
            )})}
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
            <input className="Tbox" type="text" placeholder="First Name, Middle Name, Last Name" required />
          </div>
        
          <div className="CIInputs2">
            <h4 className="CIHeaders">
            Email<span className="required">*</span>
            </h4>
            <input className="Tbox" type="text" placeholder="scamacs@gmail.com" required />
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