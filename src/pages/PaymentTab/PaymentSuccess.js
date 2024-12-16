import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentFeedback.css'; // Create this CSS file for consistent styling

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="payment-feedback-container">
      <h2>Payment Successful!</h2>
      <p>Thank you for your payment. Your transaction was completed successfully.</p>
      <p>We've emailed you your booking details. 
      Please check the email you provided in the contact information.</p>
      <button onClick={handleGoHome} className="feedback-button">
        Go to Home Page
      </button>
    </div>
  );
};

export default PaymentSuccess;
