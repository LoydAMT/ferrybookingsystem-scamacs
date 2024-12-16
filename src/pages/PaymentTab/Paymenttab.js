import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc} from 'firebase/firestore';
import { db } from '../../firebase';
import './Paymenttab.css';
import emailjs from '@emailjs/browser';

const PaymentTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    contactDetails,
    passengerDetails,
    passengerTypeCounts,
    passengerIds,
    tripType,
    selectedFrom,
    selectedTo,
    departDate,
    returnDate,
    selectedDepartureTrip,
    selectedReturnTrip,
    passengers,
    totalPrice,
    time,
    email,
    selectedDepartureTime,
    selectedReturnTime,
  } = location.state || {};

  const calculateTotalPrice = (totalPrice, passengers, passengerDetails = [], passengerIds = []) => {
    let perPerson = 0;         // Price per person
    let discount = 0;          // Total discount
    let discountedPrice = 0;   // Final price after discount
    
    // Ensure all parameters have default values
    const safePassengers = passengers || {};
    
    // Destructure passenger types with default values
    const {
      total = 0,
      students = 0,
      pwd = 0,
      seniors = 0,
      children = 0,
      adults = 0,
    } = safePassengers;
  
    // 1. Calculate per person cost based on total price and total passengers
    if (total > 0) {
      perPerson = (totalPrice) / total;
    }
  
    // 2. Calculate discounts based on passenger type and ID verification
    const discountedPassengers = passengerDetails.reduce((acc, passenger, index) => {
      // Ensure we have a corresponding ID entry
      const idPreview = passengerIds[index] ? passengerIds[index].preview : null;
      
      switch(passenger.passType) {
        case 'Student':
          if (idPreview !== null) acc.students++;
          break;
        case 'PWD':
          if (idPreview !== null) acc.pwd++;
          break;
        case 'Senior Citizen':
          if (idPreview !== null) acc.seniors++;
          break;
        case 'Child':
          if (idPreview !== null) acc.children++;
          break;
      }
      
      return acc;
    }, {
      students: 0,
      pwd: 0,
      seniors: 0,
      children: 0
    });
  
    // Calculate discounted prices
    const studentPrice = perPerson * discountedPassengers.students * 0.2;   // 20% off for verified students
    const pwdPrice = perPerson * discountedPassengers.pwd * 0.2;            // 20% off for verified PWD
    const seniorPrice = perPerson * discountedPassengers.seniors * 0.2;     // 20% off for verified seniors
    const childPrice = perPerson * discountedPassengers.children * 0.5;     // 50% off for verified children
  
    // 3. Calculate the total discounted price
    discount = studentPrice + pwdPrice + seniorPrice + childPrice;
    discountedPrice = (perPerson * total) - discount;
  
    return discountedPrice.toFixed(2); // Return price with 2 decimal points
  };
  

  const discountedTotalPrice = calculateTotalPrice(
    totalPrice, 
    passengers, 
    passengerDetails, 
    passengerIds
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };
  
  //sendemail
  const sendEmail = () => {
    const bookingReference = `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`; // Generate a random booking reference number
    const guestList = passengerDetails
      .map((passenger, index) => `${index + 1}. ${passenger.firstName} ${passenger.lastName}`)
      .join('\n');
    const emailParams = {
      from_email: 'rainelynsungahid@gmail.com',
      to_email: contactDetails.email, // Recipient email from contactDetails
      subject: 'Payment Confirmation',
      message: `Dear ${contactDetails.guestName},

      Thank you for booking with SwiftSail Ferries. Here are your booking details:

      Status: Confirmed  
      Place: ${selectedFrom} → ${selectedTo}  
      Departure Date: ${departDate} ${selectedDepartureTime}
      Return Date: ${returnDate} ${selectedReturnTime} 
      Booking Reference Number: ${bookingReference}  

      Guest List:  
      ${guestList}

      Total Passengers: ${passengers.total}  
      Total Price: ₱${totalPrice}
      Total Price: ₱${discountedTotalPrice}

      We look forward to serving you. Have a pleasant trip!

      Best regards,  
      SwiftSail Ferries
    `,
    };
    emailjs
    .send('service_uxyb39q', 'template_uau31cw', emailParams, 'iRnFZfZp_o8-89uKj')
    .then(
      (result) => {
        console.log('Email sent successfully:', result.text);
        alert('Confirmation email sent!');
      },
      (error) => {
        console.error('Error sending email:', error.text);
        alert('Failed to send confirmation email.');
      }
    );
  };

  const handleConfirmPayment = async () => {
    if (selectedPaymentMethod === 'e-wallet') {
      const paymongoPublicKey = 'pk_test_D8eC3g7r6y3kC7Z439fX3MoH';
      const paymongoEndpoint = 'https://api.paymongo.com/v1/sources';

      try {
        const response = await fetch(paymongoEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(paymongoPublicKey + ':')}`,
          },
          body: JSON.stringify({
            data: {
              attributes: {
                amount: discountedTotalPrice * 100, // Convert to cents
                redirect: {
                  success: 'https://swiftsail-ferries.vercel.app///paymentsuccess',
                  failed: 'https://swiftsail-ferries.vercel.app///paymentfailure',
                },
                type: 'gcash', // Change this if needed
                currency: 'PHP',
              },
            },
          }),
        });

        const result = await response.json();
        if (result.data && result.data.attributes && result.data.attributes.redirect) {
          // Show success or failure popup based on the result
          window.open(result.data.attributes.redirect.checkout_url, '_blank');

          // Simulate a payment result response after redirection (mock response)
          const isPaymentSuccessful = true; // Mock variable; replace with real status if using actual integration
          if (isPaymentSuccessful) {
            alert('Payment Successful');
            // Retrieve the first name, last name, and email from passengerDetails

            const passengerNames = {};
        
            // Loop through all passengers and add their names to the object
            passengerDetails.forEach((passenger, index) => {
              passengerNames[`FirstName${index + 1}`] = passenger.firstName;
              passengerNames[`LastName${index + 1}`] = passenger.lastName;
            });
    
            const bookingsCollection = collection(db, 'Bookings');
            await addDoc(bookingsCollection, {
              ...passengerNames, // Spread the passenger names
              SelectedDest: selectedTo,
              SelectedRet: selectedFrom,
              Email: contactDetails.email,
              DepartDate: departDate,
              ReturnDate: returnDate,
              TripType: tripType,
              TotalPassengers: passengers.total,
              TotalPrice: totalPrice,
              TimeBought: new Date().toLocaleString()
            });

          console.log('Booking info saved to Firestore');
          sendEmail();
            
          } else {
            alert('Payment Failed');
          }
          
          // Navigate to the homepage after showing the message
          navigate('/');
        }
      } catch (error) {
        console.error('Error initiating PayMongo payment:', error);
        alert('Payment Failed');
        navigate('/');
      }
    } else {
      alert('Please select a valid payment method.');
    }
  };

  return (
    <div className="payment-container">
      <header className="payment-header">
        <h2>Payment Details</h2>
        <div className="trip-summary">
          <div className="route">
            <span>{selectedFrom}</span>
            <span className="arrow">→</span>
            <span>{selectedTo}</span>
          </div>
          <div className="details">
            <p>Trip Type: {tripType}</p>
            <p>Departure: {departDate}</p>
            {tripType === 'round-trip' && <p>Return: {returnDate}</p>}
            <p>Passengers: {passengers.total}</p>
            <p>Total Price: ₱{totalPrice}</p>
          </div>
        </div>
      </header>

      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        <div className="payment-options">
          <button 
            className={`payment-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('card')}
          >
            Credit/Debit Card
          </button>
          <button 
            className={`payment-option ${selectedPaymentMethod === 'e-wallet' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('e-wallet')}
          >
            E-Wallet
          </button>
          <button 
            className={`payment-option ${selectedPaymentMethod === 'bank' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect('bank')}
          >
            Bank Transfer
          </button>
        </div>
      </div>

      <div className="payment-buttons">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>

        <button className="confirm-payment" onClick={handleConfirmPayment}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentTab;
