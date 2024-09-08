
// src/components/HomeCarousel/HomeCarousel.js
import React from 'react';
import Slider from 'react-slick';
import './HomeCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,  // Show 2 slides at once
    slidesToScroll: 1, // Scroll one slide at a time
    centerMode: true, // Enable center mode to highlight the center slide
    centerPadding: '0', // Remove extra padding
    focusOnSelect: true,
    autoplay: true,
    afterChange: (current) => {
      console.log('Current slide:', current);
    }
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img className="HomeImages" src="/images/CEBU.png" alt="Slide 1" />
        </div>
        <div>
          <img className="HomeImages" src="/images/Bohol.jpg" alt="Slide 2" />
        </div>
        <div>
          <img className="HomeImages" src="/images/Ilocos.jpg" alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
};

export default HomeCarousel;