// src/components/PopularCarousel/PopularCarousel.js
import React from 'react';
import Slider from 'react-slick';
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
          <img className="PopularImages" src="/images/PopularCarousel/BOHOL.png" alt="BOHOL" />
        </div>
        <div>
          <img className="PopularImages" src="/images/PopularCarousel/ILOCOS.png" alt="ILOCOS" />
        </div>
        <div>
          <img className="PopularImages" src="/images/PopularCarousel/SIQUIJOR.png" alt="SIQUIJOR" />
        </div>
        <div>
          <img className="PopularImages" src="/images/PopularCarousel/Catbalogan.jpg" alt="CATBALOGAN" />
        </div>
      </Slider>
      <div className="carousel-buttons" />
    </div>
  );
};

export default PopularCarousel;