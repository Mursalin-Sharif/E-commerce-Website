const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));

const headphones = [
  {
    id: "hp1",
    name: "1fast Earbuds, TWS Bluetooth Headphone, Wireless Gaming Earbuds, Bluetooth 5.3 Earphone, Deep Bass TWS",
    nameBn: "1fast TWS ব্লুটুথ হেডফোন গেমিং ইয়ারবাডস",
    brand: "1fast",
    price: 8.12,
    salePrice: 2.3,
    discount: 66,
    sold: 1100,
    rating: 4.8,
    reviews: 142,
    badge: "PAYDAY SALE",
    tag: "CHOICE",
    keywords: "headphone earbud tws wireless 1fast bluetooth gaming",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#111111",
  },
  {
    id: "hp2",
    name: "M28 TWS Gaming Earbuds Bluetooth 5.3 LED Display Charging Case Deep Bass",
    nameBn: "M28 TWS গেমিং ইয়ারবাডস LED চার্জিং কেস",
    brand: "M28",
    price: 8.78,
    salePrice: 2.49,
    discount: 65,
    sold: 890,
    rating: 4.9,
    reviews: 118,
    badge: "BEST PRICE",
    keywords: "headphone m28 tws gaming earbud led bluetooth",
    imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#1a1a1a",
  },
  {
    id: "hp3",
    name: "Q86 TWS Wireless Earphones Bluetooth 5.3 Noise Cancelling Touch Control",
    nameBn: "Q86 TWS ওয়্যারলেস ইয়ারফোন",
    brand: "Q86",
    price: 11.28,
    salePrice: 3.2,
    discount: 64,
    sold: 654,
    rating: 4.7,
    reviews: 89,
    badge: "PAYDAY SALE",
    keywords: "headphone q86 tws wireless earphone bluetooth anc",
    imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fa2cc9?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#d4a574",
  },
  {
    id: "hp4",
    name: "P9 Pro Max Wireless Headphones Over-Ear Bluetooth 5.0 Foldable Deep Bass",
    nameBn: "P9 Pro Max ওয়্যারলেস ওভার-ইয়ার হেডফোন",
    brand: "P9",
    price: 11.16,
    salePrice: 3.17,
    discount: 63,
    sold: 420,
    rating: 4.8,
    reviews: 76,
    badge: "BEST PRICE",
    tag: "CHOICE",
    keywords: "headphone p9 pro over-ear wireless bluetooth foldable",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#f5f5f5",
  },
  {
    id: "hp5",
    name: "Oraimo FreePods 3C ENC Wireless Earbuds Long Battery",
    nameBn: "Oraimo FreePods 3C ওয়্যারলেস ইয়ারবাডস",
    brand: "Oraimo",
    price: 3.04,
    salePrice: 3.04,
    discount: 45,
    sold: 1800,
    rating: 5,
    reviews: 312,
    badge: "FLASH SALE",
    keywords: "headphone oraimo earbud",
    imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#0f3460",
  },
  {
    id: "hp6",
    name: "Remax RB-T7 Neckband Bluetooth Headset Sports Earphone",
    nameBn: "Remax RB-T7 নেকব্যান্ড ব্লুটুথ হেডসেট",
    brand: "Remax",
    price: 1.45,
    salePrice: 1.45,
    discount: 55,
    sold: 620,
    rating: 4.8,
    reviews: 89,
    keywords: "headphone headset neckband remax",
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#e74c3c",
  },
  {
    id: "hp7",
    name: "Baseus Bowie E9 TWS Earbuds HiFi Stereo Waterproof IPX7",
    nameBn: "Baseus Bowie E9 TWS ইয়ারবাডস",
    brand: "Baseus",
    price: 2.89,
    salePrice: 2.89,
    discount: 40,
    sold: 410,
    rating: 4.7,
    reviews: 67,
    keywords: "headphone baseus tws waterproof",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#636e72",
  },
  {
    id: "hp8",
    name: "JBL Tune 510BT On-Ear Wireless Headphones Pure Bass",
    nameBn: "JBL Tune 510BT ওয়্যারলেস হেডফোন",
    brand: "JBL",
    price: 4.25,
    salePrice: 4.25,
    discount: 35,
    sold: 220,
    rating: 4.9,
    reviews: 41,
    mall: true,
    badge: "Official Store",
    keywords: "headphone jbl over-ear wireless",
    imageUrl: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#f39c12",
  },
  {
    id: "hp9",
    name: "Sony WH-CH520 Wireless On-Ear Headphones 50hr Battery",
    nameBn: "Sony WH-CH520 ওয়্যারলেস হেডফোন",
    brand: "Sony",
    price: 5.1,
    salePrice: 5.1,
    discount: 28,
    sold: 156,
    rating: 5,
    reviews: 33,
    mall: true,
    keywords: "headphone sony wireless",
    imageUrl: "https://images.unsplash.com/photo-1598306639067-f21bde5635a3?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#2c3e50",
  },
  {
    id: "hp10",
    name: "Xiaomi Redmi Buds 5 Pro Active Noise Cancellation Earbuds",
    nameBn: "Xiaomi Redmi Buds 5 Pro ইয়ারবাডস",
    brand: "Xiaomi",
    price: 3.45,
    salePrice: 3.45,
    discount: 42,
    sold: 980,
    rating: 4.9,
    reviews: 201,
    badge: "PAYDAY SALE",
    keywords: "headphone xiaomi redmi buds tws",
    imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d228f?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#dfe6e9",
  },
  {
    id: "hp11",
    name: "Samsung Galaxy Buds FE Active Noise Cancellation TWS",
    nameBn: "Samsung Galaxy Buds FE TWS",
    brand: "Samsung",
    price: 4.8,
    salePrice: 4.8,
    discount: 30,
    sold: 340,
    rating: 4.8,
    reviews: 76,
    mall: true,
    keywords: "headphone samsung galaxy buds",
    imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ed7ba99bc3?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#ecf0f1",
  },
  {
    id: "hp12",
    name: "Realme Buds Air 5 Pro 50dB ANC Wireless Earbuds LDAC",
    nameBn: "Realme Buds Air 5 Pro ইয়ারবাডস",
    brand: "Realme",
    price: 3.78,
    salePrice: 3.78,
    discount: 38,
    sold: 720,
    rating: 4.9,
    reviews: 145,
    keywords: "headphone realme buds tws anc",
    imageUrl: "https://images.unsplash.com/photo-1583394838333-ac0719328abf?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#f5f6fa",
  },
];

function enrichProduct(base) {
  const cat = store.categories.find((c) => c.id === "electronics") || store.categories[0];
  const catName = cat ? cat.name : "Electronics";
  return {
    category: cat ? cat.id : "electronics",
    active: true,
    location: "Dhaka",
    locationBn: "ঢাকা",
    coinsSave: 2 + (parseInt(base.id.replace(/\D/g, ""), 10) % 5),
    description: `${base.name} brings premium sound with ${base.brand} quality. Ideal for music, calls, and daily commute across Bangladesh.\n\nFeatures Bluetooth connectivity, long battery life, and comfortable fit. Cash on delivery available in Dhaka, Chittagong, Sylhet, and nationwide.\n\nThousands of buyers trust this ${catName} listing — rated ${base.rating}★ from ${base.reviews}+ reviews with ${base.sold}+ sold.`,
    descriptionBn: `${base.nameBn || base.name} — ${base.brand} ব্র্যান্ডের প্রিমিয়াম সাউন্ড। বাংলাদেশজুড়ে ক্যাশ অন ডেলিভারি সুবিধা।`,
    highlights: [
      `Authentic ${base.brand} audio quality`,
      `${base.discount}% off vs listed price`,
      `${base.sold}+ units sold nationwide`,
      "Cash on delivery & easy returns",
      "Fast dispatch from Dhaka",
    ],
    highlightsBn: [
      `${base.brand} অথেন্টিক অডিও কোয়ালিটি`,
      `${base.discount}% ছাড়`,
      `${base.sold}+ বিক্রি`,
      "ক্যাশ অন ডেলিভারি",
      "ঢাকা থেকে দ্রুত ডেলিভারি",
    ],
    specs: [
      { label: "Brand", labelBn: "ব্র্যান্ড", value: base.brand },
      { label: "Category", labelBn: "ক্যাটাগরি", value: catName },
      { label: "Connectivity", labelBn: "কানেক্টিভিটি", value: "Bluetooth 5.x" },
      { label: "Type", labelBn: "টাইপ", value: "Wireless Earbuds / Headphone" },
      { label: "Warranty", labelBn: "ওয়ারেন্টি", value: "7 days replacement warranty" },
    ],
    boxContents: ["1 × Earbuds / Headphone unit", "Charging cable or case", "User manual", "Retail packaging"],
    boxContentsBn: ["১ × ইয়ারবাডস / হেডফোন", "চার্জিং কেবল বা কেস", "ইউজার ম্যানুয়াল", "রিটেইল প্যাকেজিং"],
    warranty: "7-day easy replacement. Brand/seller policy applies.",
    warrantyBn: "৭ দিনের সহজ রিপ্লেসমেন্ট। ব্র্যান্ড/সেলার পলিসি প্রযোজ্য।",
    ...base,
    mall: false,
    bannerStrip: "",
    imageUrl: base.imageUrl,
    imageGallery: [base.imageUrl],
  };
}

const existingIds = new Set(store.products.map((p) => p.id));
headphones.forEach((hp) => {
  const idx = store.products.findIndex((p) => p.id === hp.id);
  const product = enrichProduct(hp);
  if (idx >= 0) store.products[idx] = { ...store.products[idx], ...product };
  else {
    store.products.push(product);
    existingIds.add(hp.id);
  }
});

store.landingProductIds = headphones.map((h) => h.id);
if (!store.settings) store.settings = {};
if (!store.settings.searchResultCounts) store.settings.searchResultCounts = {};
store.settings.searchResultCounts.headphone = 35518;
if (!store.settings.landing) store.settings.landing = {};
store.settings.landing.showStoreGrid = true;
store.settings.landing.showHero = false;
store.settings.landing.searchQuery = "headphone";
store.settings.landing.resultTitle = "headphone";

const trend = (store.trendingSearches || []).find((t) => String(t.label || "").toLowerCase() === "headphone");
if (trend) trend.resultCount = 35518;

fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
console.log("Seeded", headphones.length, "headphone products. landingProductIds:", store.landingProductIds.length);
