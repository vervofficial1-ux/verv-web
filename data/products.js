// ==========================================================
// VERV — PRODUCT DATA
//
// This is the ONLY file you need to edit to add, remove, or
// change a product. The UI reads this file automatically.
//
// HOW TO ADD A NEW PRODUCT:
// 1. Drop your images into /assets/products/<your-product>/
//    (front.jpg, back.jpg, detail.jpg, lifestyle.jpg — any subset).
// 2. Copy one of the objects below and edit its fields.
// 3. Save. Refresh the site. Done — no HTML editing required.
//
// `images` accepts 1 to 5 paths. The product card and the
// product page both handle any number gracefully.
// `fabric` is optional — only add it if you have fabric-specific
// info/photos to show (see the sweatpants entry below).
// ==========================================================

window.VERV_PRODUCTS = [
  {
    id: "hoodie-01",
    name: "The Comfort Hoodie",
    slug: "comfort-hoodie",
    price: 1250,
    category: "Hoodie",
    shortDescription: "Dropped shoulder, brushed fleece, embroidered VERV mark.",
    description: "Heavyweight brushed fleece hoodie with a dropped shoulder and boxy oversized fit. Finished with an embroidered VERV mark at the chest.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "assets/products/hoodie/front.jpg"
    ],
    details: {
      fabric: "Heavyweight brushed fleece, 320gsm",
      fit: "Oversized, dropped shoulder",
      care: "Machine wash cold, do not tumble dry"
    },
    featured: true,
    available: true
  },
  {
    id: "sweatpants-01",
    name: "VERV Sweatpants",
    slug: "verv-sweatpants",
    price: 980,
    category: "Sweatpants",
    shortDescription: "Relaxed wide-leg fleece, drawstring waist.",
    description: "Relaxed, wide-leg sweatpants built for movement. Elastic drawstring waist, side pockets, available in three colorways.",
    colors: ["Black", "Stone", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "assets/products/sweatpants/front.jpg"
    ],
    details: {
      fabric: "Samar Melton — French Terry Back, 100% Cotton",
      fit: "Relaxed, wide-leg",
      care: "Machine wash cold, do not bleach"
    },
    fabric: {
      composition: "100% Cotton",
      weave: "Samar Melton — French Terry Back",
      images: [
        "assets/products/sweatpants/front.jpg"
      ]
    },
    featured: true,
    available: true
  },
  {
    id: "cargo-01",
    name: "Cargo Utility Pants",
    slug: "cargo-utility-pants",
    price: 1450,
    category: "Cargo",
    shortDescription: "Heavyweight tech cargo, built for movement, tapered fit.",
    description: "Heavyweight tech cargo pant with a tapered fit and utility pockets, built for movement.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "assets/products/cargo/front.svg"
    ],
    details: {
      fabric: "Heavyweight ripstop cotton blend",
      fit: "Tapered",
      care: "Machine wash cold"
    },
    featured: false,
    available: true
  },
  {
    id: "tee-01",
    name: "Core Tee — Black",
    slug: "core-tee-black",
    price: 650,
    category: "Tee",
    shortDescription: "Heavyweight 240gsm cotton, boxy fit, back print.",
    description: "Heavyweight 240gsm cotton tee with a boxy fit and a subtle back print.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "assets/products/tee/front.svg"
    ],
    details: {
      fabric: "240gsm cotton",
      fit: "Boxy",
      care: "Machine wash cold"
    },
    featured: false,
    available: true
  },
  {
    id: "crew-01",
    name: "Energy Crewneck",
    slug: "energy-crewneck",
    price: 1100,
    category: "Crewneck",
    shortDescription: "Mid-weight crew, ribbed cuffs, minimal chest logo.",
    description: "Mid-weight crewneck with ribbed cuffs and hem, minimal chest logo.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "assets/products/crewneck/front.svg"
    ],
    details: {
      fabric: "Mid-weight fleece, 280gsm",
      fit: "Regular",
      care: "Machine wash cold"
    },
    featured: false,
    available: true
  },
  {
    id: "jacket-01",
    name: "Tech Shell Jacket",
    slug: "tech-shell-jacket",
    price: 2100,
    category: "Jacket",
    shortDescription: "Water-resistant shell, multi-pocket, matte black hardware.",
    description: "Water-resistant tech shell jacket with multiple pockets and matte black hardware.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "assets/products/jacket/front.svg"
    ],
    details: {
      fabric: "Water-resistant shell",
      fit: "Regular",
      care: "Wipe clean, do not machine wash"
    },
    featured: false,
    available: true
  }
];
