// src/components/Carousel.js
import React from 'react';
import Slider from 'react-slick';
import './Carousel.css';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src="/images/image1.jpg" alt="Slide 1" />
        </div>
        <div>
          <img src="/images/image2.jpg" alt="Slide 2" />
        </div>
        <div>
          <img src="/images/image3.jpg" alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;