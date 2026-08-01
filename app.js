document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Inicjalizacja Lenis (Smooth Scroll)
  const lenis = new Lenis({
    duration: 4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Obsługa Pełnoekranowego Menu
  const menuToggleBtn = document.getElementById("menuToggle");
  const fullscreenMenu = document.getElementById("fullscreenMenu");
  const menuItems = document.querySelectorAll(".menu-item");

  let isMenuOpen = false;

  const menuTimeline = gsap.timeline({ paused: true });

  menuTimeline
    .to(fullscreenMenu, {
      duration: 0.4,
      opacity: 1,
      pointerEvents: "all",
      ease: "power2.inOut",
    })
    .fromTo(
      menuItems,
      { y: 80, opacity: 0 },
      { duration: 0.5, y: 0, opacity: 1, stagger: 0.1, ease: "power3.out" },
      "-=0.1"
    );

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      menuTimeline.play();
      menuToggleBtn.textContent = "Close";
      lenis.stop();
    } else {
      menuTimeline.reverse();
      menuToggleBtn.textContent = "Menu";
      lenis.start();
    }
  }

  menuToggleBtn.addEventListener("click", toggleMenu);
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // 3. Animacja sekcji "Oferta" (ScrollTrigger)
  const offerSection = document.querySelector(".offer-section");
  const offerTiles = document.querySelectorAll(".offer-tile");
  const offerTitle = document.querySelector(".offer-section h2");

  const offerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: offerSection,
      start: "top 75%",
      end: "bottom 20%",
      toggleActions: "play reverse play reverse",
    },
  });

  offerTimeline
    .to(offerSection, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    })
    .fromTo(
      offerTitle,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.2"
    )
    .to(
      offerTiles,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(1.7)",
      },
      "-=0.2"
    );

  // 4. LOGIKA MODALI
  const modalButtons = document.querySelectorAll("[data-modal]");
  let activeModal = null;
  let activeModalTimeline = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    activeModal = modal;
    const modalContent = modal.querySelector(".modal-content");

    // Zatrzymaj przewijanie tła
    lenis.stop();

    // Utwórz animację pojawiania się
    activeModalTimeline = gsap.timeline();
    activeModalTimeline
      .set(modal, { visibility: "visible", pointerEvents: "all" })
      .to(modal, { opacity: 1, duration: 0.3, ease: "power2.out" })
      .to(
        modalContent,
        { scale: 1, duration: 0.4, ease: "back.out(1.4)" },
        "-=0.2"
      );
  }

  function closeModal() {
    if (!activeModal) return;

    const modal = activeModal;
    const modalContent = modal.querySelector(".modal-content");

    gsap.timeline({
      onComplete: () => {
        gsap.set(modal, { visibility: "hidden", pointerEvents: "none" });
        activeModal = null;
        // Przywróć skrolowanie tylko jeśli menu nawigacyjne nie jest otwarte
        if (!isMenuOpen) lenis.start();
      },
    })
      .to(modalContent, { scale: 0.8, duration: 0.2, ease: "power2.in" })
      .to(modal, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.1");
  }

  // Otwieranie na kliknięcie przycisku oferty
  modalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-modal");
      openModal(modalId);
    });
  });

  // Zamykanie przyciskiem "X" lub kliknięciem w tło (overlay)
  document.querySelectorAll(".modal").forEach((modal) => {
    const closeBtn = modal.querySelector(".modal-close");
    const overlay = modal.querySelector(".modal-overlay");

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);
  });

  // Zamykanie klawiszem ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeModal) {
      closeModal();
    }
  });
});

// Wymuszenie odtworzenia wideo na urządzeniach mobilnych
const heroVideo = document.querySelector(".video-bg video");
if (heroVideo) {
  heroVideo.muted = true;
  const playPromise = heroVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Autoplay zablokowany przez przeglądarkę mobilną:", error);
    });
  }
}
// 5. ANIMACJA SEKCJI "O MNIE" (ScrollTrigger)
  const aboutSection = document.querySelector(".about-section");
  const aboutTitle = document.querySelector(".about-title");
  const aboutImgWrapper = document.querySelector(".about-image-wrapper");
  const aboutTexts = document.querySelectorAll(".about-lead, .about-description");

  const aboutTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: "top",
      end: "bottom",
      toggleActions: "play reverse play reverse",
    },
  });

  aboutTimeline
    .to(aboutSection, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    })
    .fromTo(
      aboutTitle,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.2"
    )
    .to(
      aboutImgWrapper,
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.4)",
      },
      "-=0.3"
    )
    .to(
      aboutTexts,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.4"
    );
    // 6. ANIMACJA STOPKI (ScrollTrigger)
  const footer = document.querySelector(".site-footer");
  const footerElements = document.querySelectorAll(".footer-cta, .footer-content, .footer-bottom");

  gsap.fromTo(
    footer,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footer,
        start: "top 100%",
        toggleActions: "play reverse play reverse",
      },
    }
  );

  gsap.fromTo(
    footerElements,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footer,
        start: "top 75%",
        toggleActions: "play reverse play reverse",
      },
    }
  );