import React, { useState } from 'react';
import HomeCarousel from '../../components/HomeCarousel/HomeCarousel';
import PopularCarousel from '../../components/PopularCarousel/PopularCarousel';
import AboutUsModal from './AboutUsModal';
import ContactUsModal from './ContactUsModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import SupportEngine from './SupportEngine'; // Import SupportEngine component
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div>
      <div className="HomeContainer">
        <div className="leftSide">
          <div className="TextWithSquare">
            <div id="square"></div>
            <div className="HomeText">
              <p id="F1">FERRY FAST,</p>
              <p id="F2">FERRY DEMURE</p>
              <p id="F3">
                Get the affordable ticket for you in every season without any worries. <br />
                We are also giving a special offer on a round-trip for some destinations, <br />
                so you can earn points from it!
              </p>
            </div>
          </div>
          <div className="BookNow">
            <Link to="/schedule"> {/* Redirect to Schedule page */}
              <button id="BookNowButton">
                BOOK NOW <img id="arrow" src="/images/Arrow.png" alt="Arrow" />
              </button>
            </Link>
          </div>
        </div>
        <div className="rightSide">
          <HomeCarousel />
        </div>
      </div>

      <div className="PopularContainer">
        <div className="HeaderText">
          <h1 id="PopHead">Popular Destination</h1>
          <p id="PopSub">Unleash Your Wanderlust With FerryEeyyy</p>
        </div>
        <div className="PopularCarouselDiv">
          <PopularCarousel /> {/* Add the new carousel here */}
        </div>
        <div className="HeaderText2">
          <h1 id="PopHead">Journey To The Sea Made Simple!</h1>
        </div>

        <div className="SecondContent">
          <div className="Left-side">
            <img id="coronPic" src="/images/CORON.jfif" alt="CORON" />
          </div>
          <div className="Right-side">
            <h3 id="Right-Text">
              Demure Sailing, Bold Wanderlust – 
            </h3>
            <h3 id="Right-Text">
              Swift Sail Awaits!
            </h3>
            <Link to="/schedule">
              <button id="BookNowButton2">
                BOOK NOW <img id="arrow" src="/images/Arrow.png" alt="Arrow" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrivacyPolicyModal showModal={showPrivacyModal} setShowModal={setShowPrivacyModal} />
      <AboutUsModal showModal={showAboutUsModal} setShowModal={setShowAboutUsModal} />
      <ContactUsModal showModal={showContactUsModal} setShowModal={setShowContactUsModal} />

      {/* SupportEngine Component */}
      <SupportEngine />

      {/* Footer */}
      <div className="FOOTER">
        <button className="footer-item" onClick={() => setShowAboutUsModal(true)}>
          About Us
        </button>
        <button className="footer-item" onClick={() => setShowContactUsModal(true)}>
          Contact Us
        </button>
        <button className="footer-item" onClick={() => setShowPrivacyModal(true)}>
          Privacy Policy
        </button>
      </div>
    </div>
  );
};

export default Home;
