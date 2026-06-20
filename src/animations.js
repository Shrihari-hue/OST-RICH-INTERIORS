import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { waitForWelcome } from "./welcomeVoice.js";

gsap.registerPlugin(ScrollTrigger);

const intro = document.querySelector(".intro");
const pageShell = document.querySelector(".page-shell");
const header = document.querySelector(".site-header");
const lightHeaderSections = gsap.utils.toArray("[data-header-theme='light']");
const revealItems = document.querySelectorAll(".reveal");

const initialHash = window.__ostRichInitialHash || window.location.hash;
const hasHash = initialHash.length > 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const lenis = new Lenis({
    duration: 1.1,
    smoothTouch: false,
    wheelMultiplier: 0.92,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time) => {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  };

  window.requestAnimationFrame(raf);
}

const runOpeningSequence = async () => {
  const introTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
  });

  introTimeline
    .to(".intro-logo-image", { opacity: 1, y: 0, duration: 0.9 })
    .to(".intro-line", { width: 240, duration: 0.8 }, "-=0.2");

  await introTimeline.then();
  await waitForWelcome();

  const revealTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
  });

  revealTimeline
    .to(intro, { opacity: 0, duration: 0.8, delay: 0.2 })
    .set(intro, { display: "none" })
    .to(pageShell, { opacity: 1, duration: 0.6 }, "-=0.2");

  const titleLines = gsap.utils.toArray(".hero-title-line");
  const nonTitleItems = gsap.utils.toArray(".hero-description, .hero-actions");

  if (titleLines.length > 0) {
    revealTimeline.set(titleLines, { opacity: 0 });

    const addTitleBeat = (line, animationIn, animationOut, hold = 1.4) => {
      revealTimeline
        .set(line, { ...animationIn, opacity: 0 })
        .to(line, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
        })
        .to(line, {}, `+=${hold}`)
        .to(line, {
          opacity: 0,
          ...animationOut,
          duration: 0.6,
          ease: "power2.inOut",
        });
    };

    addTitleBeat(titleLines[0], { x: -64, y: 0 }, { x: 18, y: 0 }, 1.55);
    addTitleBeat(titleLines[1], { x: 0, y: 54 }, { x: 0, y: -18 }, 1.55);
    addTitleBeat(titleLines[2], { x: -20, y: 24 }, { x: 0, y: -20 }, 1.95);
  }

  if (nonTitleItems.length > 0) {
    revealTimeline.from(
      nonTitleItems,
      {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
      },
      "-=0.15",
    );
  }

  await revealTimeline.then();

  if (hasHash) {
    const target = document.querySelector(initialHash);
    if (target) {
      target.scrollIntoView({ block: "start" });
    }

    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${initialHash}`);
  }
};

runOpeningSequence();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      gsap.to(entry.target, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
      });
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -60px 0px",
  },
);

revealItems.forEach((item) => observer.observe(item));

const initMagneticButton = (button) => {
  if (!button || prefersReducedMotion) {
    return;
  }

  button.addEventListener("mousemove", (event) => {
    const bounds = button.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;

    gsap.to(button, {
      x,
      y,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  });

  button.addEventListener("mouseleave", () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  });
};




const toggleHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 30);

  if (lightHeaderSections.length === 0) {
    return;
  }

  const headerProbe = header.offsetHeight * 0.7;
  const isOnLightSection = lightHeaderSections.some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= headerProbe && rect.bottom >= headerProbe;
  });

  header.classList.toggle("is-on-light", isOnLightSection);
};

toggleHeaderState();
window.addEventListener("scroll", toggleHeaderState, { passive: true });
window.addEventListener("load", () => ScrollTrigger.refresh());

/* ── Cinema gallery: parallax + Ken Burns slow zoom + stagger reveal ── */
if (!prefersReducedMotion) {
  const cinemaFrames = gsap.utils.toArray(".project-cinema-frame");

  cinemaFrames.forEach((frame, i) => {
    const img = frame.querySelector("img");
    if (!img) return;

    /* Parallax — image drifts slower than scroll */
    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    /* Ken Burns — slow zoom plays when image enters viewport */
    gsap.fromTo(img,
      { scale: 1.06 },
      {
        scale: 1,
        duration: 10,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top 90%",
          toggleActions: "play none none reset",
        },
      }
    );

    /* Stagger fade-up reveal */
    gsap.fromTo(frame,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: frame,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        delay: i < 3 ? i * 0.12 : 0,
      }
    );
  });
}
