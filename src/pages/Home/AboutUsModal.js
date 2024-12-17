const AboutUsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="about-us-modal-title">
      <div className="modal-content">
        <h2 id="about-us-modal-title">About Us</h2>
        <div className="modal-body">
          <p>
            <strong>Welcome to Swift Sail Ferries!</strong>
          </p>
          <p>
            At Swift Sail Ferries, we are dedicated to redefining the way you travel across the seas. With our mission 
            to provide fast, reliable, and affordable ferry services, we aim to make every journey seamless and memorable.
          </p>
          <p>
            Established with a passion for connecting destinations and communities, our commitment is to prioritize safety, 
            comfort, and convenience for all our passengers. Whether you're planning a quick getaway or a leisurely trip, 
            Swift Sail Ferries ensures an exceptional travel experience tailored to your needs.
          </p>
          <p>
            From advanced ticketing solutions to real-time ferry tracking, we leverage technology to enhance your experience. 
            We also proudly support sustainable tourism and local economies by connecting people to the stunning destinations 
            our region has to offer.
          </p>
          <p>
            <strong>Our Values:</strong>
          </p>
          <ul>
            <li>Reliability: Always on time, every time.</li>
            <li>Customer-Centric: Your satisfaction is our priority.</li>
            <li>Innovation: Embracing technology for smarter solutions.</li>
            <li>Sustainability: Committed to environmentally-friendly practices.</li>
          </ul>
          <p>
            Thank you for choosing Swift Sail Ferries. We look forward to being a part of your journey and making your travels unforgettable!
          </p>
        </div>
        <button className="close-button" onClick={onClose} aria-label="Close">
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutUsModal;
