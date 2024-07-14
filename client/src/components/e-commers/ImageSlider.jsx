import React from 'react';
import 'react-slideshow-image/dist/styles.css';
import { Fade, Zoom, Slide } from 'react-slideshow-image';

const images = [
  {
    url: '/imageSlider1.jpg',
    title: 'frist Slide',
  },
  {
    url: '/imageSlider2.jpg',
    title: 'second Slide',
  },
  {
    url: '/imageSlider1.jpg',
    title: 'third Slide',
  },
];
function ImageSlider() {
  return (
    <div className="inline md:slide-container">
      <Slide>
        {images.map((image, idx) => (
          <div key={idx}>
            <div
              className="flex justify-center items-end w-full  h-[400px] bg-center"
              style={{ backgroundImage: `url(${image.url})` }}
            >
              {/* <span className="text-2xl mb-4  text-white">{image.title}</span> */}
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
}

export default ImageSlider;
