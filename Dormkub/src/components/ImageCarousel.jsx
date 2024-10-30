import { useState } from 'react';

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return <div className="text-center text-gray-500">No images available</div>;
  }

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative max-w-2xl mx-auto m-12">
      <img
        src={images[currentIndex]}
        alt="Room"
        className="w-full h-96 object-cover  shadow-md carousel-image"
        onError={(e) => { e.target.src = 'https://drive.usercontent.google.com/download?id=1KIs-IkHVOMX5-u0l1p8_dA5Mlh8fD98d&export=view&authuser=0'; }}
      />
      <button
        onClick={handlePrevClick}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
      >
        ◀
      </button>
      <button
        onClick={handleNextClick}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
      >
        ▶
      </button>
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Room Thumbnail"
            className={`w-24 h-24 object-cover cursor-pointer rounded-lg shadow-md ${
              index === currentIndex ? 'border-4 border-blue-500' : 'border-2 border-transparent'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;