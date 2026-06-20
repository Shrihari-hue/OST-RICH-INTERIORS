const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

function setupSignatureLightDrift() {
  if (prefersReducedMotion.matches || !finePointer.matches) {
    return;
  }

  const visual = document.querySelector(".signature-visual");

  if (!visual) {
    return;
  }

  const updateDrift = (event) => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const driftX = (x - 0.5) * 24;
    const driftY = (y - 0.5) * 18;
    const glowX = 18 + x * 64;
    const glowY = 16 + y * 52;

    visual.style.setProperty("--signature-drift-x", `${driftX.toFixed(2)}px`);
    visual.style.setProperty("--signature-drift-y", `${driftY.toFixed(2)}px`);
    visual.style.setProperty("--signature-glow-x", `${glowX.toFixed(2)}%`);
    visual.style.setProperty("--signature-glow-y", `${glowY.toFixed(2)}%`);
  };

  const resetDrift = () => {
    visual.style.removeProperty("--signature-drift-x");
    visual.style.removeProperty("--signature-drift-y");
    visual.style.removeProperty("--signature-glow-x");
    visual.style.removeProperty("--signature-glow-y");
  };

  visual.addEventListener("pointermove", updateDrift);
  visual.addEventListener("pointerleave", resetDrift);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSignatureLightDrift, { once: true });
} else {
  setupSignatureLightDrift();
}
