// Curated Fashion Apparel Catalog with High-Resolution Model & Product Photography
export const MOCK_PRODUCTS = [
  {
    id: "prod-001",
    sku: "ATL-COAT-01",
    name: "Architectural Wool Overcoat",
    tagline: "Double-faced virgin wool with structured lapels",
    price: 380,
    originalPrice: 450,
    rating: 4.9,
    reviewCount: 38,
    category: "Outerwear",
    tags: ["Bestseller", "New Drop"],
    description: "Tailored from Italian double-faced virgin wool, this overcoat balances sharp architectural lines with an effortless, relaxed silhouette. Features horn buttons, deep welt pockets, and a center back vent for fluid movement.",
    details: [
      "Relaxed tailored fit, designed to layer over knitwear",
      "Genuine Italian buffalo horn buttons",
      "Two interior slip pockets, two exterior welt pockets",
      "Hand-finished clean seams"
    ],
    composition: "100% Virgin Wool. Interior lining: 100% Cupro.",
    careInstructions: [
      "Dry clean only (P)",
      "Cool iron if necessary with pressing cloth",
      "Do not tumble dry",
      "Store on a contoured wooden hanger"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Charcoal Slate", hex: "#2B2D42", image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80" },
      { name: "Camel Sand", hex: "#C19A6B", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 8 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 2 }
    ]
  },
  {
    id: "prod-002",
    sku: "ATL-KNIT-02",
    name: "Pure Cashmere Mockneck",
    tagline: "7-gauge Mongolian cashmere with ribbed trims",
    price: 240,
    originalPrice: 280,
    rating: 4.8,
    reviewCount: 52,
    category: "Knitwear",
    tags: ["Sustainable", "Bestseller"],
    description: "Spun from ethically sourced Mongolian grade-A cashmere fibers, this mockneck sweater offers unparalleled softness and lightweight insulation. Features a subtle dropped shoulder and engineered ribbing.",
    details: [
      "7-gauge medium knit suitable for all seasons",
      "Seamless tubular collar for maximum neck comfort",
      "Naturally moisture-wicking and thermal regulating",
      "Reinforced cuffs and hem"
    ],
    composition: "100% Grade-A Mongolian Cashmere (Sustainable GOTS Certified).",
    careInstructions: [
      "Hand wash in lukewarm water with wool detergent",
      "Do not wring or twist",
      "Dry flat on towel",
      "Fold for storage; do not hang"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Alabaster Cream", hex: "#F3EDE2", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80" },
      { name: "Onyx Black", hex: "#111111", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "XS", stock: 2 },
      { size: "S", stock: 7 },
      { size: "M", stock: 12 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 0 }
    ]
  },
  {
    id: "prod-003",
    sku: "ATL-TOP-03",
    name: "Heavyweight Boxy Graphic Tee",
    tagline: "300 GSM combed organic cotton with dropped shoulder",
    price: 85,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 64,
    category: "Tops",
    tags: ["New Drop"],
    description: "A substantial, heavyweight staple cut with a boxy, modern drape. Made from 300 GSM ring-spun organic cotton, pre-shrunk to retain structure wash after wash. Finished with a dense ribbed 1.25-inch crew collar.",
    details: [
      "300 GSM ultra-dense organic cotton jersey",
      "Dropped shoulders with wide body drape",
      "Twin-needle hem and sleeve finish",
      "Pre-washed to resist shrinkage"
    ],
    composition: "100% Organic Ring-Spun Cotton.",
    careInstructions: [
      "Machine wash cold inside out with like colors",
      "Tumble dry low or line dry in shade",
      "Warm iron on reverse side",
      "Do not bleach"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Bone White", hex: "#FAF8F5", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80" },
      { name: "Washed Mineral", hex: "#4A4E54", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 24 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 9 }
    ]
  },
  {
    id: "prod-004",
    sku: "ATL-PANT-04",
    name: "Pleated Wide-Leg Trousers",
    tagline: "High-waist tailored drape in breathable wool blend",
    price: 195,
    originalPrice: 230,
    rating: 4.9,
    reviewCount: 29,
    category: "Bottoms",
    tags: ["Bestseller"],
    description: "Commanding ease in motion. These high-rise trousers feature deep forward double pleats, an extended waistband tab, and a fluid wide-leg cut with a slight taper over the shoe.",
    details: [
      "High-rise with internal rubberized grip band",
      "Double forward pleats for relaxed leg volume",
      "Slanted front side pockets, rear jetted welt pockets",
      "Concealed hook-and-bar zip fly"
    ],
    composition: "60% Tropical Wool, 38% Polyester, 2% Elastane.",
    careInstructions: [
      "Dry clean recommended",
      "Steam to release travel wrinkles",
      "Hang by cuffs using clamp hanger"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Mocha Taupe", hex: "#7E685A", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80" },
      { name: "Jet Black", hex: "#1A1A1A", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 10 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 1 }
    ]
  },
  {
    id: "prod-005",
    sku: "ATL-JKT-05",
    name: "Minimalist Leather Bomber",
    tagline: "Supple lambskin nappa with matte black hardware",
    price: 490,
    originalPrice: 580,
    rating: 5.0,
    reviewCount: 19,
    category: "Outerwear",
    tags: ["Limited Edition"],
    description: "A masterclass in modern restraint. Crafted from buttery Italian lambskin nappa leather that ages with distinct character. Finished with two-way RiRi metal zips and tonal wool-blend ribbing.",
    details: [
      "100% full-grain Italian lambskin leather",
      "Two-way brushed gunmetal zip closure",
      "Hidden magnetic snap chest interior pocket",
      "Fully lined in breathable satin cupro"
    ],
    composition: "100% Italian Lambskin Nappa. Lining: 100% Satin Bemberg.",
    careInstructions: [
      "Specialist leather dry clean only",
      "Store in breathable garment bag away from sunlight",
      "Treat annually with neutral leather balm"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Obsidian Black", hex: "#0D0D0D", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "S", stock: 2 },
      { size: "M", stock: 4 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 }
    ]
  },
  {
    id: "prod-006",
    sku: "ATL-SHIRT-06",
    name: "Camp-Collar Silk-Tencel Shirt",
    tagline: "Airy fluid drape with hand-carved mother-of-pearl buttons",
    price: 160,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 31,
    category: "Tops",
    tags: ["Sustainable", "New Drop"],
    description: "Cut for leisurely summer days and evening layering alike. Woven from a blend of Mulberry silk and eucalyptus Tencel, delivering an intoxicating liquid drape and cooling breathability.",
    details: [
      "Relaxed Cuban/Camp collar design",
      "Natural mother-of-pearl button fasteners",
      "Straight hem with side seam splits for untucked styling",
      "French seam craftsmanship throughout"
    ],
    composition: "70% Tencel Lyocell, 30% Mulberry Silk.",
    careInstructions: [
      "Delicate cold hand wash or machine gentle cycle in wash bag",
      "Line dry in shade",
      "Steam or cool iron on silk setting"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Sage Mist", hex: "#9EADA2", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80" },
      { name: "Ivory", hex: "#FDFBF7", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 14 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 3 }
    ]
  },
  {
    id: "prod-007",
    sku: "ATL-DENIM-07",
    name: "Selvedge Raw Denim Jeans",
    tagline: "13.5 oz Japanese Kurabo Mills selvedge denim",
    price: 210,
    originalPrice: 250,
    rating: 4.9,
    reviewCount: 47,
    category: "Bottoms",
    tags: ["Bestseller"],
    description: "Woven on vintage shuttle looms by the renowned Kurabo Mills in Kojima, Japan. Sturdy 13.5 oz indigo denim with clean red-line selvedge ID, destined to break in and develop unique personal fade patterns.",
    details: [
      "Mid-rise regular straight cut with clean silhouette",
      "Red-and-white selvedge ticker along outer seam",
      "Heavy-gauge copper rivets at stress points",
      "Custom vegetable-tanned leather waistband patch"
    ],
    composition: "100% Cotton (Japanese Kurabo Mills Selvedge).",
    careInstructions: [
      "Wear continuously for 6 months before first wash for optimal fades",
      "Hand wash inside out in cold water",
      "Hang dry naturally away from direct heat"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Deep Indigo", hex: "#1C2D42", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 11 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 }
    ]
  },
  {
    id: "prod-008",
    sku: "ATL-ACC-08",
    name: "Architectural Leather Shopper Tote",
    tagline: "Vachetta calfskin with structured base & brass hardware",
    price: 320,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 22,
    category: "Accessories",
    tags: ["New Drop"],
    description: "Engineered for daily urban utility without aesthetic compromise. Carved from vegetable-tanned Tuscan calfskin that deepens with honey-toned patina over years of carry. Houses a 16-inch laptop securely.",
    details: [
      "Padded interior laptop sleeve (fits up to 16\" MacBook)",
      "Magnetic top bridge closure with solid brass ring",
      "Reinforced base with metal protective feet",
      "Detachable zippered interior pouch"
    ],
    composition: "100% Full-Grain Vegetable-Tanned Italian Vachetta Leather.",
    careInstructions: [
      "Wipe clean with a soft dry microfiber cloth",
      "Apply specialized leather cream every 6 months",
      "Avoid contact with water and harsh solvents"
    ],
    images: {
      front: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
      model: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
      ]
    },
    colors: [
      { name: "Cognac Tan", hex: "#9A5B32", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80" },
      { name: "Midnight Black", hex: "#141414", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80" }
    ],
    sizes: [
      { size: "M", stock: 10 }
    ]
  }
];
