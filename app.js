document.addEventListener("DOMContentLoaded", () => {
  // --- KOD LENIS (Smooth Scroll) ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);


  // --- KOD MENU (z poprzednich kroków) ---
  const menuToggleBtn = document.getElementById("menuToggle");
  const fullscreenMenu = document.getElementById("fullscreenMenu");
  const menuItems = document.querySelectorAll(".menu-item");

  let isMenuOpen = false;

  const menuTimeline = gsap.timeline({ paused: true });

  menuTimeline
    .to(fullscreenMenu, {
      duration: 0.5,
      opacity: 1,
      pointerEvents: "all",
      ease: "power2.inOut",
    })
    .fromTo(
      menuItems,
      { y: 80, opacity: 0 },
      { duration: 0.5, y: 0, opacity: 1, stagger: 0.1, ease: "power3.out" },
      "-=0.2"
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


  // --- NOWY KOD: ANIMACJA STOPNIOWEGO ODSŁANIANIA SEO ---

  const seoSection = document.querySelector(".hero-content2");
  const seoItems = seoSection.querySelectorAll("h1, .hero__content-txt");

  // Tworzymy oś czasu GSAP skojarzoną z przewijaniem (ScrollTrigger)
  const seoTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: seoSection, // Przełącznik znajduje się w tej sekcji
      start: "top 80%",   // Animacja zaczyna się, gdy góra sekcji jest 80% od góry okna
      end: "top 50%",     // Animacja kończy się, gdy góra sekcji jest 50% od góry okna
      scrub: 1.5,        // "Płynne przewijanie": animacja podąża za scrollowaniem, z lekkim opóźnieniem (wartość w sekundy)
      // markers: true,  // Odkomentuj tę linię, aby zobaczyć znaczniki pomocnicze
    }
  });

  // Dodajemy kroki do osi czasu: otwarcie maski
  seoTimeline.to(seoItems, {
    duration: 1,
    opacity: 1, // Dodatkowe zabezpieczenie
    clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", // Otwarta maska
    stagger: 0.2, // Kolejne elementy pojawiają się po sobie
    ease: "power2.out",
  });

});

