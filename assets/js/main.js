/* ==================================================================
   MAIN.JS – NM.MKT 2025 – VERSIÓN FINAL EMPROLIJADA + TODO FUNCIONAL
   Todo envuelto en DOMContentLoaded → seguro, ordenado y profesional
==================================================================== */

console.log("JS CARGADO – GLOW + SCROLL CASERO + DROPDOWN CON <a> REALES + CAROUSEL PRO 🚀");

document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================================
     1. NAVBAR + GLOW INDICATOR + ACTIVE STATE
  ==================================================================== */
  const navbarContainer = document.querySelector(".navbar-container");
  const glow = document.querySelector(".glow-indicator");
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll("section[id]");
  const navbar = document.querySelector(".navbar"); // Única declaración

  if (!navbarContainer || !glow || !navItems.length || !sections.length) {
    console.warn("Faltan elementos clave del navbar/glow");
  }

  const sectionToNavKey = {
    "inicio": "inicio",
    "nosotros": "nosotros",
    "branding": "servicios",
    "marketing-digital": "servicios",
    "diseno-grafico": "servicios",
    "produccion": "servicios",
    "desarrollo-web": "servicios",
    "clientes": "clientes",
    "contacto": "contacto",
  };

  function moveGlow(link) {
    if (!link) return;
    const linkRect = link.getBoundingClientRect();
    const contRect = navbarContainer.getBoundingClientRect();
    const centerX = linkRect.left - contRect.left + linkRect.width / 2;
    glow.style.left = `${centerX}px`;
    glow.style.width = `${Math.max(linkRect.width * 1.2, 80)}px`;
    glow.classList.add("active");
  }

  function setActiveNav(key) {
    navItems.forEach(item => {
      item.classList.toggle("active", item.dataset.section === key);
    });

    const activeItem = document.querySelector(".nav-item.active");
    if (navbar && activeItem) {
      if (key === "inicio") {
        navbar.classList.remove("small");
      } else {
        navbar.classList.add("small");
      }
      setTimeout(() => moveGlow(activeItem), 450);
    } else if (activeItem) {
      moveGlow(activeItem);
    }
  }

  /* ==================== NAVBAR MÓVIL – OCULTAR AL BAJAR, MOSTRAR AL SUBIR ==================== */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    if (window.innerWidth > 1023) {
      navbar?.classList.remove('hidden', 'visible');
      return;
    }

    const currentScroll = window.scrollY;

    if (currentScroll <= 0) {
      navbar?.classList.remove('hidden');
      navbar?.classList.add('visible');
    } else if (currentScroll > lastScroll && currentScroll > 100) {
      navbar?.classList.add('hidden');
      navbar?.classList.remove('visible');
    } else if (currentScroll < lastScroll) {
      navbar?.classList.remove('hidden');
      navbar?.classList.add('visible');
    }

    lastScroll = currentScroll;
  });

  /* ==================================================================
     2. SCROLL SUAVE + CLICK EN <a href="#">
  ==================================================================== */
  function smoothScrollTo(targetY, duration = 1000) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function easeOutQuint(t) {
      return 1 - Math.pow(1 - t, 5);
    }

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuint(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const currentSection = document.elementFromPoint(window.innerWidth / 2, 100);
        const section = currentSection?.closest("section[id]");
        if (section) {
          const navKey = sectionToNavKey[section.id];
          if (navKey) setActiveNav(navKey);
        }
      }
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const targetY = target.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(targetY, 1000);
        history.pushState(null, null, href);

        const sectionKey = this.dataset.section;
        if (sectionKey) setActiveNav(sectionKey);
      }
    });
  });

  /* ==================================================================
     3. INTERSECTION OBSERVER PARA ACTIVE NAV
  ==================================================================== */
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const navKey = sectionToNavKey[entry.target.id];
        if (navKey) setActiveNav(navKey);
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: "-15% 0px -15% 0px"
  });

  sections.forEach(sec => navObserver.observe(sec));

  /* ==================================================================
     4. INICIALIZACIÓN + RESIZE + HOVER GLOW
  ==================================================================== */
  const initial = document.querySelector(".nav-item.active") || document.querySelector('[data-section="inicio"]');
  if (initial) {
    setActiveNav(initial.dataset.section);
  } else if (navbar) {
    navbar.classList.remove("small");
  }

  window.addEventListener("resize", () => {
    const current = document.querySelector(".nav-item.active");
    if (current) moveGlow(current);
  });

  if (navbar) {
    navbar.addEventListener("mouseenter", () => {
      const current = document.querySelector(".nav-item.active");
      if (current && navbar.classList.contains("small")) {
        setTimeout(() => moveGlow(current), 50);
      }
    });

    navbar.addEventListener("mouseleave", () => {
      const current = document.querySelector(".nav-item.active");
      if (current && navbar.classList.contains("small")) {
        setTimeout(() => moveGlow(current), 450);
      }
    });
  }

  /* ==================================================================
     5. DROPDOWN HERO
  ==================================================================== */
  const heroDropdown = document.getElementById('heroDropdown');
  if (heroDropdown) {
    const trigger = heroDropdown.querySelector('.dropdown-trigger');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      heroDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!heroDropdown.contains(e.target)) {
        heroDropdown.classList.remove('active');
      }
    });

    heroDropdown.querySelectorAll('a.dropdown-item').forEach(link => {
      link.addEventListener('click', () => heroDropdown.classList.remove('active'));
    });
  }

  /* ==================================================================
     5.b HELPERS WHATSAPP + CONTACT FORM WIRING
     - Exponemos `openWhatsApp` en `window` para que los onclick en HTML funcionen.
     - Conectamos el botón de contacto para tomar el input `#mensaje-whatsapp`.
  ==================================================================== */
  window.openWhatsApp = function (phone, message) {
    try {
      const text = message || '';
      const url = 'https://wa.me/' + String(phone) + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    } catch (err) {
      console.error('openWhatsApp error', err);
      window.open('https://wa.me/' + String(phone), '_blank');
    }
  };

  const btnWhatsAppSend = document.getElementById('btn-whatsapp-send');
  if (btnWhatsAppSend) {
    btnWhatsAppSend.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.getElementById('mensaje-whatsapp');
      const raw = input && input.value ? input.value.trim() : '';
      const fallback = 'Hola NM.MKT! Me gustaría recibir información y una propuesta.';
      const message = raw || fallback;
      window.openWhatsApp('5493515074273', message);
    });
  }

  /* ==================================================================
     6. CAROUSEL NOSOTROS – ROBUSTO CON SWIPE + AUTOPLAY
  ==================================================================== */
  const carouselSection = document.querySelector('#nosotros');
  const carousel = document.querySelector('.carousel');
  const cards = document.querySelectorAll('.carousel-card');
  const screen = document.querySelector('.carroucel-container') || document.querySelector('.carousel-container');

  if (carousel && cards.length && screen) {
    let currentIndex = 0;
    let autoInterval = null;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
    }, { threshold: 0.3 }).observe(carouselSection);

    const goToSlide = (i) => {
      currentIndex = i;
      carousel.style.transform = `translateX(-${i * 20}%)`;
      cards.forEach((c, idx) => c.classList.toggle('active', idx === i));
    };

    const nextSlide = () => goToSlide((currentIndex + 1) % cards.length);

    const startAuto = () => {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(nextSlide, 8000);
    };

    const stopAuto = () => {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = null;
    };

    const handleStart = (e) => {
      isDragging = true;
      startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      prevTranslate = currentTranslate;
      stopAuto();
      carousel.style.transition = 'none';
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      const curX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      const diff = ((curX - startX) / screen.offsetWidth) * 100;
      currentTranslate = prevTranslate + diff;
      carousel.style.transform = `translateX(${currentTranslate}%)`;
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.transition = 'transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

      const movedBy = currentTranslate - prevTranslate;
      if (Math.abs(movedBy) > 8) {
        if (movedBy > 0) {
          currentIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
        } else {
          currentIndex = (currentIndex + 1) % cards.length;
        }
      }
      goToSlide(currentIndex);
      startAuto();
    };

    screen.addEventListener('pointerdown', handleStart);
    screen.addEventListener('pointermove', handleMove);
    screen.addEventListener('pointerup', handleEnd);
    screen.addEventListener('pointerleave', handleEnd);

    screen.addEventListener('click', (e) => {
      if (e.target.closest('.carousel-cta')) return;
      if (Math.abs(currentTranslate - prevTranslate) > 5) return;
      nextSlide();
      startAuto();
    });

    screen.addEventListener('mouseenter', stopAuto);
    screen.addEventListener('mouseleave', startAuto);

    goToSlide(0);
    startAuto();
  }

  /* ==================================================================
     7. REVEALS DE SECCIONES (branding, marketing, diseño, etc.)
  ==================================================================== */
  const brandingSection = document.querySelector('#branding');
  if (brandingSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.1 }).observe(brandingSection);
  }

  const marketingSection = document.querySelector('#marketing-digital');
  if (marketingSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
        const slider = entry.target.querySelector('.marketing-slider');
        if (slider) slider.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.3 }).observe(marketingSection);
  }

  const disenoSection = document.querySelector('#diseno-grafico');
  if (disenoSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting));
    }, { threshold: 0.3 }).observe(disenoSection);
  }

  const inicioSection = document.querySelector('#inicio');
  if (inicioSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting));
    }, { threshold: 0.1 }).observe(inicioSection);
  }

  const nosotrosSection = document.querySelector('#nosotros');
  if (nosotrosSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting));
    }, { threshold: 0.2 }).observe(nosotrosSection);
  }

  const produccionSection = document.querySelector('#produccion');
  if (produccionSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting));
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }).observe(produccionSection);
  }

  const desarrolloSection = document.querySelector('#desarrollo-web');
  const magicSwitch = document.getElementById('magic-switch');
  if (desarrolloSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
        if (entry.isIntersecting && magicSwitch) {
          setTimeout(() => magicSwitch.checked = true, 2400);
        } else if (magicSwitch) {
          magicSwitch.checked = false;
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }).observe(desarrolloSection);
  }

  const contactoSection = document.querySelector('#contacto');
  if (contactoSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          contactoSection.classList.add('visible');
        }
      });
    }, { threshold: 0.3 }).observe(contactoSection);
  }

  /* ==================================================================
     8. CLIENTES – CONTADORES + REVEAL RIGHT (UNA SOLA VEZ)
  ==================================================================== */
  const clientesLeftSection = document.querySelector('.clientes-left');
  if (clientesLeftSection) {
    const elementsToAnimate = [
      ...document.querySelectorAll('.stats-title'),
      ...document.querySelectorAll('.latam-small'),
      ...document.querySelectorAll('.latam-big'),
      ...document.querySelectorAll('.stat-label'),
      ...document.querySelectorAll('.stat-number')
    ];
    elementsToAnimate.forEach(el => el.classList.add('anim-item'));

    const esperar = ms => new Promise(r => setTimeout(r, ms));

    const animarEntrada = async (elem) => {
      if (!elem) return;
      elem.classList.add('anim-item');
      void elem.offsetHeight;
      elem.classList.add('active');
      await esperar(800);
    };

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const contarNumero = (elem, targetValue, isPercent = false, duracion = 3000) => {
      return new Promise(resolve => {
        let inicio = null;
        const step = (timestamp) => {
          if (!inicio) inicio = timestamp;
          const progreso = Math.min((timestamp - inicio) / duracion, 1);
          const valorActual = Math.floor(easeOutCubic(progreso) * targetValue);
          elem.textContent = isPercent ? valorActual + '%' : '+' + valorActual.toLocaleString('es-AR');
          if (progreso < 1) {
            requestAnimationFrame(step);
          } else {
            elem.textContent = isPercent ? targetValue + '%' : '+' + targetValue.toLocaleString('es-AR');
            resolve();
          }
        };
        requestAnimationFrame(step);
      });
    };

    const iniciarAnimacion = async () => {
      await animarEntrada(document.querySelector('.stats-title'));
      await animarEntrada(document.querySelector('.latam-small'));
      await animarEntrada(document.querySelector('.latam-big'));

      const items = document.querySelectorAll('.stat-item');
      for (const item of items) {
        const label = item.querySelector('.stat-label');
        const number = item.querySelector('.stat-number');

        await animarEntrada(label);

        const valorOriginal = number.textContent.trim();
        const valorFinal = parseInt(valorOriginal, 10);
        const esPorcentaje = number === document.querySelectorAll('.stat-number')[3];

        number.textContent = esPorcentaje ? '0%' : '+0';

        await animarEntrada(number);
        await contarNumero(number, valorFinal, esPorcentaje, 3000);
      }

      const clientesRight = document.querySelector('.clientes-right');
      if (clientesRight) clientesRight.classList.add('visible');
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          iniciarAnimacion();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(clientesLeftSection);
  }

  /* ==================================================================
     9. CONTADORES GLOBALES (likes + comments) – INFINITOS
  ==================================================================== */
  const likeCounter = document.querySelector(".like-counter");
  const heart = document.querySelector(".heart-icon");
  const commentCounter = document.querySelector(".comment-counter");

  if (likeCounter && heart) {
    let likes = 150000;
    setInterval(() => {
      likes += Math.floor(Math.random() * 4) + 1;
      const k = (likes / 1000).toFixed(1);
      likeCounter.innerHTML = k.replace(".", ".<span class='dec'>") + "</span>k";
      heart.style.animation = 'none';
      requestAnimationFrame(() => heart.style.animation = 'doubleTap 2s infinite');
    }, 1);
  }

  if (commentCounter) {
    let comments = 5000;
    setInterval(() => {
      comments += Math.floor(Math.random() * 5) + 1;
      const k = (comments / 1000).toFixed(1);
      commentCounter.innerHTML = k.replace(".", ".<span class='dec'>") + "</span>k";
    }, 1);
  }

  /* ==================================================================
     10. CAROUSEL VERTICAL (el IIFE que tenías)
  ==================================================================== */
  const track = document.getElementById("track");
  if (track) {
    const wrap = track.parentElement;
    const cards = Array.from(track.children);
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    let current = 0;
    let autoplayInterval;

    function center(i) {
      const card = cards[i];
      wrap.scrollTo({ top: card.offsetTop, behavior: "smooth" });
    }

    function toggleUI(i) {
      cards.forEach((c, k) => c.toggleAttribute("active", k === i));
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === cards.length - 1;
    }

    function activate(i, scroll = true) {
      if (i === current) return;
      current = i;
      toggleUI(i);
      if (scroll) center(i);
    }

    function go(step) {
      activate(Math.min(Math.max(current + step, 0), cards.length - 1));
    }

    function startAutoplay() {
      autoplayInterval = setInterval(() => activate((current + 1) % cards.length), 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    if (prev) prev.onclick = () => go(-1);
    if (next) next.onclick = () => go(1);

    wrap.addEventListener("mouseenter", stopAutoplay);
    wrap.addEventListener("mouseleave", startAutoplay);

    cards.forEach((card, i) => {
      card.addEventListener("mouseenter", () => matchMedia("(hover:hover)").matches && activate(i));
      card.addEventListener("click", () => activate(i));
    });

    toggleUI(0);
    center(0);
    startAutoplay();
  }

}); // ← Fin del DOMContentLoaded