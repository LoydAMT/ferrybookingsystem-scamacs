const ContactUsModal = ({ isOpen, onClose}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <div className="modal-content">
        <h2 id="contact-modal-title">Contact Us</h2>
        <div className="modal-body">
          <p>
            <strong>Contact Us:</strong> If you have any questions about this
            policy, please contact us at <a href="mailto:swiftsail.ferries@gmail.com">swiftsail.ferries@gmail.com</a>.
          </p>
        </div>
        <button className="close-button" onClick={onClose} aria-label="Close">
          Close
        </button>
      </div>
    </div>
  );
};

export default ContactUsModal;