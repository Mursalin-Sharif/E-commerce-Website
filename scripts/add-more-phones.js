const fs = require("fs");
const path = "data/store.json";
const s = JSON.parse(fs.readFileSync(path, "utf8"));

const PHONE_IMGS = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&h=800&q=80",
];

function fixPicsum(url, i) {
  if (!url || !String(url).includes("picsum")) return url;
  return PHONE_IMGS[i % PHONE_IMGS.length];
}

// Fix existing smartphone product galleries / color swatches still on picsum
for (const p of s.products) {
  if (p.category !== "smartphone" && !String(p.id).startsWith("sp")) continue;
  if (p.imageUrl) p.imageUrl = fixPicsum(p.imageUrl, 0) || p.imageUrl;
  if (Array.isArray(p.imageGallery)) {
    p.imageGallery = p.imageGallery.map((u, i) => fixPicsum(u, i + 1));
  }
  if (Array.isArray(p.gallery)) {
    p.gallery = p.gallery.map((u, i) => fixPicsum(u, i + 2));
  }
  if (Array.isArray(p.colors)) {
    p.colors = p.colors.map((c, i) => ({
      ...c,
      image: fixPicsum(c.image, i + 3),
    }));
  }
}

const phones = [
  { id: "sp7", brand: "Samsung", name: "Samsung Galaxy A15 8/256 GB Super AMOLED Official Warranty", nameBn: "Samsung Galaxy A15 8/256GB", price: 199, sale: 185, discount: 7, sold: 420, rating: 4.8, reviews: 210, badge: "FLASH SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · Official · Fast Delivery" },
  { id: "sp8", brand: "Samsung", name: "Samsung Galaxy A05s 6/128 GB 50MP Camera Official Warranty", nameBn: "Samsung Galaxy A05s 6/128GB", price: 155, sale: 142, discount: 8, sold: 880, rating: 4.6, reviews: 156, badge: "PAYDAY SALE", tag: "Mall", strip: "Official Mobile Store · Limited Stock · 0% EMI" },
  { id: "sp9", brand: "Xiaomi", name: "Xiaomi Redmi 13C 6/128 GB 50MP AI Camera Official", nameBn: "Redmi 13C 6/128GB", price: 140, sale: 129, discount: 8, sold: 1200, rating: 4.7, reviews: 340, badge: "FLASH SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · Fast Delivery" },
  { id: "sp10", brand: "Xiaomi", name: "Xiaomi Redmi Note 13 8/256 GB AMOLED 120Hz Official", nameBn: "Redmi Note 13 8/256GB", price: 245, sale: 229, discount: 7, sold: 650, rating: 4.9, reviews: 188, badge: "FLASH SALE", tag: "Mall", strip: "Official Mobile · Authentic · 0% EMI · Fast Delivery" },
  { id: "sp11", brand: "Vivo", name: "vivo Y28 8/256 GB 6000mAh Battery Official Warranty", nameBn: "vivo Y28 8/256GB", price: 210, sale: 198, discount: 6, sold: 310, rating: 4.5, reviews: 92, badge: "PAYDAY SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · Official" },
  { id: "sp12", brand: "Vivo", name: "vivo Y18 4/128 GB Side Fingerprint Official Warranty", nameBn: "vivo Y18 4/128GB", price: 125, sale: 115, discount: 8, sold: 540, rating: 4.4, reviews: 77, badge: "FLASH SALE", tag: "Mall", strip: "Official Mobile Store · Fast Delivery" },
  { id: "sp13", brand: "OPPO", name: "OPPO A60 8/256 GB 45W SUPERVOOC Official Warranty", nameBn: "OPPO A60 8/256GB", price: 235, sale: 219, discount: 7, sold: 275, rating: 4.7, reviews: 121, badge: "FLASH SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · 0% EMI" },
  { id: "sp14", brand: "OPPO", name: "OPPO A18 4/128 GB Soft Light Portrait Official", nameBn: "OPPO A18 4/128GB", price: 118, sale: 109, discount: 8, sold: 990, rating: 4.3, reviews: 64, badge: "PAYDAY SALE", tag: "Mall", strip: "Official Mobile · Limited Stock · Fast Delivery" },
  { id: "sp15", brand: "realme", name: "realme C67 8/256 GB 108MP Camera Official Warranty", nameBn: "realme C67 8/256GB", price: 188, sale: 175, discount: 7, sold: 430, rating: 4.6, reviews: 145, badge: "FLASH SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · Official" },
  { id: "sp16", brand: "realme", name: "realme Note 50 4/128 GB Dynamic Island Official", nameBn: "realme Note 50 4/128GB", price: 112, sale: 102, discount: 9, sold: 1500, rating: 4.5, reviews: 260, badge: "FLASH SALE", tag: "Mall", strip: "Official Mobile Store · 0% EMI · Fast Delivery" },
  { id: "sp17", brand: "Tecno", name: "Tecno Spark 20 8/256 GB 50MP Dual Camera Official", nameBn: "Tecno Spark 20 8/256GB", price: 168, sale: 155, discount: 8, sold: 380, rating: 4.4, reviews: 98, badge: "PAYDAY SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · Fast Delivery" },
  { id: "sp18", brand: "Tecno", name: "Tecno Camon 30 8/256 GB 50MP RGBW Camera Official", nameBn: "Tecno Camon 30 8/256GB", price: 255, sale: 239, discount: 6, sold: 190, rating: 4.8, reviews: 71, badge: "FLASH SALE", tag: "Mall", strip: "Official Mobile · Authentic · 0% EMI" },
  { id: "sp19", brand: "Infinix", name: "Infinix Hot 40 8/256 GB Dual Speakers Official Warranty", nameBn: "Infinix Hot 40 8/256GB", price: 175, sale: 162, discount: 7, sold: 720, rating: 4.6, reviews: 184, badge: "FLASH SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · Official · Fast Delivery" },
  { id: "sp20", brand: "Infinix", name: "Infinix Note 40 8/256 GB 45W Fast Charge Official", nameBn: "Infinix Note 40 8/256GB", price: 228, sale: 212, discount: 7, sold: 260, rating: 4.7, reviews: 112, badge: "PAYDAY SALE", tag: "Mall", strip: "Official Mobile Store · Limited Stock · 0% EMI" },
  { id: "sp21", brand: "Motorola", name: "Motorola G34 5G 8/128 GB 50MP Camera Official Warranty", nameBn: "Motorola G34 5G 8/128GB", price: 195, sale: 182, discount: 7, sold: 145, rating: 4.5, reviews: 58, badge: "FLASH SALE", tag: "Mall", strip: "Daraz Official Mobile · Authentic · Fast Delivery" },
  { id: "sp22", brand: "Nokia", name: "Nokia G42 5G 6/128 GB Snapdragon Official Warranty", nameBn: "Nokia G42 5G 6/128GB", price: 205, sale: 192, discount: 6, sold: 98, rating: 4.4, reviews: 41, badge: "FLASH SALE", tag: "Mall", strip: "Official Mobile · Authentic · 0% EMI · Fast Delivery" },
];

const existing = new Set(s.products.map((p) => p.id));
let added = 0;

phones.forEach((spec, idx) => {
  if (existing.has(spec.id)) return;
  const img = PHONE_IMGS[idx % PHONE_IMGS.length];
  const gallery = [
    PHONE_IMGS[idx % PHONE_IMGS.length],
    PHONE_IMGS[(idx + 1) % PHONE_IMGS.length],
    PHONE_IMGS[(idx + 2) % PHONE_IMGS.length],
    PHONE_IMGS[(idx + 3) % PHONE_IMGS.length],
  ];
  s.products.push({
    id: spec.id,
    name: spec.name,
    nameBn: spec.nameBn,
    price: spec.price,
    salePrice: spec.sale,
    originalPrice: spec.price,
    discount: spec.discount,
    category: "smartphone",
    color: "#1f2937",
    imageUrl: img,
    imageGallery: gallery,
    gallery,
    active: true,
    brand: spec.brand,
    badge: spec.badge,
    tag: spec.tag,
    bannerStrip: spec.strip,
    location: "Dhaka",
    locationBn: "ঢাকা",
    sold: spec.sold,
    rating: spec.rating,
    reviews: spec.reviews,
    coinsSave: Math.round(spec.sale * 120 * 0.01),
    mall: true,
    storage: "128GB",
    storageOptions: ["128GB", "256GB"],
    instalmentMonths: 6,
    stockNote: "In stock — order now",
    keywords: `smartphone ${spec.brand} mobile phone official`,
    description: `${spec.name} — reliable smartphone for everyday use in Bangladesh with official warranty support.`,
    descriptionBn: `${spec.nameBn} — বাংলাদেশে অফিসিয়াল ওয়ারেন্টিসহ নির্ভরযোগ্য স্মার্টফোন।`,
    highlights: ["Official warranty", "Fast delivery", "Mall verified"],
    highlightsBn: ["অফিসিয়াল ওয়ারেন্টি", "দ্রুত ডেলিভারি", "মল ভেরিফাইড"],
    boxContents: ["Phone", "Charger", "USB cable", "SIM ejector", "Manual"],
    boxContentsBn: ["ফোন", "চার্জার", "USB কেবল", "সিম টুল", "ম্যানুয়াল"],
    warranty: "1 Year Official Warranty",
    warrantyBn: "১ বছর অফিসিয়াল ওয়ারেন্টি",
    specs: [
      { label: "Brand", value: spec.brand },
      { label: "Category", value: "Smartphone" },
      { label: "Warranty", value: "1 Year" },
    ],
  });
  added += 1;
});

if (!s.categories.some((c) => c.id === "smartphone")) {
  s.categories.unshift({
    id: "smartphone",
    name: "Smartphones",
    nameBn: "স্মার্টফোন",
  });
}

fs.writeFileSync(path, JSON.stringify(s, null, 2));
const count = s.products.filter((p) => p.category === "smartphone").length;
console.log({ added, smartphoneCount: count, total: s.products.length });
