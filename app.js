/**
 * Atelier Sutura — Main Application Logic (Vanilla JS, Zero Node.js)
 * High-performance 3D Tilt, Cart State, Stripe Test Simulation, Vault & Timeline
 */

(function () {
  'use strict';

  // State Management
  const state = {
    cart: JSON.parse(localStorage.getItem('atelier_cart_v1')) || [
      {
        id: 'sutura-overcoat-48 / M-Midnight Indigo',
        productId: 'sutura-overcoat',
        name: 'The Midnight Sutura Overcoat',
        subtitle: 'Double-faced virgin wool & raw silk lining',
        price: 680,
        size: '48 / M',
        color: 'Midnight Indigo',
        colorHex: '#0F0E24',
        image: 'assets/images/products/prod-1-main.webp',
        quantity: 1
      }
    ],
    wishlist: JSON.parse(localStorage.getItem('atelier_wishlist_v1')) || ['sutura-overcoat', 'pleated-silk-tunic'],
    promoCode: null,
    discountPercent: 0,
    user: JSON.parse(localStorage.getItem('atelier_user_v1')) || null,
    orders: JSON.parse(localStorage.getItem('atelier_orders_v1')) || SITE_CONFIG.orders,
    activeCategory: 'all',
    searchQuery: '',
    selectedSize: 'all',
    selectedColor: 'all',
    maxPrice: 850,
    sortBy: 'featured',
    lookbookIndex: 0,
    testimonialIndex: 0,
    selectedQuickViewProduct: null,
    quickViewSize: '',
    quickViewColor: null,
    quickViewQty: 1
  };

  // Save Cart to LocalStorage
  function saveCart() {
    localStorage.setItem('atelier_cart_v1', JSON.stringify(state.cart));
    updateCartBadge();
    renderCartDrawer();
  }

  // Toast Notification
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('active');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3600);
  }

  // Preloader
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const skipBtn = document.getElementById('skip-preloader');
    if (!preloader) return;

    function hidePreloader() {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 800);
    }

    if (sessionStorage.getItem('sutura_intro_played')) {
      preloader.style.display = 'none';
      return;
    }

    sessionStorage.setItem('sutura_intro_played', 'true');
    setTimeout(hidePreloader, 1600);
    if (skipBtn) skipBtn.addEventListener('click', hidePreloader);
  }

  // Scroll Progress & Active Nav Link Spy
  function initScrollSpy() {
    const progress = document.getElementById('scroll-progress');
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = ['home', 'collection', 'story', 'track-order'];

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (progress && docHeight > 0) {
        progress.style.width = (scrollY / docHeight) * 100 + '%';
      }

      if (header) {
        if (scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }

      // Check section in view
      let currentSection = 'home';
      const offset = 220;
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && scrollY + offset >= el.offsetTop) {
          currentSection = id;
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentSection) link.classList.add('active');
        else link.classList.remove('active');
      });
    }, { passive: true });
  }

  // Announcement Bar Rotation
  function initAnnouncement() {
    const el = document.getElementById('announcement-text');
    if (!el) return;
    const items = SITE_CONFIG.brand.announcement;
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % items.length;
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = items[idx];
        el.style.opacity = '1';
      }, 300);
    }, 4500);
  }

  // 3D Tilt Card Implementation (STRICT: Perspective + Holographic Sheen + 2.5D Depth)
  function init3DTilt(element) {
    if (!element) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // Touch fallback
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const card = element.querySelector('.tilt-card') || element;
    const glare = card.querySelector('.tilt-card-glare');
    const holo = card.querySelector('.tilt-card-holo');
    const maxTilt = 10;

    element.addEventListener('mousemove', (e) => {
      // Keep card steady when hovering or clicking interactive controls to prevent mouseup hit-test cancellation
      if (e.target.closest('.wishlist-btn, .reserve-piece-btn, button, a, input, select')) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -maxTilt;
      const rotY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      const pctX = ((x / rect.width) * 100).toFixed(1);
      const pctY = ((y / rect.height) * 100).toFixed(1);

      card.style.setProperty('--mouse-x', `${pctX}%`);
      card.style.setProperty('--mouse-y', `${pctY}%`);

      if (glare) {
        glare.style.background = `radial-gradient(circle 350px at ${pctX}% ${pctY}%, rgba(244, 237, 224, 0.22), transparent 80%)`;
        glare.style.opacity = '1';
      }
      if (holo) {
        holo.style.opacity = '1';
      }
    });

    element.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glare) glare.style.opacity = '0';
      if (holo) holo.style.opacity = '0';
    });

    // Instantly flatten card when mouse hovers interactive buttons to guarantee 2D hit-testing
    card.querySelectorAll('button, a, input, select').forEach(control => {
      control.addEventListener('mouseenter', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        if (glare) glare.style.opacity = '0';
        if (holo) holo.style.opacity = '0';
      });
    });
  }

  function applyAll3DTilts() {
    document.querySelectorAll('.tilt-card-wrapper').forEach(init3DTilt);
  }

  // Enhanced Custom Cursor with Micro-Interaction Labels
  function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    const label = document.querySelector('.custom-cursor-label');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;

      const target = e.target;
      const is3D = target.closest('canvas, .three-canvas-container');
      const isLookbook = target.closest('#lookbook-stage');
      const isTalisman = target.closest('#metier-talisman-stage, .talisman-card');
      const isInspect = target.closest('#inspect-lookbook-piece, .reserve-piece-btn');
      const isScrollTop = target.closest('.scroll-up-btn');
      const isClickable = target.closest('button, a, input, select, textarea, .tilt-card');

      if (is3D) {
        ring.classList.add('has-label');
        if (label) label.textContent = 'ROTATE';
      } else if (isLookbook) {
        ring.classList.add('has-label');
        if (label) label.textContent = 'LOOK';
      } else if (isTalisman) {
        ring.classList.add('has-label');
        if (label) label.textContent = 'SIGIL';
      } else if (isInspect) {
        ring.classList.add('has-label');
        if (label) label.textContent = 'VIEW';
      } else if (isScrollTop) {
        ring.classList.add('has-label');
        if (label) label.textContent = 'TOP';
      } else {
        ring.classList.remove('has-label');
        if (label) label.textContent = '';
        if (isClickable) ring.classList.add('active');
        else ring.classList.remove('active');
      }
    });

    // Smooth lerp for outer ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX - (ring.offsetWidth / 2)}px, ${ringY - (ring.offsetHeight / 2)}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  // Magnetic Button Engine (Buttery 60fps Attraction)
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.gsap) return;

    document.querySelectorAll('.magnetic-btn, .btn-primary, .btn-outline').forEach(btn => {
      const inner = btn.querySelector('.magnetic-btn-inner') || btn;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });

        if (inner !== btn) {
          gsap.to(inner, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.35)'
        });
        if (inner !== btn) {
          gsap.to(inner, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.35)'
          });
        }
      });
    });
  }

  // GSAP 3 & ScrollTrigger Orchestrator (60fps, 8 GB RAM Friendly)
  function initGSAPAnimations() {
    if (!window.gsap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Staggered Typography & Elements Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.from('.hero-badge', {
      y: -25,
      opacity: 0,
      duration: 0.8,
      delay: 0.15
    })
    .from('.hero-title .hero-word', {
      y: 55,
      opacity: 0,
      stagger: 0.08,
      duration: 1
    }, '-=0.5')
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.85
    }, '-=0.6')
    .from('.hero-ctas a', {
      y: 25,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-metrics > div', {
      y: 20,
      opacity: 0,
      stagger: 0.12,
      duration: 0.75
    }, '-=0.5')
    .from('.hero-main-card', {
      opacity: 0,
      scale: 0.94,
      y: 45,
      duration: 1.1
    }, '-=0.9')
    .from('.hero-macro-twill', {
      opacity: 0,
      x: -30,
      duration: 0.85
    }, '-=0.7');

    if (window.ScrollTrigger) {
      // Parallax on Floating Hero Elements
      gsap.to('.hero-macro-twill', {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      // Section Titles ScrollTrigger Fade & Slide Up
      gsap.utils.toArray('section').forEach(sec => {
        const title = sec.querySelector('h2');
        if (title) {
          gsap.from(title, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          });
        }
      });
    }
  }

  // Infinite Continuous Marquee Ticker Runner (Guaranteed 60fps motion in all environments)
  function initMarqueeScroll() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (!marqueeContent) return;

    marqueeContent.style.animation = 'marquee-scroll 28s linear infinite';
    marqueeContent.style.animationPlayState = 'running';

    let initialTransform = '';
    setTimeout(() => {
      initialTransform = window.getComputedStyle(marqueeContent).transform;
      setTimeout(() => {
        const nextTransform = window.getComputedStyle(marqueeContent).transform;
        if (initialTransform === nextTransform || nextTransform === 'none') {
          marqueeContent.style.animation = 'none';
          let xPos = 0;
          const pxPerFrame = 1.15;
          function loop() {
            xPos -= pxPerFrame;
            const singleSetWidth = marqueeContent.scrollWidth / 2;
            if (singleSetWidth > 0 && Math.abs(xPos) >= singleSetWidth) {
              xPos = 0;
            }
            marqueeContent.style.transform = `translate3d(${xPos}px, 0, 0)`;
            requestAnimationFrame(loop);
          }
          requestAnimationFrame(loop);
        }
      }, 350);
    }, 150);
  }

  // Luxury Smooth Drag & Wheel Horizontal Navigation for Tab Strips
  function initLuxeScrollbars() {
    const scrollers = document.querySelectorAll('.luxe-scrollbar, #lookbook-tabs');
    scrollers.forEach(slider => {
      if (slider.dataset.luxeScrollInitialized) return;
      slider.dataset.luxeScrollInitialized = 'true';

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let moved = false;

      slider.style.cursor = 'grab';

      // Mouse wheel horizontal translation
      slider.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && slider.scrollWidth > slider.clientWidth) {
          e.preventDefault();
          slider.scrollLeft += e.deltaY * 0.9;
        }
      }, { passive: false });

      // Click & Drag Momentum
      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        moved = false;
        slider.style.cursor = 'grabbing';
        slider.style.userSelect = 'none';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      const onStop = () => {
        if (!isDown) return;
        isDown = false;
        slider.style.cursor = 'grab';
        slider.style.removeProperty('user-select');
      };

      slider.addEventListener('mouseleave', onStop);
      slider.addEventListener('mouseup', onStop);

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.35;
        if (Math.abs(walk) > 4) moved = true;
        slider.scrollLeft = scrollLeft - walk;
      });

      // Prevent accidental button clicks when user was dragging
      slider.addEventListener('click', (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });
  }

  // Three.js Essential 3D Feature ("The Sutura Golden Sigil / Möbius Seal")
  // Lightweight, strictly isolated, zero CPU leak on 8 GB RAM machines
  function initThreeJSScenes() {
    if (!window.THREE) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Metier Talisman Specimen Studio (Dynamic Luxury Photography & Finish Switcher)
    initMetierTalismanStudio();

    function initMetierTalismanStudio() {
      const stage = document.getElementById('metier-talisman-stage');
      const talismanImg = document.getElementById('talisman-specimen-img');
      const talismanCard = document.getElementById('talisman-interactive-card');
      const titleEl = document.getElementById('talisman-title');
      const subtitleEl = document.getElementById('talisman-subtitle');
      const descEl = document.getElementById('talisman-desc');
      const specPoly = document.getElementById('spec-poly');
      const specMetal = document.getElementById('spec-metal');
      const specOrigin = document.getElementById('spec-origin');
      const specSeal = document.getElementById('spec-seal');
      const zoomBtn = document.getElementById('toggle-talisman-zoom');
      const consultBtn = document.getElementById('talisman-consult-btn');

      if (!stage || !talismanImg) return;

      const TALISMAN_DATA = {
        brass: {
          image: 'assets/images/story/talisman-brass.webp',
          title: 'Florentine Möbius Sigil',
          subtitle: 'Metier Metallurgy & Alchemy',
          desc: 'Every Sutura garment carries this individually struck talisman in antique Tuscan brass, numbered in correspondence with its archival ledger entry in Florence.',
          poly: 'Möbius Double-Weft Medallion',
          metal: 'Specular Luster 88%',
          metalColor: 'var(--color-antique-brass)',
          origin: 'Florence Foundries (Est. 1988)',
          seal: '#SUT-FLR-089 (Archival)'
        },
        indigo: {
          image: 'assets/images/story/talisman-indigo.webp',
          title: 'Sukumo Indigo Talisman',
          subtitle: 'Kyoto Urushi & Botanical Lacquer',
          desc: 'Botanical indigo fermented for 100 days with wood ash lye and hand-applied in 18 coats of deep sapphire urushi lacquer to an engraved bronze substrate.',
          poly: 'Möbius Wax-Resist Sigil',
          metal: 'Deep Indigo Patina 65%',
          metalColor: '#6385d4',
          origin: 'Kyoto Tokushima Guild',
          seal: '#SUT-KYO-042 (Fermentation Batch)'
        },
        saffron: {
          image: 'assets/images/story/talisman-saffron.webp',
          title: 'Imperial Saffron Gilt Medallion',
          subtitle: '24K Hand-Beaten Gold Leaf & Resin',
          desc: 'Struck in solid bronze and gilded with triple-refined 24k gold leaf suspended in organic Tuscan saffron petal lacquer for radiant luminescent depth.',
          poly: 'Imperial Sunburst Sigil',
          metal: 'Gilt Radiance 94%',
          metalColor: 'var(--color-burnt-saffron)',
          origin: 'San Gimignano Saffron Atelier',
          seal: '#SUT-SGM-016 (Guild Allocation)'
        }
      };

      // Attach 3D tilt effect
      init3DTilt(stage);

      // Finish switcher event listeners
      document.querySelectorAll('.talisman-finish-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.talisman-finish-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          const fKey = e.currentTarget.getAttribute('data-finish') || 'brass';
          const f = TALISMAN_DATA[fKey];
          if (!f) return;

          // Smooth crossfade image
          talismanImg.style.opacity = '0';
          talismanImg.style.transform = 'scale(0.96)';

          setTimeout(() => {
            talismanImg.src = f.image;
            talismanImg.alt = f.title;
            talismanImg.onload = () => {
              talismanImg.style.opacity = '1';
              talismanImg.style.transform = talismanCard?.classList.contains('zoomed') ? 'scale(1.68)' : 'scale(1)';
            };
          }, 150);

          // Update text details with micro-animation
          if (titleEl) {
            titleEl.style.opacity = '0';
            setTimeout(() => {
              titleEl.textContent = f.title;
              titleEl.style.opacity = '1';
            }, 120);
          }

          if (subtitleEl) subtitleEl.textContent = f.subtitle;
          if (descEl) {
            descEl.style.opacity = '0';
            setTimeout(() => {
              descEl.textContent = f.desc;
              descEl.style.opacity = '1';
            }, 120);
          }

          if (specPoly) specPoly.textContent = f.poly;
          if (specMetal) {
            specMetal.textContent = f.metal;
            specMetal.style.color = f.metalColor;
          }
          if (specOrigin) specOrigin.textContent = f.origin;
          if (specSeal) specSeal.textContent = f.seal;

          showToast(`Metier Finish: ${f.title}`);
        });
      });

      // Interactive Zoom toggle
      let isZoomed = false;
      const toggleZoom = () => {
        isZoomed = !isZoomed;
        if (talismanCard) talismanCard.classList.toggle('zoomed', isZoomed);
        if (zoomBtn) {
          const inner = zoomBtn.querySelector('.magnetic-btn-inner');
          if (inner) inner.textContent = isZoomed ? '🔍 Reset Normal View' : '🔍 Inspect Micro-Zoom';
        }
        const badge = document.getElementById('talisman-badge');
        if (badge) badge.innerHTML = isZoomed ? '<span>✦</span> Micro-Detail Active • Click to Reset' : '<span>✦</span> Click to Zoom • Move to Tilt';
      };

      talismanCard?.addEventListener('click', toggleZoom);
      zoomBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleZoom();
      });

      // Request Finish details consultation button
      consultBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const activeBtn = document.querySelector('.talisman-finish-btn.active');
        const finishName = activeBtn?.textContent?.trim() || 'Florentine Brass';
        showToast(`Concierge informed: ${finishName} bespoke finish inquiry noted.`);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          const inquiryField = document.getElementById('inquiry-message');
          if (inquiryField) {
            inquiryField.value = `I am inquiring about securing the ${finishName} talisman finish for my bespoke commission.`;
            inquiryField.focus();
          }
        }
      });
    }
  }


  // Render Categories (2.5D Animated Perspective Cards with Holographic Sheen)
  function renderFeaturedCategories() {
    const container = document.getElementById('categories-grid');
    if (!container) return;

    container.innerHTML = SITE_CONFIG.categories.map(cat => `
      <div class="tilt-card-wrapper" data-category="${cat.id}">
        <div class="tilt-card animated-border">
          <div class="tilt-card-glare"></div>
          <div class="tilt-card-holo"></div>
          <div class="tilt-card-shimmer"></div>
          <div class="tilt-card-stitch"></div>
          <div class="tilt-card-inner">
            <div class="img-mask-reveal layer-depth-1" style="position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 14px; overflow: hidden; margin-bottom: 1.25rem; border: 1px solid rgba(201,162,77,0.3);">
              <img src="${cat.image}" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
              <span style="position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 9999px; background: rgba(15,14,36,0.85); backdrop-filter: blur(8px); font-size: 0.65rem; text-transform: uppercase; color: var(--color-antique-brass); border: 1px solid rgba(201,162,77,0.3); font-weight: 700;">${cat.tag}</span>
            </div>
            <div class="layer-depth-2" style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: rgba(201,162,77,0.15); display: flex; align-items: center; justify-content: center; color: var(--color-antique-brass); margin-bottom: 0.5rem;">✦</div>
              <h3 class="font-serif" style="font-size: 1.25rem; font-weight: 500; margin-bottom: 0.35rem; color: #F4EDE0 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6);">${cat.name}</h3>
              <p style="font-size: 0.75rem; color: #DDD0BB !important; margin-bottom: 1.1rem; max-width: 220px; text-align: center; opacity: 0.95;">${cat.subtitle}</p>
            </div>
            <button class="category-explore-btn magnetic-btn layer-depth-3" data-cat="${cat.id}" style="padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(201,162,77,0.35); background: rgba(15,14,36,0.7); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--color-antique-brass); font-weight: 700;">
              <span class="magnetic-btn-inner">Explore Drop →</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.category-explore-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-cat');
        filterCategory(catId);
        const colEl = document.getElementById('collection');
        if (colEl) colEl.scrollIntoView({ behavior: 'smooth' });
      });
    });

    applyAll3DTilts();
    initMagneticButtons();
  }

  // Render USPs (Centered 2.5D Covenant Cards)
  function renderUSPs() {
    const container = document.getElementById('usps-grid');
    if (!container) return;

    container.innerHTML = SITE_CONFIG.usps.map(usp => `
      <div class="tilt-card-wrapper">
        <div class="tilt-card animated-border" style="background: rgba(21, 20, 51, 0.85);">
          <div class="tilt-card-glare"></div>
          <div class="tilt-card-holo"></div>
          <div class="tilt-card-shimmer"></div>
          <div class="tilt-card-stitch"></div>
          <div class="tilt-card-inner">
            <div class="layer-depth-1" style="width: 60px; height: 60px; border-radius: 50%; background: rgba(201,162,77,0.12); border: 1px solid rgba(201,162,77,0.4); display: flex; align-items: center; justify-content: center; color: var(--color-antique-brass); font-size: 1.4rem; margin-bottom: 1.25rem;">✦</div>
            <span class="layer-depth-2" style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: var(--color-burnt-saffron); font-weight: 700; margin-bottom: 0.35rem;">${usp.subtitle}</span>
            <h3 class="font-serif layer-depth-2" style="font-size: 1.15rem; font-weight: 500; margin-bottom: 0.6rem; color: #F4EDE0 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6);">${usp.title}</h3>
            <p class="layer-depth-2" style="font-size: 0.78rem; color: #DDD0BB !important; line-height: 1.6; max-width: 240px; text-align: center; opacity: 0.95;">${usp.description}</p>
          </div>
        </div>
      </div>
    `).join('');

    applyAll3DTilts();
  }

  // Render Lookbook (Photographic Editorial Showcase & Fully Functional Interactive Options)
  function renderLookbook() {
    const stage = document.getElementById('lookbook-stage');
    const tabs = document.getElementById('lookbook-tabs');
    if (!stage || !tabs) return;

    const look = SITE_CONFIG.lookbook[state.lookbookIndex];
    const prod = SITE_CONFIG.products.find(p => p.id === look.productId || p.name.toLowerCase() === look.featuredProduct.toLowerCase()) || SITE_CONFIG.products[0];

    // 1. Render Interactive Act Tabs
    tabs.innerHTML = SITE_CONFIG.lookbook.map((act, idx) => {
      const isActive = idx === state.lookbookIndex;
      return `
        <button class="lookbook-tab-btn magnetic-btn ${isActive ? 'active' : ''}" data-idx="${idx}" style="padding: 0.65rem 1.4rem; border-radius: 9999px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700; border: 1.5px solid ${isActive ? 'var(--color-antique-brass)' : 'rgba(201,162,77,0.35)'}; background: ${isActive ? 'var(--color-midnight-indigo)' : '#FAF7F2'}; color: ${isActive ? '#F4EDE0' : 'var(--color-midnight-indigo)'}; white-space: nowrap; box-shadow: ${isActive ? '0 4px 15px rgba(201,162,77,0.3)' : 'none'}; transition: all 0.25s ease;">
          <span class="magnetic-btn-inner"><span style="color: var(--color-burnt-saffron); margin-right: 4px;">✦ ${act.act}:</span> ${act.title}</span>
        </button>
      `;
    }).join('');

    // Smoothly scroll active tab strictly inside tabs container (never shifting page/window)
    const activeTab = tabs.querySelector('.lookbook-tab-btn.active');
    if (activeTab) {
      const scrollTarget = activeTab.offsetLeft - (tabs.clientWidth / 2) + (activeTab.clientWidth / 2);
      tabs.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
    // Guard: Prevent entire page from shifting horizontally
    if (window.scrollX !== 0 || document.documentElement.scrollLeft !== 0) {
      window.scrollTo(0, window.scrollY);
    }

    // 2. Render Stage with Real Editorial Photography and Interactive Options
    stage.innerHTML = `
      <div class="lookbook-stage-grid">
        <!-- Left: Real Editorial High-Fashion Photo Showcase -->
        <div class="lookbook-stage-image-col">
          <img src="${look.image}" alt="${look.title}" class="lookbook-stage-img" loading="eager">
          <div class="lookbook-stage-img-gradient"></div>
          
          <!-- Top Floating Act & Season Badge -->
          <div class="lookbook-floating-badge">
            <span>✦ ${look.act}</span>
            <span style="color: rgba(244,237,224,0.35);">•</span>
            <span style="color: #F4EDE0;">Autumn 2026 Chronicle</span>
          </div>

          <!-- Bottom Floating Carousel Controls & Act Dot Indicators -->
          <div class="lookbook-carousel-controls">
            <div style="display: flex; gap: 8px; align-items: center;">
              <button id="look-prev" class="magnetic-btn lookbook-nav-btn" aria-label="Previous Lookbook Act">
                <span class="magnetic-btn-inner">‹</span>
              </button>
              <button id="look-next" class="magnetic-btn lookbook-nav-btn" aria-label="Next Lookbook Act">
                <span class="magnetic-btn-inner">›</span>
              </button>
            </div>

            <!-- Chapter Jump Dots -->
            <div class="lookbook-dots-wrap">
              ${SITE_CONFIG.lookbook.map((_, i) => `
                <button class="look-dot-btn" data-idx="${i}" aria-label="Jump to Act ${i + 1}" style="width: ${i === state.lookbookIndex ? '20px' : '7px'}; height: 7px; border-radius: 9999px; background: ${i === state.lookbookIndex ? 'var(--color-burnt-saffron)' : 'rgba(244,237,224,0.35)'}; border: none; cursor: pointer; transition: all 0.3s ease; padding: 0;"></button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Editorial Narrative & Fully Functional Interactive Options -->
        <div class="lookbook-stage-narrative-col">
          <div class="lookbook-narrative-main">
            <!-- Location Pin -->
            <div class="lookbook-location-row">
              <span style="font-size: 0.9rem;">📍</span>
              <span class="lookbook-location-text">${look.location}</span>
            </div>

            <!-- Act Number -->
            <span class="lookbook-act-tag">${look.act}</span>
            
            <!-- Guaranteed Silk Ivory Radiant Act Title -->
            <h3 class="font-serif lookbook-title">
              ${look.title}
            </h3>

            <!-- Narrative Chronicle -->
            <p class="lookbook-narrative-desc">
              ${look.description}
            </p>

            <!-- Interactive Palette Chord Swatches -->
            <div class="lookbook-palette-card">
              <div class="lookbook-palette-header">
                <span class="lookbook-palette-title">Alchemical Palette Chord:</span>
                <span class="lookbook-palette-hint">Click swatch to copy tone</span>
              </div>
              <div class="lookbook-palette-swatches">
                ${look.palette.map(c => `
                  <button class="palette-swatch-btn" data-color="${c}" title="Tone: ${c}">
                    <span class="palette-color-circle" style="background: ${c};"></span>
                    <span class="palette-hex-code">${c}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Featured Piece Card & Action Options -->
          <div class="lookbook-featured-card">
            <div class="lookbook-featured-top">
              <div class="lookbook-featured-info">
                <span class="lookbook-featured-badge">Featured Sartorial Piece</span>
                <h4 class="font-serif lookbook-featured-name">${prod.name}</h4>
              </div>
              <div class="lookbook-featured-pricing">
                <span class="font-sans lookbook-featured-price">$${prod.price} USD</span>
                <span class="lookbook-featured-stock">● Limited Cut (${prod.stockCount} Available)</span>
              </div>
            </div>

            <!-- Fully Functional Action Options: Inspect Piece & Direct Reserve to Bag -->
            <div class="lookbook-featured-actions">
              <button class="btn-primary magnetic-btn" id="inspect-lookbook-piece">
                <span class="magnetic-btn-inner">Inspect Piece 👁</span>
              </button>
              <button class="magnetic-btn lookbook-reserve-btn" id="reserve-lookbook-piece">
                <span class="magnetic-btn-inner">Reserve Piece →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // 3. Attach Interactive Options Event Handlers
    // Tab Clicks
    tabs.querySelectorAll('.lookbook-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.lookbookIndex = parseInt(e.currentTarget.getAttribute('data-idx'));
        renderLookbook();
      });
    });

    // Dot Jump Indicators
    stage.querySelectorAll('.look-dot-btn').forEach(dot => {
      dot.addEventListener('click', (e) => {
        state.lookbookIndex = parseInt(e.currentTarget.getAttribute('data-idx'));
        renderLookbook();
      });
    });

    // Carousel Navigation
    document.getElementById('look-prev').addEventListener('click', () => {
      state.lookbookIndex = (state.lookbookIndex - 1 + SITE_CONFIG.lookbook.length) % SITE_CONFIG.lookbook.length;
      renderLookbook();
    });

    document.getElementById('look-next').addEventListener('click', () => {
      state.lookbookIndex = (state.lookbookIndex + 1) % SITE_CONFIG.lookbook.length;
      renderLookbook();
    });

    // Option 1: Inspect Piece (Opens Quick View modal)
    document.getElementById('inspect-lookbook-piece').addEventListener('click', () => {
      openQuickView(prod);
    });

    // Option 2: Reserve Piece (Directly adds to bag and opens bag drawer)
    document.getElementById('reserve-lookbook-piece').addEventListener('click', () => {
      addToCart(prod, prod.sizes[0], prod.colors[0], 1);
    });

    // Option 3: Interactive Palette Swatches Click-to-Copy
    stage.querySelectorAll('.palette-swatch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hex = e.currentTarget.getAttribute('data-color');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(hex);
        }
        showToast(`Atelier Palette Tone ${hex} copied`);
      });
    });

    initMagneticButtons();
    initLuxeScrollbars();
  }

  // Render Stats with Count-Up Animation
  function initStatsCounters() {
    const container = document.getElementById('stats-grid');
    if (!container) return;

    container.innerHTML = SITE_CONFIG.stats.map(s => `
      <div class="tilt-card-wrapper">
        <div class="tilt-card animated-border preserve-3d" style="background: rgba(21, 20, 51, 0.75);">
          <div class="tilt-card-glare"></div>
          <div class="tilt-card-holo"></div>
          <div class="tilt-card-shimmer"></div>
          <div class="tilt-card-stitch"></div>
          <div class="tilt-card-inner layer-depth-2">
            <div class="font-serif stat-number" data-target="${s.value}" style="font-size: 2.8rem; font-weight: 500; color: var(--color-silk-ivory); margin-bottom: 0.25rem;">
              0<span style="color: var(--color-burnt-saffron); font-size: 1.6rem;">${s.suffix}</span>
            </div>
            <h4 style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.22em; color: var(--color-antique-brass); font-weight: 700; margin-bottom: 0.4rem;">${s.label}</h4>
            <p style="font-size: 0.75rem; color: var(--color-silk-300); max-width: 200px;">${s.description}</p>
          </div>
        </div>
      </div>
    `).join('');

    applyAll3DTilts();

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        container.querySelectorAll('.stat-number').forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          const suffix = el.querySelector('span').outerHTML;
          let current = 0;
          const step = Math.ceil(target / 45);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.innerHTML = current.toLocaleString() + suffix;
          }, 30);
        });
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(container);
  }

  // Render Testimonials Carousel
  // Render Testimonials Carousel (Real Editorial Portraits & Interactive Patron Switcher)
  function renderTestimonials() {
    const container = document.getElementById('testimonials-card-container');
    if (!container) return;
    const t = SITE_CONFIG.testimonials[state.testimonialIndex];

    container.innerHTML = `
      <div class="tilt-card-wrapper" style="max-width: 760px; margin: 0 auto; position: relative;">
        <div class="tilt-card animated-border preserve-3d" style="padding: 1.25rem; background: var(--color-midnight-surface); border: 1px solid rgba(201,162,77,0.35); box-shadow: var(--shadow-luxe);">
          <div class="tilt-card-glare"></div>
          <div class="tilt-card-holo"></div>
          <div class="tilt-card-shimmer"></div>
          <div class="tilt-card-stitch"></div>
          <div class="tilt-card-inner layer-depth-2" style="padding: 2.5rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
            
            <!-- Real High-Fashion Editorial Patron Portrait -->
            <div style="position: relative; width: 90px; height: 90px; border-radius: 50%; overflow: hidden; border: 2.5px solid var(--color-antique-brass); margin-bottom: 1.25rem; box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 20px rgba(201,162,77,0.25);">
              <img src="${t.image}" alt="${t.author}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" loading="eager">
            </div>

            <!-- Five Gold Stars Rating -->
            <div style="display: flex; gap: 5px; color: var(--color-burnt-saffron); margin-bottom: 1.2rem; font-size: 1rem; text-shadow: 0 0 10px rgba(224,138,43,0.4);">
              ★★★★★
            </div>

            <!-- Testimonial Quote in Radiant Silk Ivory -->
            <p class="font-serif" style="font-size: 1.28rem; font-style: italic; font-weight: 300; max-width: 600px; line-height: 1.75; margin-bottom: 1.35rem; color: #F4EDE0 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.4);">
              &ldquo;${t.quote}&rdquo;
            </p>

            <!-- Author & Provenance -->
            <h4 class="font-serif" style="font-size: 1.2rem; margin-bottom: 0.25rem; color: #F4EDE0 !important;">${t.author}</h4>
            <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.22em; color: var(--color-antique-brass); font-weight: 700; margin-bottom: 1.2rem; display: block;">${t.role} • ${t.city}</span>
            
            <!-- Verified Acquisition Badge -->
            <div style="padding: 5px 14px; border-radius: 9999px; background: rgba(15,14,36,0.85); border: 1px solid rgba(201,162,77,0.3); font-size: 0.72rem; color: var(--color-sage-linen); margin-bottom: 1.75rem;">
              ✓ Verified Atelier Commission: <strong>${t.purchasedItem}</strong>
            </div>

            <!-- Patron Avatar Thumbnails Selector & Carousel Controls -->
            <div style="display: flex; align-items: center; gap: 14px; padding-top: 1rem; border-top: 1px solid rgba(201,162,77,0.2); width: 100%; justify-content: center; flex-wrap: wrap;">
              <button id="test-prev" class="magnetic-btn" aria-label="Previous Patron Testimonial" style="width: 38px; height: 38px; border-radius: 50%; background: rgba(15,14,36,0.8); border: 1px solid rgba(201,162,77,0.4); color: #F4EDE0; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                <span class="magnetic-btn-inner">‹</span>
              </button>

              <div style="display: flex; gap: 10px; align-items: center;">
                ${SITE_CONFIG.testimonials.map((item, idx) => {
                  const isSel = idx === state.testimonialIndex;
                  return `
                    <button class="test-thumb-btn" data-idx="${idx}" title="${item.author}" style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: ${isSel ? '2px solid var(--color-burnt-saffron)' : '1.5px solid rgba(201,162,77,0.3)'}; box-shadow: ${isSel ? '0 0 12px rgba(224,138,43,0.5)' : 'none'}; opacity: ${isSel ? '1' : '0.65'}; transform: ${isSel ? 'scale(1.1)' : 'scale(1)'}; cursor: pointer; transition: all 0.25s ease; padding: 0; background: none;">
                      <img src="${item.image}" alt="${item.author}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                    </button>
                  `;
                }).join('')}
              </div>

              <button id="test-next" class="magnetic-btn" aria-label="Next Patron Testimonial" style="width: 38px; height: 38px; border-radius: 50%; background: rgba(15,14,36,0.8); border: 1px solid rgba(201,162,77,0.4); color: #F4EDE0; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                <span class="magnetic-btn-inner">›</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    // Event Handlers
    document.getElementById('test-prev')?.addEventListener('click', () => {
      state.testimonialIndex = (state.testimonialIndex - 1 + SITE_CONFIG.testimonials.length) % SITE_CONFIG.testimonials.length;
      renderTestimonials();
    });

    document.getElementById('test-next')?.addEventListener('click', () => {
      state.testimonialIndex = (state.testimonialIndex + 1) % SITE_CONFIG.testimonials.length;
      renderTestimonials();
    });

    container.querySelectorAll('.test-thumb-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.testimonialIndex = parseInt(e.currentTarget.getAttribute('data-idx'));
        renderTestimonials();
      });
    });

    init3DTilt(container.querySelector('.tilt-card-wrapper'));
    initMagneticButtons();
  }

  // Filter Category Handler
  function filterCategory(catId) {
    state.activeCategory = catId;
    document.querySelectorAll('.cat-pill').forEach(btn => {
      if (btn.getAttribute('data-cat') === catId) {
        btn.classList.add('active');
        btn.style.background = 'var(--color-midnight-indigo)';
        btn.style.color = 'var(--color-silk-ivory)';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'rgba(233, 223, 206, 0.6)';
        btn.style.color = 'var(--color-midnight-indigo)';
      }
    });
    renderProducts();
  }

  // Update Wishlist Badges
  function updateWishlistBadge() {
    const count = state.wishlist.length;
    document.querySelectorAll('.wishlist-count-badge, #wishlist-count-badge, #mobile-wishlist-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
    const pillBadge = document.getElementById('wishlist-pill-count');
    if (pillBadge) {
      pillBadge.textContent = count;
    }
  }

  // Toggle Wishlist
  function toggleWishlist(productId, btnEl) {
    const idx = state.wishlist.indexOf(productId);
    const prod = SITE_CONFIG.products.find(p => p.id === productId);
    const prodName = prod ? prod.name : 'Garment';
    let isSaved = false;

    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      isSaved = false;
      showToast(`Removed from private wishlist: ${prodName}`);
    } else {
      state.wishlist.push(productId);
      isSaved = true;
      showToast(`Saved to private wishlist: ${prodName}`);
    }
    localStorage.setItem('atelier_wishlist_v1', JSON.stringify(state.wishlist));
    updateWishlistBadge();

    // Synchronize all wishlist buttons on the page (cards and open modals)
    document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`).forEach(btn => {
      if (isSaved) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
        btn.setAttribute('title', 'Remove from wishlist');
        btn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px; pointer-events: none; fill: #f43f5e; stroke: #f43f5e; stroke-width: 2;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
        btn.style.transform = 'scale(1.35)';
        setTimeout(() => { btn.style.transform = ''; }, 250);
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Save to wishlist');
        btn.setAttribute('title', 'Save to wishlist');
        btn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px; pointer-events: none; fill: none; stroke: currentColor; stroke-width: 2;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
        btn.style.transform = 'scale(0.85)';
        setTimeout(() => { btn.style.transform = ''; }, 250);
      }
    });

    if (state.activeCategory === 'wishlist') {
      renderProducts();
    }
  }

  // Global bulletproof dispatchers for inline button onclick
  window.openQuickViewById = function (productId, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const prod = SITE_CONFIG.products.find(p => p.id === productId);
    if (prod) {
      openQuickView(prod);
    }
  };

  window.toggleWishlistById = function (productId, e, btnEl) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleWishlist(productId, btnEl);
  };

  // Render Product Catalog
  function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let filtered = SITE_CONFIG.products.filter(p => {
      if (state.activeCategory === 'wishlist') {
        if (!state.wishlist.includes(p.id)) return false;
      } else if (state.activeCategory !== 'all' && p.category !== state.activeCategory) {
        return false;
      }
      if (p.price > state.maxPrice) return false;
      if (state.selectedSize !== 'all' && !p.sizes.some(s => s.includes(state.selectedSize))) return false;
      if (state.selectedColor !== 'all' && !p.colors.some(c => c.name.toLowerCase().includes(state.selectedColor.toLowerCase()))) return false;
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    if (state.sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (state.sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (state.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    if (filtered.length === 0) {
      if (state.activeCategory === 'wishlist') {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem; color: #f43f5e;">♡</div>
            <h3 class="font-serif" style="font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--color-midnight-indigo);">Your Private Wishlist is Empty</h3>
            <p style="font-size: 0.85rem; color: rgba(15,14,36,0.7); margin-bottom: 1.5rem;">Click the heart icon on any silhouette in our collection to save your favorite pieces.</p>
            <button id="reset-filters-btn" class="btn-primary" style="padding: 0.8rem 1.6rem;">Explore All Works</button>
          </div>
        `;
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 1rem;">
            <h3 class="font-serif" style="font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--color-midnight-indigo);">No Silhouettes Found</h3>
            <p style="font-size: 0.85rem; color: rgba(15,14,36,0.7); margin-bottom: 1.5rem;">Adjust your price or palette filter to discover matching garments.</p>
            <button id="reset-filters-btn" class="btn-primary" style="padding: 0.8rem 1.6rem;">Reset Filters</button>
          </div>
        `;
      }
      document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.searchQuery = '';
        state.selectedSize = 'all';
        state.selectedColor = 'all';
        state.maxPrice = 850;
        const searchInput = document.getElementById('catalog-search');
        if (searchInput) searchInput.value = '';
        const priceSlider = document.getElementById('price-slider');
        if (priceSlider) priceSlider.value = 850;
        const priceVal = document.getElementById('price-val');
        if (priceVal) priceVal.textContent = '$850 USD';
        filterCategory('all');
      });
      return;
    }

    grid.innerHTML = filtered.map(prod => {
      const isFav = state.wishlist.includes(prod.id);
      return `
        <div class="tilt-card-wrapper" data-prod-id="${prod.id}">
          <div class="tilt-card animated-border">
            <div class="tilt-card-glare"></div>
            <div class="tilt-card-holo"></div>
            <div class="tilt-card-shimmer"></div>
            <div class="tilt-card-stitch"></div>
            <div class="tilt-card-inner">
              <!-- Image Container with Hover Swap -->
              <div class="img-mask-reveal" style="position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 14px; overflow: hidden; margin-bottom: 1.25rem; border: 1px solid rgba(201,162,77,0.3); background: var(--color-midnight-dark); transform: translateZ(0); pointer-events: auto;">
                <img src="${prod.mainImage}" alt="${prod.name}" class="prod-img-main" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.4s ease;" loading="lazy">
                <img src="${prod.hoverImage}" alt="${prod.name} hover detail" class="prod-img-hover" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.4s ease; pointer-events: none;" loading="lazy">
                
                ${prod.badge ? `<span style="position: absolute; top: 10px; left: 10px; padding: 4px 10px; border-radius: 9999px; background: var(--color-burnt-saffron); color: var(--color-midnight-indigo); font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; z-index: 20; pointer-events: none;">${prod.badge}</span>` : ''}
                
                <!-- Heart Icon Button (Wishlist) -->
                <button type="button" class="wishlist-btn ${isFav ? 'active' : ''}" onclick="window.toggleWishlistById('${prod.id}', event, this)" data-id="${prod.id}" aria-label="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}" title="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}">
                  <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; pointer-events: none; fill: ${isFav ? '#f43f5e' : 'none'}; stroke: ${isFav ? '#f43f5e' : 'currentColor'}; stroke-width: 2;">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              <!-- Center-Aligned Typography with 2.5D Elevation -->
              <div class="layer-depth-2" style="display: flex; flex-direction: column; align-items: center; width: 100%; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 4px; color: var(--color-antique-brass); font-size: 0.72rem; margin-bottom: 0.35rem;">
                  ★ <strong>${prod.rating}</strong> <span style="color: var(--color-silk-300);">(${prod.reviewCount})</span>
                </div>
                <h3 class="font-serif" style="font-size: 1.15rem; font-weight: 500; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; max-width: 100%; text-align: center; color: #F4EDE0 !important; text-shadow: 0 1px 4px rgba(0,0,0,0.6);">${prod.name}</h3>
                <p style="font-size: 0.72rem; color: #DDD0BB !important; margin-bottom: 0.6rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; max-width: 100%; text-align: center; opacity: 0.95;">${prod.subtitle}</p>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1.1rem; justify-content: center;">
                  <span class="font-sans" style="font-size: 1.05rem; font-weight: 700; color: var(--color-burnt-saffron);">$${prod.price} USD</span>
                  ${prod.compareAtPrice ? `<span style="font-size: 0.8rem; text-decoration: line-through; color: var(--color-silk-300);">$${prod.compareAtPrice}</span>` : ''}
                </div>
              </div>

              <button type="button" class="reserve-piece-btn magnetic-btn layer-depth-3" data-id="${prod.id}" style="width: 100%; max-width: 100%; box-sizing: border-box; padding: 0.8rem 0.5rem; border-radius: var(--radius-md); background: rgba(21, 20, 51, 0.85); border: 1px solid rgba(201,162,77,0.4); color: var(--color-silk-ivory); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; transition: all 0.2s;">
                <span class="magnetic-btn-inner">Reserve Piece</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Tilt & Hover Swap
    grid.querySelectorAll('.tilt-card-wrapper').forEach(wrapper => {
      init3DTilt(wrapper);

      const card = wrapper.querySelector('.tilt-card');
      const imgMain = card?.querySelector('.prod-img-main');
      const imgHover = card?.querySelector('.prod-img-hover');

      if (card && imgMain && imgHover) {
        card.addEventListener('mouseenter', () => {
          imgMain.style.opacity = '0';
          imgHover.style.opacity = '1';
        });
        card.addEventListener('mouseleave', () => {
          imgMain.style.opacity = '1';
          imgHover.style.opacity = '0';
        });
      }
    });

    // 1. Delegated listener on products-grid for click events
    if (!grid._delegatedBound) {
      grid._delegatedBound = true;
      grid.addEventListener('click', (e) => {
        const wishBtn = e.target.closest('.wishlist-btn');
        if (wishBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = wishBtn.getAttribute('data-id');
          toggleWishlist(id, wishBtn);
          return;
        }


        const reserveBtn = e.target.closest('.reserve-piece-btn');
        if (reserveBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = reserveBtn.getAttribute('data-id');
          const prod = SITE_CONFIG.products.find(p => p.id === id);
          if (prod) {
            addToCart(prod, prod.sizes[0], prod.colors[0], 1);
          }
          return;
        }
      });
    }


    grid.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleWishlist(id, btn);
      });
    });

    grid.querySelectorAll('.reserve-piece-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const prod = SITE_CONFIG.products.find(p => p.id === id);
        if (prod) {
          addToCart(prod, prod.sizes[0], prod.colors[0], 1);
        }
      });
    });

    updateWishlistBadge();
    initMagneticButtons();
  }

  // Quick View Modal
  function openQuickView(product) {
    if (!product) return;
    state.selectedQuickViewProduct = product;
    state.quickViewSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'Standard';
    state.quickViewColor = (product.colors && product.colors.length > 0) ? product.colors[0] : { name: 'Artisanal', hex: '#0F0E24' };
    state.quickViewQty = 1;

    const modal = document.getElementById('quickview-modal');
    const content = document.getElementById('quickview-content');
    if (!modal || !content) return;

    const isFav = state.wishlist.includes(product.id);

    content.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.2rem; align-items: start;">
        <div>
          <div style="position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 16px; overflow: hidden; border: 1px solid rgba(201,162,77,0.3); background: var(--color-midnight-dark); margin-bottom: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <img id="qv-main-img" src="${product.mainImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.25s ease;">
            
            ${product.badge ? `<span style="position: absolute; top: 12px; left: 12px; padding: 4px 12px; border-radius: 9999px; background: var(--color-burnt-saffron); color: var(--color-midnight-indigo); font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; z-index: 5;">${product.badge}</span>` : ''}

            <button class="wishlist-btn qv-wishlist-toggle ${isFav ? 'active' : ''}" data-id="${product.id}" aria-label="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}" title="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}" style="position: absolute; top: 12px; right: 12px; width: 38px; height: 38px; border-radius: 50%; background: rgba(15,14,36,0.9); backdrop-filter: blur(8px); border: 1px solid rgba(201,162,77,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
              <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; pointer-events: none; fill: ${isFav ? '#f43f5e' : 'none'}; stroke: ${isFav ? '#f43f5e' : 'currentColor'}; stroke-width: 2;">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          
          <!-- Image Thumbnails / Angle Switcher -->
          <div style="display: flex; gap: 12px; align-items: center;">
            <div class="qv-thumb-wrap active" data-src="${product.mainImage}" style="width: 68px; height: 85px; border-radius: 10px; overflow: hidden; border: 2px solid var(--color-burnt-saffron); cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
              <img src="${product.mainImage}" alt="${product.name} main" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="qv-thumb-wrap" data-src="${product.hoverImage}" style="width: 68px; height: 85px; border-radius: 10px; overflow: hidden; border: 2px solid rgba(201,162,77,0.3); opacity: 0.65; cursor: pointer; transition: all 0.2s;">
              <img src="${product.hoverImage}" alt="${product.name} detail" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span style="font-size: 0.7rem; color: var(--color-silk-300); text-transform: uppercase; letter-spacing: 0.1em; margin-left: 4px;">✦ Switch angle</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 4px; color: var(--color-antique-brass); font-size: 0.82rem;">
                ★ <strong>${product.rating}</strong> <span style="color: var(--color-silk-300);">(${product.reviewCount} patron reviews)</span>
              </div>
              <span style="font-size: 0.65rem; color: var(--color-burnt-saffron); font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;">Allocation: ${product.stockCount} Pieces Left</span>
            </div>

            <h2 class="font-serif" style="font-size: 1.85rem; line-height: 1.15; margin-bottom: 0.35rem; color: var(--color-silk-ivory);">${product.name}</h2>
            <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--color-antique-brass); margin-bottom: 1.1rem; font-weight: 600;">${product.subtitle}</p>
            
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem;">
              <span style="font-size: 1.6rem; font-weight: 800; color: var(--color-burnt-saffron); font-family: monospace;">$${product.price} USD</span>
              ${product.compareAtPrice ? `<span style="font-size: 0.95rem; text-decoration: line-through; color: var(--color-silk-300);">$${product.compareAtPrice} USD</span>` : ''}
              <span style="font-size: 0.68rem; padding: 3px 8px; border-radius: 4px; background: rgba(201,162,77,0.15); color: var(--color-antique-brass); border: 1px solid rgba(201,162,77,0.3);">Hand-Finished</span>
            </div>

            <p style="font-size: 0.85rem; color: var(--color-silk-200); line-height: 1.65; margin-bottom: 1.4rem;">${product.description}</p>
            
            <!-- Color Selector -->
            <div style="margin-bottom: 1.3rem;">
              <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--color-silk-300); margin-bottom: 0.5rem;">
                Palette: <strong id="qv-color-name" style="color: var(--color-silk-ivory);">${product.colors[0].name}</strong>
              </div>
              <div style="display: flex; gap: 10px;">
                ${product.colors.map((c, i) => `
                  <button class="qv-color-btn ${i === 0 ? 'selected' : ''}" data-name="${c.name}" data-hex="${c.hex}" title="${c.name}" style="width: 32px; height: 32px; border-radius: 50%; background: ${c.hex}; border: 2.5px solid ${i === 0 ? 'var(--color-burnt-saffron)' : 'rgba(201,162,77,0.35)'}; box-shadow: ${i === 0 ? '0 0 10px rgba(224,138,43,0.5)' : 'none'}; cursor: pointer; transition: all 0.2s;"></button>
                `).join('')}
              </div>
            </div>

            <!-- Size Selector -->
            <div style="margin-bottom: 1.3rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--color-silk-300);">Tailored Fit Size:</span>
                <button id="open-size-guide-qv" style="font-size: 0.72rem; color: var(--color-antique-brass); text-decoration: underline; background: none; border: none; cursor: pointer;">📏 View Size Guide</button>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${product.sizes.map((s, i) => `
                  <button class="qv-size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}" style="padding: 7px 16px; border-radius: 8px; font-size: 0.74rem; text-transform: uppercase; font-weight: 700; border: 1px solid ${i === 0 ? 'var(--color-burnt-saffron)' : 'rgba(201,162,77,0.35)'}; background: ${i === 0 ? 'var(--color-burnt-saffron)' : 'rgba(15,14,36,0.7)'}; color: ${i === 0 ? 'var(--color-midnight-indigo)' : 'var(--color-silk-ivory)'}; cursor: pointer; transition: all 0.2s;">
                    ${s}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Provenance & Delivery Card -->
            <div style="padding: 12px 16px; border-radius: 10px; background: rgba(15,14,36,0.65); border: 1px solid rgba(201,162,77,0.25); font-size: 0.74rem; color: var(--color-silk-200); margin-bottom: 1.6rem; display: flex; flex-direction: column; gap: 6px;">
              <div><strong style="color: var(--color-burnt-saffron);">Fabric Provenance:</strong> ${product.fabricOrigin}</div>
              <div><strong style="color: var(--color-antique-brass);">Dispatch Speed:</strong> ${product.leadTime} • Insured courier</div>
            </div>
          </div>

          <!-- Add to Cart Controls -->
          <div style="display: flex; gap: 14px; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(201,162,77,0.2);">
            <div style="display: flex; align-items: center; border: 1px solid rgba(201,162,77,0.45); border-radius: 9999px; padding: 4px 12px; background: var(--color-midnight-dark);">
              <button id="qv-qty-minus" aria-label="Decrease quantity" style="width: 26px; height: 26px; font-size: 1.1rem; color: var(--color-silk-300); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
              <span id="qv-qty-val" style="width: 32px; text-align: center; font-size: 0.85rem; font-weight: 800; color: var(--color-silk-ivory);">1</span>
              <button id="qv-qty-plus" aria-label="Increase quantity" style="width: 26px; height: 26px; font-size: 1.1rem; color: var(--color-silk-300); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
            </div>
            
            <button id="qv-add-cart-btn" class="btn-primary" style="flex: 1; padding: 0.95rem 1.4rem; font-size: 0.75rem; letter-spacing: 0.16em; font-weight: 800; text-transform: uppercase;">
              Reserve for Dispatch →
            </button>
          </div>
        </div>
      </div>
    `;

    // Quick View interactions
    content.querySelector('.qv-wishlist-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(product.id, e.currentTarget);
    });

    // Angle / thumbnail switcher
    content.querySelectorAll('.qv-thumb-wrap').forEach(wrap => {
      wrap.addEventListener('click', (e) => {
        content.querySelectorAll('.qv-thumb-wrap').forEach(t => {
          t.classList.remove('active');
          t.style.opacity = '0.65';
          t.style.borderColor = 'rgba(201,162,77,0.3)';
          t.style.boxShadow = 'none';
        });
        const current = e.currentTarget;
        current.classList.add('active');
        current.style.opacity = '1';
        current.style.borderColor = 'var(--color-burnt-saffron)';
        current.style.boxShadow = '0 0 12px rgba(224,138,43,0.4)';
        const src = current.getAttribute('data-src');
        const mainImg = document.getElementById('qv-main-img');
        if (mainImg) {
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = '1';
          }, 150);
        }
      });
    });

    // Palette switcher
    content.querySelectorAll('.qv-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        content.querySelectorAll('.qv-color-btn').forEach(b => {
          b.style.borderColor = 'rgba(201,162,77,0.35)';
          b.style.boxShadow = 'none';
        });
        e.currentTarget.style.borderColor = 'var(--color-burnt-saffron)';
        e.currentTarget.style.boxShadow = '0 0 10px rgba(224,138,43,0.5)';
        const name = e.currentTarget.getAttribute('data-name');
        const hex = e.currentTarget.getAttribute('data-hex');
        state.quickViewColor = { name, hex };
        const label = document.getElementById('qv-color-name');
        if (label) label.textContent = name;
      });
    });

    // Size switcher
    content.querySelectorAll('.qv-size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        content.querySelectorAll('.qv-size-btn').forEach(b => {
          b.style.background = 'rgba(15,14,36,0.7)';
          b.style.color = 'var(--color-silk-ivory)';
          b.style.borderColor = 'rgba(201,162,77,0.35)';
        });
        e.currentTarget.style.background = 'var(--color-burnt-saffron)';
        e.currentTarget.style.color = 'var(--color-midnight-indigo)';
        e.currentTarget.style.borderColor = 'var(--color-burnt-saffron)';
        state.quickViewSize = e.currentTarget.getAttribute('data-size');
      });
    });

    // Quantity selectors
    document.getElementById('qv-qty-minus')?.addEventListener('click', () => {
      if (state.quickViewQty > 1) {
        state.quickViewQty--;
        const val = document.getElementById('qv-qty-val');
        if (val) val.textContent = state.quickViewQty;
      }
    });

    document.getElementById('qv-qty-plus')?.addEventListener('click', () => {
      state.quickViewQty++;
      const val = document.getElementById('qv-qty-val');
      if (val) val.textContent = state.quickViewQty;
    });

    // Add to Cart
    document.getElementById('qv-add-cart-btn')?.addEventListener('click', () => {
      addToCart(product, state.quickViewSize, state.quickViewColor, state.quickViewQty);
      closeQuickView();
    });

    // Size Guide from QV
    document.getElementById('open-size-guide-qv')?.addEventListener('click', () => {
      openDrawer('size-guide-drawer');
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Backdrop and close button listener for Quick View Modal
  const qvModalOverlay = document.getElementById('quickview-modal');
  if (qvModalOverlay) {
    qvModalOverlay.addEventListener('click', (e) => {
      if (e.target === qvModalOverlay || e.target.closest('.close-modal-btn')) {
        closeQuickView();
      }
    });
  }

  // Add To Cart
  function addToCart(product, size, color, quantity = 1) {
    const id = `${product.id}-${size}-${color.name}`;
    const existing = state.cart.find(i => i.id === id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({
        id,
        productId: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        size,
        color: color.name,
        colorHex: color.hex,
        image: product.mainImage,
        quantity
      });
    }

    saveCart();
    showToast(`Added ${product.name} to cart`);
    openDrawer('cart-drawer');
  }

  // Update Cart Badge
  function updateCartBadge() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count-badge, #cart-count-badge, #mobile-cart-count-badge').forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });
  }

  // Render Cart Drawer
  function renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const shippingEl = document.getElementById('cart-shipping');
    const freeShipBar = document.getElementById('free-shipping-progress');
    const freeShipText = document.getElementById('free-shipping-text');
    if (!container) return;

    const rawSubtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = (rawSubtotal * state.discountPercent) / 100;
    const subtotal = rawSubtotal - discount;
    const threshold = SITE_CONFIG.brand.freeShippingThreshold;
    const isFreeShipping = subtotal >= threshold || rawSubtotal === 0;
    const shippingCost = isFreeShipping ? 0 : 25;
    const total = subtotal + (rawSubtotal > 0 ? shippingCost : 0);

    if (subtotalEl) subtotalEl.textContent = `$${rawSubtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = isFreeShipping ? 'Complimentary' : `$${shippingCost.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)} USD`;

    if (freeShipBar) {
      const pct = Math.min(100, (rawSubtotal / threshold) * 100);
      freeShipBar.style.width = pct + '%';
    }

    if (freeShipText) {
      if (rawSubtotal >= threshold) {
        freeShipText.textContent = '✓ Complimentary Express Courier Unlocked';
        freeShipText.style.color = 'var(--color-sage-linen)';
      } else {
        const remaining = threshold - rawSubtotal;
        freeShipText.textContent = `Add $${remaining.toFixed(0)} for Complimentary Global Express`;
        freeShipText.style.color = 'var(--color-silk-300)';
      }
    }

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <div style="margin-bottom: 1rem; display: flex; justify-content: center;">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--color-antique-brass)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.85;">
              <path d="M6 9H18L16.8 20.4C16.7 21.3 16 22 15.1 22H8.9C8 22 7.3 21.3 7.2 20.4L6 9Z"/>
              <path d="M9 9V6.5C9 4.84 10.34 3.5 12 3.5C13.66 3.5 15 4.84 15 6.5V9"/>
            </svg>
          </div>
          <h3 class="font-serif" style="font-size: 1.25rem; margin-bottom: 0.25rem;">Your Bag is Empty</h3>
          <p style="font-size: 0.78rem; color: var(--color-silk-300);">Explore our numbered autumn drop and reserve a piece.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = state.cart.map(item => `
      <div style="display: flex; gap: 12px; padding: 12px; border-radius: 12px; background: rgba(21, 20, 51, 0.7); border: 1px solid rgba(201,162,77,0.2); margin-bottom: 12px;">
        <div style="width: 70px; height: 85px; border-radius: 8px; overflow: hidden; background: #000; flex-shrink: 0;">
          <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <h4 class="font-serif" style="font-size: 0.85rem; font-weight: 500;">${item.name}</h4>
              <button class="remove-cart-item" data-id="${item.id}" style="color: var(--color-silk-300); font-size: 0.8rem; cursor: pointer;">✕</button>
            </div>
            <div style="font-size: 0.7rem; color: var(--color-silk-300); display: flex; gap: 8px; margin-top: 4px;">
              <span>${item.size}</span>
              <span>•</span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${item.colorHex}; display: inline-block;"></span>
                ${item.color}
              </span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <div style="display: flex; align-items: center; border: 1px solid rgba(201,162,77,0.3); border-radius: 9999px; padding: 2px 8px; background: var(--color-midnight-dark);">
              <button class="cart-qty-btn" data-id="${item.id}" data-action="minus" style="font-size: 0.85rem; color: var(--color-silk-300); padding: 0 4px;">-</button>
              <span style="font-size: 0.75rem; font-weight: 700; width: 20px; text-align: center;">${item.quantity}</span>
              <button class="cart-qty-btn" data-id="${item.id}" data-action="plus" style="font-size: 0.85rem; color: var(--color-silk-300); padding: 0 4px;">+</button>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-burnt-saffron);">$${item.price * item.quantity}</span>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        state.cart = state.cart.filter(i => i.id !== id);
        saveCart();
      });
    });

    container.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const action = e.currentTarget.getAttribute('data-action');
        const item = state.cart.find(i => i.id === id);
        if (item) {
          if (action === 'plus') item.quantity++;
          else if (action === 'minus') {
            item.quantity--;
            if (item.quantity <= 0) {
              state.cart = state.cart.filter(i => i.id !== id);
            }
          }
          saveCart();
        }
      });
    });
  }

  // Drawers Handling (Cart, Size Guide)
  function openDrawer(drawerId) {
    const overlay = document.getElementById('drawer-overlay');
    const panel = document.getElementById(drawerId);
    if (!overlay || !panel) return;
    document.querySelectorAll('.drawer-panel').forEach(p => p.classList.remove('active'));
    overlay.classList.add('active');
    panel.classList.add('active');
  }

  function closeAllDrawers() {
    const overlay = document.getElementById('drawer-overlay');
    if (overlay) overlay.classList.remove('active');
    document.querySelectorAll('.drawer-panel').forEach(p => p.classList.remove('active'));
  }

  // Stripe Checkout Simulation & Order Confirmation
  function handleStripeCheckout() {
    if (state.cart.length === 0) {
      showToast('Your bag is currently empty.');
      return;
    }

    const btn = document.getElementById('checkout-btn');
    if (btn) {
      btn.textContent = 'Redirecting to Stripe...';
      btn.disabled = true;
    }

    // High fidelity test mode checkout redirection
    setTimeout(() => {
      const orderId = 'SUT-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder = {
        orderId,
        userEmail: state.user ? state.user.email : 'patron@ateliersutura.com',
        date: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        estimatedDelivery: '3 to 4 Business Days via DHL Express',
        carrier: 'DHL Express Haute International',
        trackingNumber: 'DHL-EXP-' + Math.floor(1000000000 + Math.random() * 9000000000),
        status: 'In Transit',
        statusCode: 'in_transit',
        currentStepIndex: 2,
        totalAmount: state.cart.reduce((s, i) => s + i.price * i.quantity, 0),
        subtotal: state.cart.reduce((s, i) => s + i.price * i.quantity, 0),
        shippingCost: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentMethod: 'Stripe Checkout (Visa ending 4242)',
        paymentStatus: 'Paid & Verified',
        shippingAddress: {
          recipient: state.user ? state.user.name : 'Lady Eleanor Vance',
          street: '24 Kensington Palace Gardens',
          city: 'London',
          postcode: 'W8 4QQ',
          country: 'United Kingdom'
        },
        items: [...state.cart],
        timeline: [
          { title: 'Order Placed & Verified via Stripe', description: 'Payment confirmed with test card 4242.', time: 'Just Now', completed: true },
          { title: 'Florence Cutting Room Allocation', description: 'Pattern piece chalked and tailored by Master Cutter Matteo Rossi.', time: 'Today', completed: true },
          { title: 'Wax-Sealed Presentation Box', description: 'Enfolded in tissue and sealed with oxblood beeswax stamp.', time: 'Tomorrow', completed: false },
          { title: 'Dispatched via DHL Express Air', description: 'Departing Florence Hub (FLR).', time: 'Estimated in 2 Days', completed: false },
          { title: 'Doorstep Courier Delivery', description: 'Signed and delivered into patron care.', time: 'Estimated in 4 Days', completed: false }
        ]
      };

      state.orders.unshift(newOrder);
      localStorage.setItem('atelier_orders_v1', JSON.stringify(state.orders));
      state.cart = [];
      saveCart();
      closeAllDrawers();

      // Fire confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E08A2B', '#C9A24D', '#F4EDE0', '#0F0E24']
        });
      }

      showOrderConfirmation(newOrder);
      if (btn) {
        btn.textContent = 'Proceed to Checkout';
        btn.disabled = false;
      }
    }, 900);
  }

  function showOrderConfirmation(order) {
    const modal = document.getElementById('order-confirmation-modal');
    if (!modal) return;
    document.getElementById('conf-order-id').textContent = order.orderId;
    document.getElementById('conf-order-total').textContent = `$${order.totalAmount.toFixed(2)} USD`;
    document.getElementById('conf-carrier').textContent = order.carrier;
    modal.classList.add('active');
  }

  // Guest Quick Track Handler
  function initGuestTrack() {
    const form = document.getElementById('guest-track-form');
    const input = document.getElementById('guest-order-input');
    const resultBox = document.getElementById('guest-track-result');
    if (!form || !input || !resultBox) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim().toUpperCase();
      if (!val) {
        showToast('Please enter an Order Reference ID (e.g. SUT-89241)');
        return;
      }

      const order = state.orders.find(o => o.orderId.toUpperCase() === val);
      if (order) {
        renderOrderTimeline(order, resultBox);
        showToast(`Located order ${order.orderId}`);
      } else {
        resultBox.innerHTML = `
          <div style="padding: 1.5rem; text-align: center; color: #f87171; font-size: 0.8rem;">
            Order reference not found. Try demo order: <strong style="color: var(--color-antique-brass); cursor: pointer;" onclick="document.getElementById('guest-order-input').value='SUT-89241'">SUT-89241</strong>
          </div>
        `;
      }
    });
  }

  function renderOrderTimeline(order, targetContainer) {
    targetContainer.innerHTML = `
      <div style="padding: 1.5rem; border-radius: 16px; background: rgba(15,14,36,0.9); border: 1px solid rgba(201,162,77,0.3); margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--color-antique-brass); display: block;">Live Courier Dispatch</span>
            <h4 class="font-serif" style="font-size: 1.2rem;">${order.orderId}</h4>
            <span style="font-size: 0.72rem; color: var(--color-silk-300);">${order.carrier} (${order.trackingNumber})</span>
          </div>
          <span style="padding: 4px 12px; border-radius: 9999px; background: rgba(224,138,43,0.2); border: 1px solid var(--color-burnt-saffron); color: var(--color-burnt-saffron); font-size: 0.72rem; font-weight: 700;">
            ${order.status}
          </span>
        </div>

        <div style="position: relative; border-left: 2px solid rgba(201,162,77,0.3); margin-left: 10px; padding-left: 20px;">
          ${order.timeline.map(step => `
            <div style="position: relative; margin-bottom: 1.2rem;">
              <span style="position: absolute; left: -26px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: ${step.completed ? 'var(--color-burnt-saffron)' : 'var(--color-midnight-surface)'}; border: 2px solid ${step.completed ? 'var(--color-silk-ivory)' : 'rgba(201,162,77,0.4)'};"></span>
              <div style="display: flex; gap: 10px; align-items: baseline;">
                <strong style="font-size: 0.78rem; text-transform: uppercase; color: ${step.completed ? 'var(--color-silk-ivory)' : 'var(--color-silk-300)'};">${step.title}</strong>
                <span style="font-size: 0.68rem; font-family: monospace; color: var(--color-antique-brass);">${step.time}</span>
              </div>
              <p style="font-size: 0.72rem; color: var(--color-silk-300); margin-top: 2px;">${step.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Patron Vault / Dashboard
  function renderPatronVault() {
    const vaultView = document.getElementById('patron-vault-view');
    const loginPrompt = document.getElementById('patron-login-prompt');
    const navAccountBtn = document.getElementById('nav-account-btn');
    if (!vaultView || !loginPrompt) return;

    if (state.user) {
      vaultView.style.display = 'block';
      loginPrompt.style.display = 'none';
      document.querySelectorAll('#nav-account-btn, #mobile-account-btn').forEach(btn => {
        btn.textContent = state.user.name.split(' ')[0];
      });

      // Update User Details
      document.getElementById('vault-user-name').textContent = state.user.name;
      document.getElementById('vault-user-email').textContent = state.user.email;
      document.getElementById('vault-user-tier').textContent = state.user.loyaltyTier;
      document.getElementById('vault-user-points').textContent = state.user.loyaltyPoints.toLocaleString() + ' PTS';
      document.getElementById('vault-user-avatar').src = state.user.avatar;

      // Metric Counts
      document.getElementById('metric-total-orders').textContent = state.orders.length;
      document.getElementById('metric-in-transit').textContent = state.orders.filter(o => o.statusCode === 'in_transit').length;
      document.getElementById('metric-delivered').textContent = state.orders.filter(o => o.statusCode === 'delivered').length;
      document.getElementById('metric-total-spent').textContent = '$' + state.orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString();

      // Render Orders in Table
      const ordersContainer = document.getElementById('vault-orders-list');
      if (ordersContainer) {
        ordersContainer.innerHTML = state.orders.map(o => `
          <div style="padding: 1.25rem; border-radius: 14px; background: rgba(21, 20, 51, 0.7); border: 1px solid rgba(201,162,77,0.25); margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(201,162,77,0.15); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
              <div>
                <strong class="font-serif" style="font-size: 1.05rem;">${o.orderId}</strong>
                <span style="font-size: 0.7rem; color: var(--color-silk-300); display: block;">${o.formattedDate} • ${o.paymentMethod}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 0.95rem; font-weight: 700; color: var(--color-burnt-saffron);">$${o.totalAmount.toFixed(2)} USD</span>
                <span style="padding: 3px 10px; border-radius: 9999px; background: rgba(224,138,43,0.15); border: 1px solid var(--color-burnt-saffron); color: var(--color-burnt-saffron); font-size: 0.65rem; font-weight: 700; text-transform: uppercase;">${o.status}</span>
              </div>
            </div>
            <div style="font-size: 0.75rem; color: var(--color-silk-300); display: flex; justify-content: space-between; align-items: center;">
              <span>Carrier: ${o.carrier} (${o.trackingNumber})</span>
              <button class="view-vault-order-btn btn-outline" data-id="${o.orderId}" style="padding: 4px 12px; font-size: 0.68rem;">Inspect Details</button>
            </div>
          </div>
        `).join('');

        ordersContainer.querySelectorAll('.view-vault-order-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const o = state.orders.find(ord => ord.orderId === id);
            if (o) {
              const resBox = document.getElementById('guest-track-result');
              if (resBox) {
                renderOrderTimeline(o, resBox);
                resBox.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });
        });
      }
    } else {
      vaultView.style.display = 'none';
      loginPrompt.style.display = 'block';
      document.querySelectorAll('#nav-account-btn, #mobile-account-btn').forEach(btn => {
        btn.textContent = 'Sign In';
      });
    }
  }

  // Login / Logout
  function initAuth() {
    const modal = document.getElementById('auth-modal');
    const form = document.getElementById('auth-form');
    const demoFillBtn = document.getElementById('autofill-demo-btn');
    const navAccountBtn = document.getElementById('nav-account-btn');
    const loginPromptBtn = document.getElementById('prompt-login-btn');
    const logoutBtn = document.getElementById('vault-logout-btn');

    function openAuth() {
      if (modal) modal.classList.add('active');
    }

    function closeAuth() {
      if (modal) modal.classList.remove('active');
    }

    if (navAccountBtn) navAccountBtn.addEventListener('click', () => {
      if (state.user) {
        document.getElementById('track-order')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        openAuth();
      }
    });

    if (loginPromptBtn) loginPromptBtn.addEventListener('click', openAuth);
    document.querySelectorAll('.close-modal-btn').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }));

    if (demoFillBtn) {
      demoFillBtn.addEventListener('click', () => {
        document.getElementById('auth-email').value = 'patron@ateliersutura.com';
        document.getElementById('auth-password').value = 'sartorial2026';
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.user = SITE_CONFIG.demoUser;
        localStorage.setItem('atelier_user_v1', JSON.stringify(state.user));
        renderPatronVault();
        closeAuth();
        showToast(`Welcome back, ${state.user.name}`);
        document.getElementById('track-order')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        state.user = null;
        localStorage.removeItem('atelier_user_v1');
        renderPatronVault();
        showToast('You have been signed out.');
      });
    }
  }

  // Newsletter & Promo Code
  function initNewsletter() {
    const handleSub = (formId, inputId) => {
      const form = document.getElementById(formId);
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById(inputId);
        const val = input ? input.value.trim() : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!val || !emailRegex.test(val)) {
          showToast('Please enter a valid patron email.');
          return;
        }

        showToast('✦ Enrolled in Patron Register! 10% Code: SUTURA10');
        if (input) input.value = '';
        navigator.clipboard?.writeText('SUTURA10');
      });
    };

    handleSub('newsletter-form', 'newsletter-email');
    handleSub('footer-newsletter-form', 'footer-newsletter-email');
  }

  // Contact Form
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Transmission dispatched to Florence concierge.');
      form.reset();
    });
  }

  // Legal Modals in Footer
  function initLegalModals() {
    const modal = document.getElementById('legal-modal');
    const titleEl = document.getElementById('legal-modal-title');
    const bodyEl = document.getElementById('legal-modal-body');
    if (!modal || !titleEl || !bodyEl) return;

    document.querySelectorAll('.legal-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.getAttribute('data-type');
        if (type === 'privacy') {
          titleEl.textContent = 'Patron Privacy Protocol';
          bodyEl.innerHTML = `
            <p>Sutura S.r.l. adheres to rigorous European GDPR standards. We collect only necessary details required to hand-tailor and deliver your pieces. We never sell, lease, or distribute patron registers to commercial brokers.</p>
            <h4 class="font-serif" style="margin-top: 1rem; color: var(--color-antique-brass);">1. Data Confidentiality</h4>
            <p>All credit card transactions are handled via Stripe Checkout 256-bit SSL encryption. We never retain full card numbers on our servers.</p>
          `;
        } else if (type === 'terms') {
          titleEl.textContent = 'Sartorial Terms & Conditions';
          bodyEl.innerHTML = `
            <p>Welcome to Sutura. By commissioning an allocation from our numbered drops, you accept our bespoke crafting timeline and terms.</p>
            <h4 class="font-serif" style="margin-top: 1rem; color: var(--color-antique-brass);">1. Limited Runs</h4>
            <p>Each silhouette is strictly limited to 50–120 numbered units. Pieces are allocated strictly in order of confirmed reservation.</p>
          `;
        } else if (type === 'shipping') {
          titleEl.textContent = 'Global Courier & 30-Day Guarantee';
          bodyEl.innerHTML = `
            <p>All orders over $250 USD enjoy complimentary insured DHL Express delivery with doorstep signature verification.</p>
            <h4 class="font-serif" style="margin-top: 1rem; color: var(--color-antique-brass);">30-Day Bespoke Exchange</h4>
            <p>Experience your garment in the comfort of your home. If fit adjustment or exchange is desired, our concierge arranges complimentary return collection.</p>
          `;
        }
        modal.classList.add('active');
      });
    });
  }

  // Cookie Consent
  function initCookieConsent() {
    const banner = document.getElementById('cookie-consent-bar');
    const acceptBtn = document.getElementById('accept-cookie-btn');
    if (!banner || !acceptBtn) return;

    if (!localStorage.getItem('atelier_cookie_accepted')) {
      banner.style.display = 'block';
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('atelier_cookie_accepted', 'true');
      banner.style.display = 'none';
    });
  }

  // Master Initializer
  function init() {
    initPreloader();
    initScrollSpy();
    initAnnouncement();
    initCustomCursor();
    renderFeaturedCategories();
    renderUSPs();
    renderLookbook();
    initStatsCounters();
    renderTestimonials();
    renderProducts();
    updateCartBadge();
    renderCartDrawer();
    initGuestTrack();
    renderPatronVault();
    initAuth();
    initNewsletter();
    initContactForm();
    initLegalModals();
    initCookieConsent();
    initMagneticButtons();
    initGSAPAnimations();
    initMarqueeScroll();
    initThreeJSScenes();
    initLuxeScrollbars();

    // Drawer Open/Close Listeners
    document.getElementById('nav-cart-btn')?.addEventListener('click', () => openDrawer('cart-drawer'));
    document.getElementById('nav-wishlist-btn')?.addEventListener('click', () => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
      filterCategory('wishlist');
    });
    document.getElementById('close-cart-drawer')?.addEventListener('click', closeAllDrawers);
    document.getElementById('close-size-guide')?.addEventListener('click', closeAllDrawers);
    document.getElementById('drawer-overlay')?.addEventListener('click', closeAllDrawers);

    // Global Modal Backdrop Dismiss & Escape Key Listener
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        closeAllDrawers();
        document.body.style.overflow = '';
      }
    });

    // Size Guide trigger from collection
    document.getElementById('open-size-guide-filter')?.addEventListener('click', () => openDrawer('size-guide-drawer'));

    // Footer button triggers
    document.getElementById('footer-size-guide-btn')?.addEventListener('click', () => openDrawer('size-guide-drawer'));
    document.getElementById('footer-auth-btn')?.addEventListener('click', () => {
      document.getElementById('auth-modal')?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    document.getElementById('footer-cookie-trigger-btn')?.addEventListener('click', () => {
      const banner = document.getElementById('cookie-consent-bar');
      if (banner) banner.style.display = 'block';
    });

    // Promo code apply in cart
    document.getElementById('apply-promo-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      const code = document.getElementById('promo-input')?.value.trim().toUpperCase();
      if (code === 'SUTURA10' || code === 'ATELIER10') {
        state.discountPercent = 10;
        showToast('10% Patron Privilege Applied!');
        renderCartDrawer();
      } else {
        showToast('Invalid privilege code. Try SUTURA10');
      }
    });

    // Checkout button
    document.getElementById('checkout-btn')?.addEventListener('click', handleStripeCheckout);

    // Filter bar listeners
    document.getElementById('catalog-search')?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });

    document.getElementById('catalog-sort')?.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });

    document.getElementById('price-slider')?.addEventListener('input', (e) => {
      state.maxPrice = parseInt(e.target.value);
      document.getElementById('price-val').textContent = `$${state.maxPrice} USD`;
      renderProducts();
    });

    document.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-cat');
        filterCategory(cat);
      });
    });

    document.querySelectorAll('.size-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.size-chip').forEach(b => {
          b.style.background = 'rgba(233, 223, 206, 0.6)';
          b.style.color = 'var(--color-midnight-indigo)';
        });
        e.currentTarget.style.background = 'var(--color-midnight-indigo)';
        e.currentTarget.style.color = 'var(--color-silk-ivory)';
        state.selectedSize = e.currentTarget.getAttribute('data-size');
        renderProducts();
      });
    });

    document.querySelectorAll('.color-swatch-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-swatch-filter').forEach(b => b.style.outline = 'none');
        e.currentTarget.style.outline = '2px solid var(--color-burnt-saffron)';
        state.selectedColor = e.currentTarget.getAttribute('data-color');
        renderProducts();
      });
    });

    // Mobile Navigation Menu Toggle & Action Buttons
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu-overlay');
    const closeMobileBtn = document.getElementById('close-mobile-menu');

    function closeMobileMenuOverlay() {
      if (mobileMenu) mobileMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
      document.body.style.overflow = '';
    }

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      if (closeMobileBtn) {
        closeMobileBtn.addEventListener('click', closeMobileMenuOverlay);
      }

      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMobileMenuOverlay);
      });

      // 3 Action Buttons Kept Inside the Mobile Hamburger Menu
      document.getElementById('mobile-account-btn')?.addEventListener('click', () => {
        closeMobileMenuOverlay();
        if (state.user) {
          document.getElementById('track-order')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          document.getElementById('auth-modal')?.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });

      document.getElementById('mobile-wishlist-btn')?.addEventListener('click', () => {
        closeMobileMenuOverlay();
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
        filterCategory('wishlist');
      });

      document.getElementById('mobile-cart-btn')?.addEventListener('click', () => {
        closeMobileMenuOverlay();
        openDrawer('cart-drawer');
      });
    }

    // FAQ Accordion Interactive Toggle
    initFAQAccordion();

    function initFAQAccordion() {
      const faqItems = document.querySelectorAll('.faq-item');
      if (!faqItems.length) return;

      faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const isCurrentlyActive = item.classList.contains('active');

          // Close other accordion items for clean single-expanded view
          faqItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('active');
              other.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
            }
          });

          if (isCurrentlyActive) {
            item.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }

    // Floating Scroll Up button & Footer Back to Top button
    const scrollUpBtn = document.getElementById('scroll-to-top');
    const scrollProgressFill = document.getElementById('scroll-progress-fill');
    const circumference = 132;

    const handleScrollProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollMax = (document.documentElement.scrollHeight - window.innerHeight) || 1;

      if (scrollY > 300) {
        scrollUpBtn?.classList.add('visible');
      } else {
        scrollUpBtn?.classList.remove('visible');
      }

      if (scrollProgressFill) {
        const ratio = Math.min(Math.max(scrollY / scrollMax, 0), 1);
        const offset = circumference - (ratio * circumference);
        scrollProgressFill.style.strokeDashoffset = offset.toFixed(1);
      }
    };

    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    handleScrollProgress();

    scrollUpBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('back-to-top-btn')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
