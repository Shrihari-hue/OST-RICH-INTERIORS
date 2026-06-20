const videos = Array.from(document.querySelectorAll(".hero-video"));
if (videos.length > 0) {
  let activeIndex = 0;

  const applySlide = (index) => {
    videos.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.classList.toggle("active", isActive);
      if (isActive) {
        // Always restart from the beginning so zoom + content stay in sync
        item.currentTime = 0;
        item.play().catch(() => {});
      } else {
        item.pause();
        // Don't touch currentTime on inactive videos — avoids buffering/seek glitches
      }
    });
  };

  applySlide(activeIndex);

  window.setInterval(() => {
    activeIndex = (activeIndex + 1) % videos.length;
    applySlide(activeIndex);
  }, 6000);
}
