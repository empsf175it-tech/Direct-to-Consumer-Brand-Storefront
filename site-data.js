/**
 * Atelier Sutura — Centralized Brand & Catalog Configuration (Vanilla JS)
 * Florence • Kyoto — Haute Couture & Sartorial Weave
 */

const SITE_CONFIG = {
  brand: {
    name: "SUTURA",
    tagline: "The Art of the Stitched Silhouette",
    foundingYear: 1988,
    headquarters: "Florence, Italy",
    secondaryAtelier: "Kyoto, Japan",
    heroHeadline: "Haute Sartorial Weave & Hand-Stitched Form",
    heroSubheadline: "Crafted at the intersection of Florentine tailoring and Kyoto botanical dyeing. Every garment is cut individually, stitched with pure silk thread, and signed by its artisan.",
    announcement: [
      "Complimentary express courier & custom garment bag on orders over $250",
      "Autumn Sartorial Drop: Only 60 numbered pieces per silhouette",
      "Private fittings available at our Florence & Kyoto salons"
    ],
    freeShippingThreshold: 250,
    currencySymbol: "$"
  },
  contact: {
    email: "concierge@sutura.com",
    phone: "+39 055 892 4100",
    conciergeHours: "Monday – Saturday: 09:00 – 19:30 CET",
    flagshipAddress: {
      street: "14 Via de' Tornabuoni",
      city: "Firenze (Florence)",
      postalCode: "50123",
      country: "Italy",
      coordinates: "43.7714° N, 11.2505° E"
    },
    social: {
      instagram: "https://instagram.com/ateliersutura",
      pinterest: "https://pinterest.com/ateliersutura",
      x: "https://x.com/ateliersutura",
      journal: "#story"
    }
  },
  palette: {
    midnightIndigo: "#0F0E24",
    rawSilkIvory: "#F4EDE0",
    burntSaffron: "#E08A2B",
    oxblood: "#5E1A24",
    sageLinen: "#A9B5A0",
    antiqueBrass: "#C9A24D"
  },
  stats: [
    { label: "Discerning Patrons", value: 48500, suffix: "+", description: "Across Europe, Japan, North America & Oceania" },
    { label: "Garments Hand-Stitched", value: 142000, suffix: "+", description: "Individual needlework without assembly-line mass production" },
    { label: "Global Destinations", value: 64, suffix: " Nations", description: "Insured carbon-neutral climate packaging" },
    { label: "Patron Satisfaction", value: 4.96, suffix: "/5", description: "Audited post-delivery bespoke quality index" }
  ],
  usps: [
    {
      id: "fabrics",
      title: "Rare Botanical & Heritage Weaves",
      subtitle: "Uncompromising Provenance",
      description: "Every bolt is spun from Grade-6A raw mulberry silk, virgin Andean alpaca, and wild-harvested Japanese linen dyed with fermented indigo and madder root.",
      icon: "sparkles"
    },
    {
      id: "craft",
      title: "Hand-Numbered Individual Drops",
      subtitle: "Zero Mass Production",
      description: "We never over-produce. Each silhouette is limited to numbered runs of 50–120 pieces, finished with hand-carved horn buttons and antique brass seals.",
      icon: "scissors"
    },
    {
      id: "shipping",
      title: "Complimentary Global Express",
      subtitle: "Over $250 Worldwide",
      description: "Delivered inside custom breathable canvas garment covers and signature midnight indigo presentation cases via insured carbon-neutral DHL Express.",
      icon: "package-check"
    },
    {
      id: "returns",
      title: "30-Day Bespoke Exchange Privilege",
      subtitle: "Worry-Free Elegance",
      description: "Try your garment in the comfort of your home. If the drape or fit does not exceed expectations, our concierge arranges complimentary courier collection.",
      icon: "shield-check"
    }
  ],
  categories: [
    {
      id: "women",
      name: "Femme / Women",
      subtitle: "Architectural Draping & Structured Silk Silhouettes",
      image: "assets/images/categories/cat-women.webp",
      tag: "18 Pieces"
    },
    {
      id: "men",
      name: "Homme / Men",
      subtitle: "Deconstructed Tailoring & Double-Breasted Outerwear",
      image: "assets/images/categories/cat-men.webp",
      tag: "14 Pieces"
    },
    {
      id: "unisex",
      name: "Genderless Atelier",
      subtitle: "Fluid Cashmere Tunics & Minimalist Haori Wraps",
      image: "assets/images/categories/cat-unisex.webp",
      tag: "12 Pieces"
    },
    {
      id: "accessories",
      name: "Silk & Leathercraft",
      subtitle: "Tuscan Saddle Hide & Hand-Rolled Mulberry Scarves",
      image: "assets/images/categories/cat-accessories.webp",
      tag: "9 Pieces"
    }
  ],
  products: [
    {
      id: "sutura-overcoat",
      name: "The Midnight Sutura Overcoat",
      subtitle: "Double-faced virgin wool & raw silk lining",
      category: "men",
      price: 680,
      compareAtPrice: 780,
      rating: 4.98,
      reviewCount: 38,
      description: "An imposing yet weightless silhouette tailored from 100% Biella virgin wool in midnight indigo, lined with unbleached raw silk and fastened with hand-carved antique brass shank buttons.",
      details: [
        "Exterior: 100% Super 140s Biella virgin wool (480gsm)",
        "Lining: 100% raw mulberry silk twill with contrast hand-pick stitching",
        "Pockets: Concealed jet pockets with reinforced oxblood bar-tacks",
        "Hardware: Hand-cast solid brass buttons with Sutura needle insignia",
        "Numbered edition certificate signed by Master Cutter Matteo Rossi"
      ],
      fabricCare: [
        "Specialist dry clean only",
        "Steam gently on reverse side; never iron raw silk directly",
        "Store on provided cedarwood contoured coat hanger"
      ],
      sizes: ["46 / S", "48 / M", "50 / L", "52 / XL"],
      colors: [
        { name: "Midnight Indigo", hex: "#0F0E24" },
        { name: "Deep Oxblood", hex: "#5E1A24" }
      ],
      mainImage: "assets/images/products/prod-1-main.webp",
      hoverImage: "assets/images/products/prod-1-hover.webp",
      badge: "Bestseller",
      stockCount: 6,
      fabricOrigin: "Biella, Piedmont, Italy",
      leadTime: "Dispatches within 24 hours"
    },
    {
      id: "pleated-silk-tunic",
      name: "Raw Silk Pleated Sculptural Tunic",
      subtitle: "Botanical saffron dye & origami fold collar",
      category: "women",
      price: 420,
      compareAtPrice: 490,
      rating: 4.94,
      reviewCount: 29,
      description: "Hand-loomed wild tussah silk naturally tinted with saffron petals and gardenia. The asymmetrical micro-pleated neckline cascades gracefully across the collarbone.",
      details: [
        "100% Artisanal Wild Tussah Raw Silk",
        "Naturally dip-dyed using organic Tuscan saffron extract",
        "Architectural asymmetrical neckline with internal grosgrain stay",
        "French seams throughout with 18 stitches per inch",
        "Finished with mother-of-pearl discreet side buttons"
      ],
      fabricCare: [
        "Dry clean or hand wash cold with pH-neutral silk wash",
        "Line dry flat in shade away from direct sunlight",
        "Warm steam or iron with protective pressing cloth"
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Burnt Saffron", hex: "#E08A2B" },
        { name: "Raw Silk Ivory", hex: "#F4EDE0" }
      ],
      mainImage: "assets/images/products/prod-2-main.webp",
      hoverImage: "assets/images/products/prod-2-hover.webp",
      badge: "New Drop",
      stockCount: 12,
      fabricOrigin: "Kyoto, Kansai, Japan",
      leadTime: "Dispatches within 24 hours"
    },
    {
      id: "saffron-weft-blazer",
      name: "Saffron Weft Structured Draped Blazer",
      subtitle: "Sculpted hour-glass waist with antique brass bar pin",
      category: "women",
      price: 540,
      compareAtPrice: 620,
      rating: 4.97,
      reviewCount: 42,
      description: "The quintessential expression of modern couture. Structured canvas chest piece with a draped lapel that fastens with our signature antique brass stitching pin.",
      details: [
        "70% Fine Merino Wool, 30% Mulberry Silk",
        "Floating canvas front construction that moulds to the wearer",
        "Removable solid antique brass sculptural lapel pin included",
        "Dual ticket pockets and jetted flap pockets with oxblood accents",
        "Contrast cuff buttonhole stitched with Burnt Saffron silk"
      ],
      fabricCare: [
        "Specialist dry clean only",
        "Brush with soft horsehair clothes brush after wear",
        "Hang on contoured shoulder hanger"
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Burnt Saffron", hex: "#E08A2B" },
        { name: "Midnight Indigo", hex: "#0F0E24" }
      ],
      mainImage: "assets/images/products/prod-3-main.webp",
      hoverImage: "assets/images/products/prod-3-hover.webp",
      badge: "Atelier Exclusive",
      stockCount: 4,
      fabricOrigin: "Firenze, Tuscany, Italy",
      leadTime: "Dispatches within 24 hours"
    },
    {
      id: "sage-linen-kimono",
      name: "Sage Linen Artisanal Haori Cardigan",
      subtitle: "Unisex unlined draped wrap with self-tie sash",
      category: "unisex",
      price: 360,
      rating: 4.91,
      reviewCount: 24,
      description: "Cut generously from heavyweight Belgian flax linen, washed in thermal spring water for a velvety hand feel. Wear open as a relaxed coat or belted with the matching sash.",
      details: [
        "100% Certified Masters of Linen® Belgian Flax (340gsm)",
        "Washed with volcanic pumice and thermal spring water",
        "Seamless kimono-cut sleeve with underarm venting gusset",
        "Reinforced patch pockets with saddle stitching",
        "Includes matching 6cm wide sash with brass end-caps"
      ],
      fabricCare: [
        "Machine wash delicate at 30°C in mesh laundry bag",
        "Do not tumble dry; reshape damp and hang dry",
        "Embrace natural linen wrinkling as part of its character"
      ],
      sizes: ["1 / S-M", "2 / L-XL"],
      colors: [
        { name: "Sage Linen", hex: "#A9B5A0" },
        { name: "Raw Silk Ivory", hex: "#F4EDE0" }
      ],
      mainImage: "assets/images/products/prod-4-main.webp",
      hoverImage: "assets/images/products/prod-4-hover.webp",
      badge: "New Drop",
      stockCount: 9,
      fabricOrigin: "Flanders, Belgium",
      leadTime: "Dispatches within 24 hours"
    },
    {
      id: "botanical-indigo-trench",
      name: "Botanical Indigo A-Line Trench Coat",
      subtitle: "Eighteen-dip fermented natural indigo cotton-twill",
      category: "men",
      price: 720,
      compareAtPrice: 850,
      rating: 4.99,
      reviewCount: 31,
      description: "Dyed by hand eighteen times in live botanical indigo vats in Kyoto. The deep, rich indigo develops a breathtaking, personalized patina with every year of journeying.",
      details: [
        "100% Long-staple Egyptian cotton twill dipped in Sukumo indigo",
        "Storm flap and deep rear box pleat with button tab",
        "Removable throat latch with antique brass buckle",
        "Water-repellent beeswax and botanical resin finish",
        "Lined in lightweight sage linen chambray"
      ],
      fabricCare: [
        "Sponge clean with cold water; do not wash with detergents",
        "Allow to dry naturally away from radiators or direct sun",
        "Rewaxing service available through Sutura Concierge"
      ],
      sizes: ["48 / M", "50 / L", "52 / XL"],
      colors: [
        { name: "Midnight Indigo", hex: "#0F0E24" },
        { name: "Sage Linen", hex: "#A9B5A0" }
      ],
      mainImage: "assets/images/products/prod-5-main.webp",
      hoverImage: "assets/images/products/prod-5-hover.webp",
      badge: "Low Stock",
      stockCount: 3,
      fabricOrigin: "Tokushima & Kyoto, Japan",
      leadTime: "Dispatches within 24 hours"
    },
    {
      id: "oxblood-wool-jacket",
      name: "Oxblood Wool Cropped Sartorial Jacket",
      subtitle: "High-waist boxy silhouette with peak lapel",
      category: "women",
      price: 490,
      rating: 4.93,
      reviewCount: 19,
      description: "A fierce, precise jacket inspired by 1950s Florentine tailoring. Cut short to highlight high-waisted silhouettes, woven in dense oxblood cavalry twill.",
      details: [
        "100% Wool Cavalry Twill (410gsm)",
        "Pronounced structured shoulders with natural cotton padding",
        "Wide 11cm architectural peak lapel with Milanese hand buttonhole",
        "Interior breast pocket with passport security strap",
        "Silk-covered snap closures on front placket"
      ],
      fabricCare: [
        "Dry clean only",
        "Store in the provided Sutura canvas breathable suit bag",
        "Steam to refresh fibers between wears"
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Deep Oxblood", hex: "#5E1A24" },
        { name: "Midnight Indigo", hex: "#0F0E24" }
      ],
      mainImage: "assets/images/products/prod-6-main.webp",
      hoverImage: "assets/images/products/prod-6-hover.webp",
      stockCount: 8,
      fabricOrigin: "Biella, Italy",
      leadTime: "Dispatches within 24 hours"
    },
    {
      id: "pleated-silk-trousers",
      name: "Hand-Pleated Raw Silk Evening Trousers",
      subtitle: "Wide-leg fluid silhouette with side brass cinch tabs",
      category: "unisex",
      price: 340,
      rating: 4.89,
      reviewCount: 22,
      description: "Fluid motion personified. Double forward deep pleats fall into an immaculate drape, accompanied by side brass slide buckles that negate the need for a belt.",
      details: [
        "60% Raw Silk Noil, 40% Tencel Lyocell for drape memory",
        "Extended waistband with double hidden hook-and-bar closure",
        "Solid brass side waist adjusters with knurled grip",
        "Slanted front pockets and rear buttoned besom pockets",
        "Generous 5cm hem allowance for custom tailor length adjustments"
      ],
      fabricCare: [
        "Hand wash cold with delicate wool/silk detergent or dry clean",
        "Do not wring; roll in towel to extract moisture",
        "Iron on silk setting while slightly damp"
      ],
      sizes: ["30", "32", "34", "36"],
      colors: [
        { name: "Raw Silk Ivory", hex: "#F4EDE0" },
        { name: "Midnight Indigo", hex: "#0F0E24" },
        { name: "Sage Linen", hex: "#A9B5A0" }
      ],
      mainImage: "assets/images/products/prod-7-main.webp",
      hoverImage: "assets/images/products/prod-7-hover.webp",
      stockCount: 15,
      fabricOrigin: "Como, Lombardy, Italy",
      leadTime: "Dispatches within 24 hours"
    },
    {
      id: "brass-leather-portfolio",
      name: "Antique Brass Saddle Leather Portfolio",
      subtitle: "Vegetable-tanned Tuscan calfskin with linen saddle stitch",
      category: "accessories",
      price: 290,
      rating: 4.96,
      reviewCount: 47,
      description: "Crafted from 3.5mm full-grain Tuscan bridle leather that smells of oak bark and chestnut tannins. Stitched entirely by hand with waxed sage linen thread using twin needles.",
      details: [
        "Full-grain vegetable-tanned Vacchetta calfskin from Santa Croce",
        "Hand-saddle stitched with 5-cord waxed French linen thread",
        "Accommodates up to 16-inch laptops plus A4 documents",
        "Solid cast antique brass push-lock with engraved monogram plate",
        "Supplied with jar of natural beeswax conditioning balm"
      ],
      fabricCare: [
        "Wipe with damp cloth and allow to dry away from direct heat",
        "Apply Sutura beeswax conditioner once every six months",
        "Scratches and patina enhance its character over time"
      ],
      sizes: ["One Size (38cm × 27cm × 4cm)"],
      colors: [
        { name: "Antique Saddle Tan", hex: "#C9A24D" },
        { name: "Deep Oxblood", hex: "#5E1A24" }
      ],
      mainImage: "assets/images/products/prod-8-main.webp",
      hoverImage: "assets/images/products/prod-8-hover.webp",
      badge: "Bestseller",
      stockCount: 7,
      fabricOrigin: "Santa Croce sull'Arno, Tuscany, Italy",
      leadTime: "Dispatches within 24 hours"
    }
  ],
  lookbook: [
    {
      id: "act-1",
      act: "ACT I",
      title: "Shadows & Silk",
      location: "Rooftop Solarium, Florence",
      image: "assets/images/lookbook/look-1.jpg",
      description: "Midnight indigo drape catching twilight above the terracotta rooftops of Piazza del Duomo.",
      featuredProduct: "The Midnight Sutura Overcoat",
      productId: "sutura-overcoat",
      palette: ["#0F0E24", "#F4EDE0", "#E08A2B"]
    },
    {
      id: "act-2",
      act: "ACT II",
      title: "The Golden Weft",
      location: "Botanical Dye Garden, Kyoto",
      image: "assets/images/lookbook/look-2.jpg",
      description: "Raw wild tussah silk drying alongside ancient fermenting indigo vats under bamboo filtered light.",
      featuredProduct: "Raw Silk Pleated Sculptural Tunic",
      productId: "pleated-silk-tunic",
      palette: ["#E08A2B", "#F4EDE0", "#C9A24D"]
    },
    {
      id: "act-3",
      act: "ACT III",
      title: "Architectural Silhouette",
      location: "Brutalist Gallery, Milan",
      image: "assets/images/lookbook/look-3.jpg",
      description: "Sharp shoulder pads and lapels anchored with hand-forged antique brass fasteners.",
      featuredProduct: "Saffron Weft Structured Draped Blazer",
      productId: "saffron-weft-blazer",
      palette: ["#0F0E24", "#5E1A24", "#C9A24D"]
    },
    {
      id: "act-4",
      act: "ACT IV",
      title: "Sage & Unfinished Flax",
      location: "River Arno Embankment",
      image: "assets/images/lookbook/look-4.jpg",
      description: "Fluid unisex layering constructed with double French seams and natural horn fasteners.",
      featuredProduct: "Sage Linen Artisanal Haori Cardigan",
      productId: "sage-linen-kimono",
      palette: ["#A9B5A0", "#F4EDE0", "#0F0E24"]
    },
    {
      id: "act-5",
      act: "ACT V",
      title: "Midnight Solitude",
      location: "The Master Cutting Room, Florence",
      image: "assets/images/lookbook/look-5.jpg",
      description: "The moment before the scissors pierce the raw cloth. Pure intention captured in timeless indigo.",
      featuredProduct: "Botanical Indigo A-Line Trench Coat",
      productId: "botanical-indigo-trench",
      palette: ["#0F0E24", "#E08A2B", "#A9B5A0"]
    }
  ],
  craftProcess: [
    {
      step: "01",
      title: "Design & Architectural Draping",
      timeframe: "3 to 4 Weeks",
      description: "Every piece begins on a wooden mannequin rather than flat 2D paper. Elena Sutura drapes raw muslin by hand, pinning each fold until the silhouette creates natural tension and balance.",
      image: "assets/images/story/craft-design.webp",
      craftsman: "Elena Sutura (Creative Director)"
    },
    {
      step: "02",
      title: "Spinning & Botanical Fermentation",
      timeframe: "14 Days per Dye Batch",
      description: "Our yarn is dyed using living bacterial cultures: Sukumo indigo leaves fermented with wood ash lye, combined with wild saffron stamens for vibrant burnt ochre tones.",
      image: "assets/images/story/craft-fabric.webp",
      craftsman: "Kenji Takahashi (Master Dyer)"
    },
    {
      step: "03",
      title: "Individual Hand Cutting & Needlework",
      timeframe: "18 to 26 Hours per Coat",
      description: "No laser cutters or stacked patterns. Matteo Rossi chalks each panel individually on heavy wool or silk, shears the contours, and stitches with antique needle techniques.",
      image: "assets/images/story/craft-stitch.webp",
      craftsman: "Matteo Rossi (Head Tailor)"
    },
    {
      step: "04",
      title: "Bespoke Fitting Tolerance & Inspection",
      timeframe: "48-Point Audit",
      description: "Each completed garment undergoes a rigorous measurement protocol. Seam allowances, button tension, lining roll, and drape fall are checked against our master tolerances.",
      image: "assets/images/story/craft-quality.webp",
      craftsman: "Giulia Bellini (Quality Warden)"
    },
    {
      step: "05",
      title: "Presentation Boxing & Wax Seal Dispatch",
      timeframe: "Same-Day Courier",
      description: "Enfolded in unbleached acid-free tissue, placed inside our midnight indigo archival rigid box, and sealed with hot beeswax stamped with our thread-and-needle motif.",
      image: "assets/images/story/craft-ship.webp",
      craftsman: "Atelier Concierge Guild"
    }
  ],
  team: [
    {
      name: "Elena Sutura",
      role: "Founder & Creative Director",
      location: "Firenze, Italy",
      bio: "Trained in classical haute couture at the Accademia di Belle Arti di Firenze. Elena founded the atelier in 1988 with the vision of preserving Florentine sartorial architecture.",
      image: "assets/images/team/founder-elena.webp",
      signatureSpecialty: "Sculptural Draping & Silhouette Balance"
    },
    {
      name: "Kenji Takahashi",
      role: "Master Dyer & Botanical Alchemist",
      location: "Kyoto, Japan",
      bio: "Fourth-generation master of natural indigo fermentation from Tokushima. Kenji preserves 300-year-old Sukumo dyeing recipes that impart our textiles with unforgettable depth.",
      image: "assets/images/team/artisan-kenji.webp",
      signatureSpecialty: "18-Dip Natural Sukumo Fermentation"
    },
    {
      name: "Matteo Rossi",
      role: "Head of Sartorial Construction",
      location: "Firenze, Italy",
      bio: "With over 35 years behind the cutting shears in Savile Row and Florence, Matteo oversees the hand-canvasing and structure of every Sutura jacket and coat.",
      image: "assets/images/team/tailor-matteo.webp",
      signatureSpecialty: "Floating Canvas & Milanese Buttonholes"
    }
  ],
  testimonials: [
    {
      id: "test-1",
      author: "Lady Sophia Van Der Bilt",
      city: "Kensington, London",
      role: "Art Collector & Curator",
      quote: "The Midnight Sutura Overcoat feels unlike anything in contemporary luxury. The weight of the Biella wool combined with the raw silk lining creates an aura of dignified serenity.",
      rating: 5,
      image: "assets/images/testimonials/patron-sophia.jpg",
      purchasedItem: "The Midnight Sutura Overcoat (Size 48 / M)"
    },
    {
      id: "test-2",
      author: "Alexandre Chen",
      city: "Le Marais, Paris",
      role: "Architectural Designer",
      quote: "Finding an unlined linen haori cut with this level of structural precision is extraordinarily rare. The sage hue develops subtle nuances in changing morning light.",
      rating: 5,
      image: "assets/images/testimonials/patron-alexandre.jpg",
      purchasedItem: "Sage Linen Artisanal Haori Cardigan (Size 2)"
    },
    {
      id: "test-3",
      author: "Dr. Amara Okafor",
      city: "Tribeca, New York",
      role: "Biochemist & Patron of the Arts",
      quote: "The saffron-dyed silk tunic arrived within 48 hours to Manhattan in an exquisite wax-sealed case. The micro-pleats hold their form effortlessly throughout twelve-hour galas.",
      rating: 5,
      image: "assets/images/testimonials/patron-amara.jpg",
      purchasedItem: "Raw Silk Pleated Sculptural Tunic (Size S)"
    },
    {
      id: "test-4",
      author: "Marcus Lindqvist",
      city: "Östermalm, Stockholm",
      role: "Creative Director",
      quote: "The vegetable-tanned saddle portfolio has become an extension of my daily rituals. The hand saddle stitch and heavy brass hardware have aged with remarkable dignity.",
      rating: 5,
      image: "assets/images/testimonials/patron-marcus.jpg",
      purchasedItem: "Antique Brass Saddle Leather Portfolio"
    }
  ],
  press: [
    {
      publication: "VOGUE HAUTE",
      quote: "Sutura restores spiritual gravity to modern fashion with its uncompromising hand-stitched craft.",
      issue: "Autumn Couture Special Edition"
    },
    {
      publication: "GQ STYLE",
      quote: "The single greatest double-faced overcoat of the decade. Exceptional Florentine tailoring without the heritage cliché.",
      issue: "The Sartorial Masters Issue"
    },
    {
      publication: "MONOCLE",
      quote: "A blueprint for the conscious luxury house: zero mass production, botanical dyes, and lifetime garment stewardship.",
      issue: "Global Design & Craft Review"
    },
    {
      publication: "HARPER'S BAZAAR",
      quote: "Silhouettes that command silence. The marriage of Florentine structure with Kyoto indigo creates sheer poetry.",
      issue: "The Fashion Portfolio"
    }
  ],
  faqs: [
    {
      category: "Bespoke Sizing & Fit",
      question: "How do I choose my precise size across your silhouettes?",
      answer: "Our garments are tailored to traditional European sartorial proportions with generous seam allowances. We recommend consulting our interactive Size Guide drawer on any product page. If you are between sizes, our Concierge can advise you on chest, shoulder, and sleeve measurements."
    },
    {
      category: "Shipping & Courier",
      question: "Which countries do you deliver to and what are the shipping times?",
      answer: "We offer complimentary insured DHL Express courier worldwide on all orders exceeding $250. Deliveries within Europe arrive within 1–2 business days; North America and Asia within 2–4 business days. All shipments are fully carbon-neutral and include doorstep signature verification."
    },
    {
      category: "Returns & Exchanges",
      question: "What is your 30-Day Bespoke Guarantee return policy?",
      answer: "We want you to experience your Sutura garment in the comfort of your home. You may request a complimentary exchange or full refund within 30 days of receipt, provided the garment is unworn, in original condition, and with all security ribbons and seals intact."
    },
    {
      category: "Payment & Security",
      question: "Which payment methods are accepted and how is checkout secured?",
      answer: "All transactions are encrypted with bank-grade 256-bit SSL via Stripe Checkout. We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and major international cards. We do not store sensitive payment card details on our servers."
    },
    {
      category: "Textile Care & Longevity",
      question: "How should I maintain raw silk and botanical indigo textiles?",
      answer: "Every garment includes an archival care booklet. For our wool and raw silk silhouettes, specialist eco-dry cleaning or gentle steam refreshing is recommended. For natural indigo items, slight crocking is a hallmark of living botanical dyes and will stabilize with time."
    }
  ],
  demoUser: {
    id: "usr_sutura_demo",
    name: "Lady Eleanor Vance",
    email: "patron@ateliersutura.com",
    phone: "+1 (555) 392-8172",
    memberSince: "October 2023",
    loyaltyTier: "Artisan Guild — Gold Weft",
    loyaltyPoints: 2480,
    pointsToNextTier: 520,
    nextTier: "Imperial Weft Patron",
    avatar: "assets/images/testimonials/patron-sophia.jpg",
    savedAddresses: [
      {
        id: "addr_primary",
        title: "Primary Residence (London)",
        recipient: "Lady Eleanor Vance",
        street: "24 Kensington Palace Gardens",
        city: "London",
        postcode: "W8 4QQ",
        country: "United Kingdom",
        isDefault: true
      },
      {
        id: "addr_secondary",
        title: "Paris Salon",
        recipient: "Eleanor Vance",
        street: "18 Place des Vosges",
        city: "Paris",
        postcode: "75004",
        country: "France",
        isDefault: false
      }
    ]
  },
  orders: [
    {
      orderId: "SUT-89241",
      userEmail: "patron@ateliersutura.com",
      date: "2026-10-21T14:32:00Z",
      formattedDate: "October 21, 2026",
      estimatedDelivery: "October 25, 2026",
      carrier: "DHL Express Haute International",
      trackingNumber: "DHL-EXP-9402859182",
      status: "In Transit",
      statusCode: "in_transit",
      currentStepIndex: 3,
      totalAmount: 1220.00,
      subtotal: 1220.00,
      shippingCost: 0.00,
      discountAmount: 0.00,
      currency: "USD",
      paymentMethod: "Stripe Checkout (Visa ending 4242)",
      paymentStatus: "Paid & Verified",
      shippingAddress: {
        recipient: "Lady Eleanor Vance",
        street: "24 Kensington Palace Gardens",
        city: "London",
        postcode: "W8 4QQ",
        country: "United Kingdom"
      },
      items: [
        {
          productId: "sutura-overcoat",
          name: "The Midnight Sutura Overcoat",
          size: "48 / M",
          color: "Midnight Indigo",
          colorHex: "#0F0E24",
          price: 680.00,
          quantity: 1,
          image: "assets/images/products/prod-1-main.webp"
        },
        {
          productId: "saffron-weft-blazer",
          name: "Saffron Weft Structured Draped Blazer",
          size: "S",
          color: "Burnt Saffron",
          colorHex: "#E08A2B",
          price: 540.00,
          quantity: 1,
          image: "assets/images/products/prod-3-main.webp"
        }
      ],
      timeline: [
        {
          title: "Order Placed & Verified",
          description: "Payment confirmed via Stripe. Bespoke cut sheet dispatched to Florence atelier cutting room.",
          time: "Oct 21, 2026 — 14:32",
          completed: true
        },
        {
          title: "Hand-Cut & Canvased",
          description: "Garment panels verified by Master Cutter Matteo Rossi. Hand-canvasing and silk lining assembled.",
          time: "Oct 22, 2026 — 09:15",
          completed: true
        },
        {
          title: "Quality Certified & Wax-Sealed",
          description: "Passed 48-point tolerance inspection. Placed in midnight presentation box with wax seal.",
          time: "Oct 22, 2026 — 17:40",
          completed: true
        },
        {
          title: "Dispatched via DHL Express Air",
          description: "Departed Florence Hub (FLR) on flight AZ682 en route to London Heathrow (LHR).",
          time: "Oct 23, 2026 — 06:20",
          completed: true
        },
        {
          title: "Out for Courier Delivery",
          description: "Scheduled for white-glove doorstep delivery with signature verification.",
          time: "Estimated: Oct 25, 2026 — by 13:00",
          completed: false
        },
        {
          title: "Delivered into Patron Care",
          description: "Signed by patron. 30-Day Bespoke Exchange Privilege commences.",
          time: "Pending Delivery",
          completed: false
        }
      ]
    },
    {
      orderId: "SUT-74192",
      userEmail: "patron@ateliersutura.com",
      date: "2026-09-12T10:14:00Z",
      formattedDate: "September 12, 2026",
      estimatedDelivery: "September 15, 2026",
      carrier: "DHL Express Haute International",
      trackingNumber: "DHL-EXP-8172938491",
      status: "Delivered",
      statusCode: "delivered",
      currentStepIndex: 5,
      totalAmount: 420.00,
      subtotal: 420.00,
      shippingCost: 0.00,
      discountAmount: 0.00,
      currency: "USD",
      paymentMethod: "Stripe Checkout (Mastercard ending 8841)",
      paymentStatus: "Paid & Verified",
      shippingAddress: {
        recipient: "Lady Eleanor Vance",
        street: "24 Kensington Palace Gardens",
        city: "London",
        postcode: "W8 4QQ",
        country: "United Kingdom"
      },
      items: [
        {
          productId: "pleated-silk-tunic",
          name: "Raw Silk Pleated Sculptural Tunic",
          size: "S",
          color: "Burnt Saffron",
          colorHex: "#E08A2B",
          price: 420.00,
          quantity: 1,
          image: "assets/images/products/prod-2-main.webp"
        }
      ],
      timeline: [
        {
          title: "Order Placed & Verified",
          description: "Payment confirmed via Stripe. Silk lot reserved from Kyoto.",
          time: "Sep 12, 2026 — 10:14",
          completed: true
        },
        {
          title: "Hand-Cut & Canvased",
          description: "Pleating fixed with botanical steam setting.",
          time: "Sep 13, 2026 — 11:20",
          completed: true
        },
        {
          title: "Quality Certified & Wax-Sealed",
          description: "Passed 48-point quality review.",
          time: "Sep 13, 2026 — 16:45",
          completed: true
        },
        {
          title: "Dispatched via DHL Express Air",
          description: "Courier tracking active.",
          time: "Sep 14, 2026 — 08:30",
          completed: true
        },
        {
          title: "Out for Courier Delivery",
          description: "Assigned to Kensington route courier.",
          time: "Sep 15, 2026 — 09:10",
          completed: true
        },
        {
          title: "Delivered into Patron Care",
          description: "Signed by patron: E. Vance.",
          time: "Sep 15, 2026 — 11:42",
          completed: true
        }
      ]
    }
  ]
};
