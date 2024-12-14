const PrivacyPolicyModal = ({ showModal, setShowModal }) => {
    if (!showModal) return null;
  
    return (
      <div>
        <div className="modal-overlay" onClick={() => setShowModal(false)} />
        <div className="modal-content">
          <h2>About Us</h2>
          <p>Some content here</p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    );
  };
  
  export default PrivacyPolicyModal;