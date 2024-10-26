import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Paymenttab.css'; // Create this CSS file for styling

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

  const handleBack = () => {
    navigate(-1);
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
        {/* Add your payment method options here */}
        <div className="payment-options">
          <button className="payment-option">Credit/Debit Card</button>
          <button className="payment-option">E-Wallet</button>
          <button className="payment-option">Bank Transfer</button>
        </div>
      </div>

      <div className="payment-buttons">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="confirm-payment">
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentTab;