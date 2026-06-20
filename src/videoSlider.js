const videos = Array.from(document.querySelectorAll(".hero-video"));
if (videos.length > 0) {
  let activeIndex = 0;

  const preloadNext = (currentIndex) => {
    const nextIndex = (currentIndex + 1) % videos.length;
    const nextVideo = videos[nextIndex];
    if (nextVideo.preload === "none") {
      nextVideo.preload = "auto";
      nextVideo.load();
    }
  };

  const applySlide = (index) => {
    videos.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.classList.toggle("active", isActive);
      if (isActive) {
        item.currentTime = 0;
        item.play().catch(() => {});
      } else {
        item.pause();
      }
    });
    // Start loading the next video in the background
    preloadNext(index);
  };

  applySlide(activeIndex);

  window.setInterval(() => {
    activeIndex = (activeIndex + 1) % videos.length;
    applySlide(activeIndex);
  }, 6000);
}
