const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const buildingReveals = Array.from(document.querySelectorAll("[data-building-reveal]"));
let revealTicking = false;

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeNav = () => {
  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const syncBuildingReveals = () => {
  revealTicking = false;

  buildingReveals.forEach((reveal) => {
    const rect = reveal.getBoundingClientRect();
    const start = window.innerHeight * 0.88;
    const end = window.innerHeight * 0.18;
    const rawProgress = (start - rect.top) / (start - end);
    const progress = Math.min(1, Math.max(0, rawProgress));

    reveal.style.setProperty("--building-clip", `${(1 - progress) * 100}%`);
    reveal.style.setProperty("--building-opacity", progress.toFixed(3));
    reveal.style.setProperty("--outline-invert", (1 - progress).toFixed(3));
    reveal.style.setProperty("--lampion-opacity", progress.toFixed(3));
  });
};

const requestRevealSync = () => {
  if (!buildingReveals.length || revealTicking) {
    return;
  }

  revealTicking = true;
  window.requestAnimationFrame(syncBuildingReveals);
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeNav();
  }
});

window.addEventListener("scroll", () => {
  syncHeader();
  requestRevealSync();
}, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 1180) {
    closeNav();
  }
  requestRevealSync();
});

year.textContent = new Date().getFullYear();
syncHeader();
requestRevealSync();
