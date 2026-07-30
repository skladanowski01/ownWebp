document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicjalizacja Lenis (Smooth Scroll)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Pobranie elementów DOM
  const menuToggleBtn = document.getElementById("menuToggle");
  const fullscreenMenu = document.getElementById("fullscreenMenu");
  const menuItems = document.querySelectorAll(".menu-item");

  let isMenuOpen = false;

  // 3. Oś czasu GSAP z animacją od-do (fromTo)
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
      {
        y: 80,
        opacity: 0,
      },
      {
        duration: 0.5,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=0.1"
    );

  // 4. Logika otwierania / zamykania menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      menuTimeline.play();
      menuToggleBtn.textContent = "Close";
      lenis.stop(); // Wstrzymuje przewijanie tła podczas otwartego menu
    } else {
      menuTimeline.reverse();
      menuToggleBtn.textContent = "Menu";
      lenis.start(); // Przywraca przewijanie tła
    }
  }

  // Nasłuchiwanie zdarzeń
  menuToggleBtn.addEventListener("click", toggleMenu);

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (isMenuOpen) toggleMenu();
    });
  });
});

// Wymuszenie odtworzenia wideo na urządzeniach mobilnych
const heroVideo = document.querySelector('.video-bg video');

if (heroVideo) {
  // Upewniamy się, że wideo jest wyciszone na poziomie właściwości DOM
  heroVideo.muted = true;

  const playPromise = heroVideo.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Autoplay zablokowany przez przeglądarkę mobilną:", error);
      // Opcjonalnie: dodaj klasę pokazującą statyczny obrazek
    });
  }
}