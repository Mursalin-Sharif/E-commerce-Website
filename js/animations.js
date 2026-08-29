function initLandingAnimations() {
  if (typeof gsap === "undefined") return;
  const hero = document.querySelector(".hero__content");
  const cards = document.querySelectorAll(".feature-card");
  if (hero) {
    gsap.from(hero.children, {
      opacity: 0,
      y: 36,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }
  if (cards.length) {
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.08,
      delay: 0.35,
      ease: "power2.out",
    });
  }
}

let productAnimInitialized = false;

function initProductScrollAnimations(force) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    document.querySelectorAll(".product-card--animate").forEach((card) => {
      card.style.opacity = "1";
      card.style.transform = "none";
    });
    return;
  }
  if (productAnimInitialized && !force) return;
  productAnimInitialized = true;

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".product-card--animate");
  if (!cards.length) {
    productAnimInitialized = false;
    return;
  }

  cards.forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.fromTo(
      card,
      {
        opacity: 0,
        x: fromLeft ? -80 : 80,
        y: 24,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
        delay: (i % 4) * 0.06,
      }
    );
  });

  ScrollTrigger.refresh();
}

function initPageAnimations() {
  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page === "index.html" || page === "") {
    initLandingAnimations();
  }
  // Product scroll animations are started by pages after cards are rendered.
}

document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => initPageAnimations());
});
