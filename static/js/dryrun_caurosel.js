document.addEventListener('DOMContentLoaded', function() {
  // Get all carousel containers (in case there are multiple on the page)
  const carousels = document.querySelectorAll('.image-carousel-container');

  carousels.forEach(carouselContainer => {
    // Get the main carousel element and all images inside it
    const carousel = carouselContainer.querySelector('.carousel');
    const images = carousel.querySelectorAll('.carousel-image');
    
    // Get control buttons and the image counter span
    const leftArrow = carouselContainer.querySelector('.image-carousel-left-arrow');
    const rightArrow = carouselContainer.querySelector('.image-carousel-right-arrow');
    const playButton = carouselContainer.querySelector('.image-carousel-play-button');
    const pauseButton = carouselContainer.querySelector('.image-carousel-pause-button');
    const downButton = carouselContainer.querySelector('.image-carousel-down-button');
    const imageNumberSpan = carouselContainer.querySelector('.image-number');
    
    // (Optional) The vertical view container
    const verticalView = carouselContainer.querySelector('.vertical-view');
    
    // Track the current slide index and a reference to the autoplay interval
    let currentIndex = 0;
    let slideInterval = null;
    
    // Function to update carousel position and image number display.
    const updateCarousel = () => {
      // Assuming all images have the same width; get the first image's width.
      const imageWidth = images[0].offsetWidth;
      // Move the carousel by updating the transform property
      carousel.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
      // Update the display (e.g., "2 / 5")
      imageNumberSpan.textContent = `${currentIndex + 1} / ${images.length}`;
    };

    // NEXT arrow: go to next image (wraps around to the start)
    rightArrow.addEventListener('click', () => {
      if (currentIndex < images.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // wrap to first image
      }
      updateCarousel();
    });

    // PREVIOUS arrow: go to previous image (wraps around to the end)
    leftArrow.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = images.length - 1; // wrap to last image
      }
      updateCarousel();
    });

    // PLAY button: start auto-sliding every 3 seconds
    playButton.addEventListener('click', () => {
      // Prevent multiple intervals from starting
      if (!slideInterval) {
        slideInterval = setInterval(() => {
          if (currentIndex < images.length - 1) {
            currentIndex++;
          } else {
            currentIndex = 0;
          }
          updateCarousel();
        }, 3000); // change slide every 3 seconds
      }
    });

    // PAUSE button: stop the auto-slide
    pauseButton.addEventListener('click', () => {
      clearInterval(slideInterval);
      slideInterval = null;
    });

    // DOWN button: toggle the vertical view (if present)
    downButton.addEventListener('click', () => {
      // Toggle display style; you might want to add a class and handle via CSS instead
      if (verticalView.style.display === 'block') {
        verticalView.style.display = 'none';
      } else {
        verticalView.style.display = 'block';
      }
    });

    // Initialize the carousel display
    updateCarousel();

    // (Optional) Update carousel layout on window resize.
    window.addEventListener('resize', updateCarousel);
  });
});

