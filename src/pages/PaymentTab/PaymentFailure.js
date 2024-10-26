import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentFeedback.css'; // Use the same CSS file for consistent styling

const PaymentFailure = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="payment-feedback-container">
      <h2>Payment Failed</h2>
      <p>Unfortunately, your transaction could not be completed. Please try again later.</p>
      <button onClick={handleGoHome} className="feedback-button">
        Go to Home Page
      </button>
    </div>
  );
};

export default PaymentFailure;
