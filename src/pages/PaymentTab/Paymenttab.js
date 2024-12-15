import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './Paymenttab.css';

const PaymentTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const {
    passengerDetails = {}, // Retrieve passenger details from state
    // Add other details as needed
  } = location.state || {};

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
                amount: totalPrice * 100, // Convert to cents
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
            const passengerDocId = `${passengerDetails.firstName}_${passengerDetails.lastName}_${passengerDetails.nationality}
              _${passengerDetails.birthDate}_${passengerDetails.idUpload}_${passengerDetails.passType}`;
            await setDoc(doc(db, 'passengerInfo', passengerDocId), {
              ...passengerDetails,
            });
  
            console.log('Passenger info saved to Firestore');
            
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
