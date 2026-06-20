const profiles = {
  "creative-direction": {
    kicker: "OST-RICH | Co-Founder",
    name: "Pruthvi Shetty",
    role: "The emotional author of the project",
    image: "/images/team/Pruthvi Shetty.png",
    body: [
      "This role sets the narrative pressure of the space: what kind of calm it should hold, how the first view should land, and where drama should remain restrained rather than obvious.",
      "It protects the original feeling of the concept through planning, references, palette definition, furniture language, and the final edit of what stays in the room and what leaves.",
      "For clients, this is the voice that keeps the project distinct. It ensures OST-RICH interiors do not drift into generic luxury, over-decoration, or trend-led confusion midway through execution.",
    ],
  },
  "material-direction": {
    kicker: "OST-RICH | Co-Founder",
    name: "Gautham Shetty",
    role: "The tactile intelligence behind the room",
    image: "/images/team/Gautham Shetty.png",
    body: [
      "Material direction turns atmosphere into something touchable. It brings stone, timber, metals, textiles, lighting, and furniture into one disciplined visual family rather than a collection of expensive pieces.",
      "Every surface is evaluated for tone, reflection, grain, softness, and the way it behaves in daylight versus evening light. That precision is what makes the room feel composed instead of simply filled.",
      "This layer is especially important for luxury work because restraint is difficult. The goal is richness without noise, depth without heaviness, and details that reward attention over time.",
    ],
  },
  "client-experience": {
    kicker: "OST-RICH | Co-Founder",
    name: "Shrihari",
    role: "The calm structure around the design process",
    image: "/images/team/Shrihari.png",
    body: [
      "Luxury projects need more than taste. They need steadiness. Client experience keeps the process legible, well-paced, and reassuring from the first briefing through approvals, site coordination, and final handover.",
      "This is where communication, scheduling, presentation clarity, and decision sequencing come together so the client always understands what is being explored, what is being finalized, and what requires action.",
      "The result is a process that feels polished rather than stressful, with the same level of control behind the scenes that the finished interiors express visually.",
    ],
  },
};

const modal = document.querySelector(".leadership-modal");
const modalDialog = document.querySelector(".leadership-modal-dialog");
const modalPortrait = document.querySelector(".leadership-modal-portrait");
const modalPortraitImage = document.querySelector(".leadership-modal-portrait-image");
const kicker = document.getElementById("leadership-modal-kicker");
const name = document.getElementById("leadership-modal-name");
const role = document.getElementById("leadership-modal-role");
const body = document.getElementById("leadership-modal-body");
const cards = document.querySelectorAll(".leadership-card");
const closeTriggers = document.querySelectorAll("[data-close-modal]");

if (modal && modalDialog && modalPortrait && modalPortraitImage && kicker && name && role && body && cards.length > 0) {
  let previousActiveElement = null;

  const openModal = (profileKey) => {
    const profile = profiles[profileKey];

    if (!profile) {
      return;
    }

    previousActiveElement = document.activeElement;
    kicker.textContent = profile.kicker;
    name.textContent = profile.name;
    role.textContent = profile.role;
    body.innerHTML = profile.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
    modalPortraitImage.src = profile.image;
    modalPortraitImage.alt = `${profile.name} portrait`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalDialog.focus();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus();
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      openModal(card.dataset.profile);
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}
