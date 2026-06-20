/**
 * Mobile navigation toggle
 * Hamburger ↔ close, closes on: link click, outside click, Escape key
 */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  const open = () => {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
  };

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  };

  toggle.addEventListener("click", () => {
    nav.classList.contains("is-open") ? close() : open();
  });

  // Close when a nav link is clicked
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (
      nav.classList.contains("is-open") &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      close();
    }
  });

  // On resize to desktop, reset state
  const mq = window.matchMedia("(max-width: 760px)");
  const handleResize = (e) => {
    if (!e.matches) {
      close();
    }
  };
  mq.addEventListener("change", handleResize);
}
