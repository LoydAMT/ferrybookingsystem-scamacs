import React from 'react';
import HomeCarousel from '../../components/HomeCarousel/HomeCarousel';
import PopularCarousel from '../../components/PopularCarousel/PopularCarousel'; // Import the new carousel component
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
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
                We are also giving a special offer on a round-trip for some destination, <br />
                so you can earn points from it!
              </p>
            </div>
          </div>
          <div className="BookNow">
            <Link to="/schedule">  {/* Redirect to Schedule page */}
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
        <div className='HeaderText'>
          <h1 id="PopHead">Popular Destination</h1>
          <p id="PopSub">Unleash Your Wanderlust With FerryEeyyy</p>
        </div>
        <div className="PopularCarouselDiv">
          <PopularCarousel /> {/* Add the new carousel here */}
        </div>
        <div className='HeaderText2'>
          <h1 id="PopHead">Journey To The Sea Made Simple!</h1>
        </div>
        <div className='CardsContainer'>
          <div className='Card'>
            <div className='CardContent'>
              <img 
                src="/images/TRACKING.jpg" 
                alt="Track Destination" 
                className="map-image" 
              />
              <div className="card-text">
                Track Your Destination <span className="arrow">→</span>
              </div>
            </div>
          </div>
          <div className='Card'>
            <div className='CardContent'>
              <img 
                src="/images/TRACKING.jpg" 
                alt="Get Started" 
                className="map-image" 
              />
              <div className="card-text">
                Get Started <span className="arrow">→</span>
              </div>
            </div>
          </div>
          <div className='Card'>
            <div className='CardContent'>
              <img 
                src="/images/TRACKING.jpg" 
                alt="Blank Card" 
                className="map-image" 
              />
              <div className="card-text">
                Blank Card <span className="arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="BookNowContainer">
        <p>lorem ipsim</p>
      </div>
    </div>
  );
};

export default Home;
