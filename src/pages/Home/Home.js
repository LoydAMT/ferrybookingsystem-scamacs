// src/pages/Home.js
import { onBackgroundMessage } from 'firebase/messaging/sw';
import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div>
      <div className="HomeContainer">
        <div className="TextWithSquare">
          <div id='square'></div>
          <div className='HomeText'>
            <p id='F1'>FERRY FAST,</p>
            <p id='F2'>FERRY DEMURE</p>
            <p id="F3">Get the affordable ticket for you in every season without any worries. <br /> We are also giving a special offer on a round-trip for some destination, <br />so you can earn points from it!</p>
          </div>
        </div>
        <div className='BookNow'>
          <button id='BookNowButton'>BOOK NOW <img id='arrow' src='/images/Arrow.png' alt='Arrow' /> </button>
        </div>
      </div>

      <div className="PopularContainer">
        <p>lorem ipsim</p>
      </div>

      <div className="BookNowContainer">
        <p>lorem ipsim</p>
      </div>
    </div>
  );
};

export default Home;
