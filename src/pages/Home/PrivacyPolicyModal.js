import React from 'react';
import './PrivacyPolicyModal.css';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <h2 id="modal-title">Privacy Policy</h2>
        <div className="modal-body">
          <p>
            <strong>Introduction:</strong> Your privacy is important to us. This
            Privacy Policy explains how we collect, use, and protect your
            personal information when you use our services.
          </p>
          <p>
            <strong>Information We Collect:</strong> We collect personal
            information such as your name, email address, payment details, and
            trip preferences to provide our services.
          </p>
          <p>
            <strong>How We Use Information:</strong> Your information is used
            to process bookings, manage payments, and improve our services. We
            do not share your data with third parties except for payment
            processors.
          </p>
          <p>
            <strong>Data Protection:</strong> We implement secure protocols to
            protect your information from unauthorized access.
          </p>
          {/* <p>
            <strong>Contact Us:</strong> If you have any questions about this
            policy, please contact us at swiftsail.ferries@gmail.com.
          </p> */}
        </div>
        <button className="pclose-button" onClick={onClose} aria-label="Close">
          Close
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
