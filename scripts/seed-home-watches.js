const fs = require("fs");
const path = "data/store.json";
const s = JSON.parse(fs.readFileSync(path, "utf8"));

const WATCH_IMGS = [
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&h=800&q=80",
];

const extraWatches = [
  { id: "sw8", name: "T900 Ultra 2 Smartwatch for Men Women Bluetooth Call Sports Mode", nameBn: "T900 Ultra 2 স্মার্টওয়াচ", brand: "T900", price: 8.5, discount: 44, sold: 149, rating: 4.5, reviews: 28, badge: "PAYDAY SALE" },
  { id: "sw9", name: "Smartberry 2030 C005 / C002 Kids Smartwatch GPS Safe Zone", nameBn: "Smartberry Kids স্মার্টওয়াচ", brand: "Smartberry", price: 14.2, discount: 35, sold: 86, rating: 4.3, reviews: 19, badge: "FLASH SALE" },
  { id: "sw10", name: "HK9 Pro Max AMOLED Smart Watch ChatGPT Voice Assistant", nameBn: "HK9 Pro Max স্মার্ট ওয়াচ", brand: "HK9", price: 11.8, discount: 48, sold: 210, rating: 4.7, reviews: 55, badge: "PAYDAY SALE" },
  { id: "sw11", name: "DT8 Ultra Smart Watch Wireless Charging Compass", nameBn: "DT8 Ultra স্মার্ট ওয়াচ", brand: "DT8", price: 10.2, discount: 40, sold: 97, rating: 4.4, reviews: 22, badge: "FLASH SALE" },
  { id: "sw12", name: "X8 Ultra Smart Watch Series Men Women Fitness Tracker", nameBn: "X8 Ultra স্মার্ট ওয়াচ", brand: "X8", price: 7.9, discount: 51, sold: 320, rating: 4.2, reviews: 41, badge: "PAYDAY SALE" },
  { id: "sw13", name: "Mibro Watch Lite 3 GPS Heart Rate Sleep Monitor Official", nameBn: "Mibro Watch Lite 3", brand: "Mibro", price: 22.5, discount: 28, sold: 64, rating: 4.8, reviews: 33, badge: "Mall", mall: true },
  { id: "sw14", name: "Noise ColorFit Pro 5 Max AMOLED Calling Watch", nameBn: "Noise ColorFit Pro 5", brand: "Noise", price: 18.0, discount: 32, sold: 178, rating: 4.6, reviews: 70, badge: "FLASH SALE" },
  { id: "sw15", name: "Fire-Boltt Gladiator Smartwatch Bluetooth Calling", nameBn: "Fire-Boltt Gladiator", brand: "Fire-Boltt", price: 12.5, discount: 46, sold: 255, rating: 4.5, reviews: 88, badge: "PAYDAY SALE" },
];

const existing = new Set(s.products.map((p) => p.id));
extraWatches.forEach((spec, i) => {
  if (existing.has(spec.id)) return;
  const img = WATCH_IMGS[i % WATCH_IMGS.length];
  s.products.push({
    id: spec.id,
    name: spec.name,
    nameBn: spec.nameBn,
    price: spec.price,
    salePrice: +(spec.price * (1 - spec.discount / 100)).toFixed(3),
    originalPrice: spec.price,
    discount: spec.discount,
    category: "smartwatches",
    color: "#222",
    imageUrl: img,
    imageGallery: [img, WATCH_IMGS[(i + 1) % WATCH_IMGS.length], WATCH_IMGS[(i + 2) % WATCH_IMGS.length]],
    active: true,
    brand: spec.brand,
    badge: spec.badge,
    tag: spec.mall ? "Mall" : "Mall",
    mall: true,
    location: "Dhaka",
    locationBn: "ঢাকা",
    sold: spec.sold,
    rating: spec.rating,
    reviews: spec.reviews,
    coinsSave: Math.max(3, Math.round(spec.price * 120 * 0.01)),
    keywords: "smart watch smartwatch",
    description: `${spec.name} — stylish smartwatch with calling, fitness tracking and long battery for everyday use in Bangladesh.`,
    descriptionBn: `${spec.nameBn} — কলিং, ফিটনেস ট্র্যাকিং ও লং ব্যাটারিসহ স্মার্টওয়াচ।`,
    highlights: ["Bluetooth calling", "Sports modes", "Heart rate & sleep", "Long battery"],
    highlightsBn: ["ব্লুটুথ কলিং", "স্পোর্টস মোড", "হার্ট রেট ও স্লিপ", "লং ব্যাটারি"],
    boxContents: ["Smartwatch", "Charging cable", "Strap", "Manual"],
    boxContentsBn: ["স্মার্টওয়াচ", "চার্জিং কেবল", "স্ট্র্যাপ", "ম্যানুয়াল"],
    warranty: "6 Months Seller Warranty",
    warrantyBn: "৬ মাস সেলার ওয়ারেন্টি",
    specs: [
      { label: "Brand", value: spec.brand },
      { label: "Category", value: "Smartwatches" },
      { label: "Connectivity", value: "Bluetooth" },
    ],
  });
});

// Prefer watches + phones + existing home set for home feed
const prefer = [
  ...s.products.filter((p) => String(p.category || "").includes("smartwatch") || p.id.startsWith("sw")).map((p) => p.id),
  ...s.products.filter((p) => p.category === "smartphone" || p.id.startsWith("sp")).map((p) => p.id),
  ...(s.homeProductIds || []),
];
const seen = new Set();
s.homeProductIds = prefer.filter((id) => {
  if (seen.has(id)) return false;
  seen.add(id);
  return s.products.some((p) => p.id === id);
});

if (!s.settings) s.settings = {};
s.settings.homePageTitle = s.settings.homePageTitle || "Just For You";
s.settings.homePageTitleBn = s.settings.homePageTitleBn || "হোম";

// Fix picsum galleries on existing sw products
for (const p of s.products) {
  if (!String(p.id).startsWith("sw") && p.category !== "smartwatches") continue;
  if (Array.isArray(p.imageGallery)) {
    p.imageGallery = p.imageGallery.map((u, i) =>
      String(u || "").includes("picsum") ? WATCH_IMGS[i % WATCH_IMGS.length] : u
    );
  }
}

fs.writeFileSync(path, JSON.stringify(s, null, 2));
console.log({
  watches: s.products.filter((p) => /smartwatch/i.test(p.category || "") || p.id.startsWith("sw")).length,
  homeIds: s.homeProductIds.length,
});
