const aboutVisual = document.querySelector(".about-visual");

if (aboutVisual && window.matchMedia("(pointer: fine)").matches) {
  const updateRevealPosition = (event) => {
    const bounds = aboutVisual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    aboutVisual.style.setProperty("--reveal-x", `${x}%`);
    aboutVisual.style.setProperty("--reveal-y", `${y}%`);
  };

  aboutVisual.addEventListener("pointerenter", (event) => {
    aboutVisual.classList.add("is-active");
    updateRevealPosition(event);
  });

  aboutVisual.addEventListener("pointermove", updateRevealPosition);

  aboutVisual.addEventListener("pointerleave", () => {
    aboutVisual.classList.remove("is-active");
    aboutVisual.style.setProperty("--reveal-x", "50%");
    aboutVisual.style.setProperty("--reveal-y", "50%");
  });
}
