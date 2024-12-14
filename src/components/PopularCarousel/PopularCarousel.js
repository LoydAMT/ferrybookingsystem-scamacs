// src/components/PopularCarousel/PopularCarousel.js
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import './PopularCarousel.css'; // Create this CSS file for styling
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PopularCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 slides at once
    slidesToScroll: 1,
    arrows: true,
    appendArrows: '.carousel-buttons', // Position arrows inside this container
  };

  return (
    <div className="popular-carousel-wrapper">
      <Slider {...settings}>
        <div>
          <Link to="/schedule">
          <img className="PopularImages" src="/images/PopularCarousel/BOHOL.png" alt="BOHOL" />
          </Link>
        </div>
        <div>
          <Link to="/schedule">
          <img className="PopularImages" src="/images/PopularCarousel/ILOCOS.png" alt="ILOCOS" />
          </Link>
        </div>
        <div>
          <Link to="/schedule">
          <img className="PopularImages" src="/images/PopularCarousel/SIQUIJOR.png" alt="SIQUIJOR" />
          </Link>
        </div>
        <div>
          <Link to="/schedule">
          <img className="PopularImages" src="/images/PopularCarousel/Catbalogan.jpg" alt="CATBALOGAN" />
          </Link>
        </div>
      </Slider>
      <div className="carousel-buttons" />
    </div>
  );
};

export default PopularCarousel;