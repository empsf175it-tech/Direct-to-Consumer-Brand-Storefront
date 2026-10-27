# Atelier Sutura — Lightweight Premium DTC Haute Couture Storefront
*Optimized for 8 GB RAM Performance with Cinematic 2.5D Motion & Focused Three.js*

An editorial, client-ready Direct-to-Consumer single-page luxury fashion & apparel storefront built strictly with **Semantic HTML5**, **Vanilla CSS3**, and **Vanilla JavaScript ES6+**, augmented with **GSAP & ScrollTrigger**, **CSS 3D Transforms**, and an isolated, high-efficiency **Three.js** 3D Talisman Studio.

**Zero React • Zero Node.js • Zero Heavy Build Pipelines • Pure Web Standards**

---

## ✦ Technology Stack & 8 GB RAM Performance Engineering

Built strictly according to lightweight, high-performance constraints for smooth execution even on resource-constrained 8 GB RAM laptops:

| Technology | Purpose | Performance Optimization Strategy |
| :--- | :--- | :--- |
| **HTML5 & Semantic Structure** | Structural hierarchy & accessibility | Single `<h1>`, semantic `<section>` and `<article>` tags, unique test IDs |
| **Vanilla CSS3 & CSS 3D** | Layout, typography, 2.5D depth & borders | GPU-accelerated `translate3d`, `perspective(1000px)`, animated rotating metallic conic-gradients, subtle holographic foil sheen (`mix-blend-mode: overlay`) |
| **Vanilla JavaScript ES6+** | Cart, checkout simulation, search/filter | Modular closures, zero external framework overhead, direct DOM bindings |
| **GSAP 3.12.5 & ScrollTrigger** | Cinematic hero text reveal & parallax | High-performance transform & opacity tweens; spring physics for magnetic buttons; zero layout-thrashing reflows |
| **Three.js r128 (Single Purpose)** | Interactive 3D Talisman Studio | **Essential 3D only**: 1 low-poly `TorusKnotGeometry` (<4000 vertices, 1 draw call per frame); pixel ratio clamped to `Math.min(devicePixelRatio, 1.5)`; **freezes render loops when offscreen via `IntersectionObserver`** and when browser tab is hidden (`visibilitychange`) |

---

## ✦ 2.5D Dimensional Experience & Micro-Interactions

Instead of relying on heavy real-time 3D scenes that cause garbage collection pauses on 8 GB systems, the storefront crafts a convincing **2.5D editorial experience** using CSS and motion:

1. **Cinematic Hero Entrance (GSAP Timeline)**
   - Staggered word-by-word reveal of the editorial headline.
   - Dual CTAs with magnetic hover attraction toward the user's cursor.
   - Layered floating hero cards with scroll-driven parallax offsets.

2. **2.5D Perspective Cards with Holographic Foil Sheen**
   - Perspective container (`perspective: 1000px`) tilting on mouse move with dynamic glare.
   - Subtle holographic hover reflection dynamically mapped to cursor coordinates (`--mouse-x`, `--mouse-y`).
   - Layered z-depth separation (`.layer-depth-1` to `.layer-depth-4` with `transform: translateZ(...)`) giving tactile depth between images, badges, and typography.
   - **All cards feature strictly center-aligned icons, typography, and buttons.**

3. **Animated Metallic Borders**
   - Fine, rotating antique brass and saffron light gradient borders (`@keyframes rotate-border`) applied to luxury cards.

4. **Curated Interactive 3D Metier Studio (Three.js)**
   - Located in Section 3 (*Our Story*), patrons can inspect the bespoke Atelier Talisman in real time.
   - 360° inertia drag rotation with touch and mouse support.
   - Instant material finish switcher:
     - **Florentine Brass** (Metallic brushed gold)
     - **Sukumo Indigo** (Deep indigo ceramic luster)
     - **Imperial Saffron** (Warm radiant terracotta gold)
   - Auto-spin toggle and camera angle reset.
   - Pauses rendering automatically the instant it leaves the viewport to preserve 100% CPU/GPU resources.

5. **Custom Cursor with Contextual Micro-Labels**
   - Lerped outer cursor ring that dynamically morphs and displays action labels:
     - `ROTATE` when hovering 3D canvases.
     - `LOOK` when hovering the Lookbook stage.
     - `VIEW` when hovering Quick-View and product buttons.

6. **Accessibility & Static Fallbacks**
   - Full `@media (prefers-reduced-motion: reduce)` support: disables GSAP timelines, continuous CSS animations, and Three.js auto-rotation, providing graceful static presentations.

---

## ✦ Brand Identity & Palette

- **Brand Name**: ATELIER SUTURA (Florence • Kyoto)
- **Motif**: Artisan needle, golden weft thread, and couture stitch marks.
- **Palette**:
  - **Midnight Indigo** (`#0F0E24`) — Primary Dark Architectural Surface
  - **Raw Silk Ivory** (`#F4EDE0`) — Light Textured Fabric Surface
  - **Burnt Saffron** (`#E08A2B`) — Primary Accent / Key Highlights
  - **Deep Oxblood** (`#5E1A24`) — Secondary Rich Accent
  - **Sage Linen** (`#A9B5A0`) — Soft Botanical Accent
  - **Antique Brass** (`#C9A24D`) — Fine Lines, Badges & Foil Sheen
- **Typography**: Editorial Display Serif (*Playfair Display*) paired with clean modern sans (*Manrope*), loaded via Google Fonts.

---

## ✦ Architecture & Sections (Strictly 4 Navigation Items)

1. **Home (`#home`)**
   - Brand preloader with SVG needle logo stroke-drawing animation.
   - Announcement ticker with rotating seasonal privileges.
   - Cinematic hero section with staggered typography reveals, magnetic buttons, floating 3D talisman widget, and 2.5D parallax cards.
   - Infinite marquee strip with handcrafted highlights.
   - 4 Featured Category 2.5D perspective cards (*Femme*, *Homme*, *Genderless*, *Leathercraft*).
   - Brand covenant / USP cards with centered typography and rotating light borders.
   - Interactive Lookbook chapter gallery across 5 Acts with palette chords and image mask reveals.
   - Live patron stats counters with viewport-triggered count-up animation.
   - Discerning patron testimonials carousel with customer portraits and verified acquisition badges.
   - Press endorsement strip (*Vogue*, *GQ*, *Monocle*, *Harper's Bazaar*).
   - Validated guild newsletter with immediate `SUTURA10` coupon reward.

2. **Collection (`#collection`)**
   - Multi-parameter filter bar: categories, sizes (XS–XL), color swatches, price range slider ($250–$850), and live search.
   - 3D perspective product cards with hover image swap, curated badge, and wishlist heart toggle.
   - **All cards strictly maintain center-aligned text and icons across mobile, tablet, and desktop views.**
   - Interactive Quick-View modal with thumbnail gallery, size & color selectors, quantity controls, and fabric provenance.
   - Slide-over Size & Fit Guide with both centimeters and inches measurement tables.
   - Slide-over **Cart Drawer** with live line items, free-shipping threshold bar ($250), privilege code validation, and Stripe checkout trigger.

3. **Our Story (`#story`)**
   - Heritage timeline (1988 Florence founding, 2014 Kyoto botanical dye pivot, 2026 direct-to-patron era).
   - **Interactive Metier Talisman Studio**: High-resolution sartorial sigil inspection with dynamic finish options (*Florentine Brass*, *Sukumo Indigo*, *Imperial Saffron*), micro-zoom, and 3D perspective tilt.
   - 5-step craft metier cards (*Draping*, *Botanical Fermentation*, *Hand Needlework*, *Tolerance Audit*, *Wax-Sealed Packaging*).
   - Circular sustainability and ecological materials breakdown.
   - Founders & master tailors 2.5D tilt cards with rotating borders.
   - FAQ accordion categorized by fit, courier, returns, and textile care.
   - Working contact inquiry form with validation, response feedback, flagship coordinates, and interactive map embed.
   - Instagram-style atelier diary grid featuring local images.

4. **Track Order (`#track-order`)**
   - **Guest Quick-Track**: Enter order ID (e.g. `SUT-89241` or `SUT-74192`) to view real-time courier timeline.
   - **Patron Vault Dashboard**:
     - Demo Account credentials preconfigured right on the form (`patron@ateliersutura.com` / `sartorial2026`).
     - Loyalty tier progress ring (*Artisan Guild — Gold Weft*).
     - 4 Metric cards: total commissions, active DHL dispatches, delivered items, allocation spend.
     - Orders management table with status filtering.
     - Comprehensive order detail drawer with item manifests, Stripe payment badges, printable VAT invoice receipts, and complimentary exchange requests.

---

## ✦ Getting Started (Zero Node.js Needed)

### 1. Direct Browser Launch
Simply open `index.html` in any modern web browser (Chrome, Safari, Edge, Firefox).

### 2. Optional Local Static Web Server
If you prefer running via a local static web server:
- **Python (built-in)**:
  ```bash
  python -m http.server 3000
  ```
- Or use VS Code's **Live Server** extension.

Then open `http://localhost:3000`.

---

## ✦ Centralized Customization (`site-data.js`)

All brand information, colors, contact details, social links, and catalog products live in a single centralized file:
- **File**: `site-data.js`
- To change brand name, edit `SITE_CONFIG.brand.name`.
- To adjust shipping threshold, edit `SITE_CONFIG.brand.freeShippingThreshold`.
- To add or modify garments, edit `SITE_CONFIG.products`.
- To update atelier locations, edit `SITE_CONFIG.contact.flagshipAddress`.
- To adjust mock orders or accounts, edit `SITE_CONFIG.demoUser` and `SITE_CONFIG.mockOrders`.

---

## ✦ Images & Strict Compliance Audit
- All 46 high-resolution images reside locally in `/assets/images/`.
- Zero external image CDNs or hotlinks are used.
- Every image is used exactly once across the site (verified in `images-manifest.md`).
