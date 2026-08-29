const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));

const watches = [
  {
    id: "wm1",
    name: "Poedagar PO615 Black Stainless Steel Analog Wrist Watch For Men - Time lovers",
    nameBn: "Poedagar PO615 স্টেইনলেস স্টিল অ্যানালগ মen's ওয়াচ",
    brand: "Poedagar",
    price: 19.08,
    salePrice: 3.98,
    discount: 75,
    sold: 611,
    rating: 5,
    reviews: 137,
    badge: "PAYDAY SALE",
    tag: "CHOICE",
    keywords: "watch for man men watch analog wrist watch stainless steel poedagar",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#1a1a1a",
  },
  {
    id: "wm2",
    name: "Men Leather Analog Quartz Fashion Watch for Men Casual Business",
    nameBn: "পুরুষদের লেদার অ্যানালগ কোয়ার্টজ ফ্যাশন ওয়াচ",
    brand: "Time lovers",
    price: 8.04,
    salePrice: 1.74,
    discount: 74,
    sold: 892,
    rating: 4.9,
    reviews: 203,
    badge: "PAYDAY SALE",
    keywords: "watch for man leather analog quartz fashion men",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#3d2914",
  },
  {
    id: "wm3",
    name: "Poedagar Luxury Chronograph Stainless Steel Watch For Men Waterproof",
    nameBn: "Poedagar লাক্সারি ক্রোনোগ্রাফ স্টিল ওয়াচ",
    brand: "Poedagar",
    price: 22.5,
    salePrice: 5.25,
    discount: 72,
    sold: 10900,
    rating: 5,
    reviews: 1842,
    badge: "BEST PRICE",
    tag: "CHOICE",
    keywords: "watch for man chronograph luxury stainless waterproof",
    imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0a50a6?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#c0c0c0",
  },
  {
    id: "wm4",
    name: "Curren 8395 Men Sport Quartz Watch With Date Display Black Dial",
    nameBn: "Curren 8395 স্পোর্ট কোয়ার্টজ ওয়াচ",
    brand: "Curren",
    price: 14.4,
    salePrice: 3.6,
    discount: 70,
    sold: 2340,
    rating: 4.8,
    reviews: 456,
    badge: "PAYDAY SALE",
    keywords: "watch for man curren sport quartz date black",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94a0d2?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#111111",
  },
  {
    id: "wm5",
    name: "Naviforce NF9117 Dual Display Military Style Men Watch",
    nameBn: "Naviforce NF9117 মিলিটারি স্টাইল মen's ওয়াচ",
    brand: "Naviforce",
    price: 18.0,
    salePrice: 4.5,
    discount: 68,
    sold: 567,
    rating: 4.7,
    reviews: 98,
    keywords: "watch for man naviforce military dual display",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7a8a066e7861?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#2c3e50",
  },
  {
    id: "wm6",
    name: "Olevs 6898 Gold Stainless Steel Waterproof Analog Watch For Men",
    nameBn: "Olevs 6898 গোল্ড স্টিল ওয়াচ",
    brand: "Olevs",
    price: 16.8,
    salePrice: 4.2,
    discount: 71,
    sold: 3200,
    rating: 5,
    reviews: 612,
    badge: "BEST PRICE",
    keywords: "watch for man olevs gold stainless waterproof analog",
    imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#d4af37",
  },
  {
    id: "wm7",
    name: "Megir Chronograph Leather Strap Business Watch For Men Brown",
    nameBn: "Megir ক্রোনোগ্রাফ লেদার স্ট্র্যাপ বিজনেস ওয়াচ",
    brand: "Megir",
    price: 12.6,
    salePrice: 3.15,
    discount: 69,
    sold: 445,
    rating: 4.6,
    reviews: 67,
    badge: "PAYDAY SALE",
    keywords: "watch for man megir chronograph leather business brown",
    imageUrl: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#8b4513",
  },
  {
    id: "wm8",
    name: "Skmei 9106 Digital Sport Watch For Men Alarm Stopwatch LED",
    nameBn: "Skmei 9106 ডিজিটাল স্পোর্ট ওয়াচ",
    brand: "Skmei",
    price: 6.0,
    salePrice: 1.5,
    discount: 65,
    sold: 7800,
    rating: 4.5,
    reviews: 1204,
    keywords: "watch for man skmei digital sport alarm led",
    imageUrl: "https://images.unsplash.com/photo-1547996160-6813f9838751?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#000000",
  },
  {
    id: "wm9",
    name: "Benyar BY-5123 Classic Round Dial Minimalist Men Watch Silver",
    nameBn: "Benyar BY-5123 ক্লাসিক মিনimalist ওয়াচ",
    brand: "Benyar",
    price: 9.6,
    salePrice: 2.4,
    discount: 66,
    sold: 156,
    rating: 4.8,
    reviews: 34,
    keywords: "watch for man benyar classic minimalist silver round",
    imageUrl: "https://images.unsplash.com/photo-1508685098649-33aac8140ddb?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#bdc3c7",
  },
  {
    id: "wm10",
    name: "LIGE LG8918 Automatic Mechanical Skeleton Watch For Men Luxury",
    nameBn: "LIGE LG8918 অটোমেটিক স্কেলেটন ওয়াচ",
    brand: "LIGE",
    price: 28.8,
    salePrice: 7.2,
    discount: 73,
    sold: 289,
    rating: 4.9,
    reviews: 51,
    badge: "BEST PRICE",
    tag: "CHOICE",
    keywords: "watch for man lige automatic mechanical skeleton luxury",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#1c2833",
  },
  {
    id: "wm11",
    name: "Wwoor WR8801 Ultra Thin Dress Watch For Men Black Leather Band",
    nameBn: "Wwoor WR8801 আল্ট্রা থিন ড্রেস ওয়াচ",
    brand: "Wwoor",
    price: 10.8,
    salePrice: 2.7,
    discount: 67,
    sold: 923,
    rating: 4.7,
    reviews: 145,
    badge: "PAYDAY SALE",
    keywords: "watch for man wwoor dress thin leather black",
    imageUrl: "https://images.unsplash.com/photo-1495854532617-8f1a3291ba2f?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#2c2c2c",
  },
  {
    id: "wm12",
    name: "Casio Style MTP-V003D Classic Silver Bracelet Watch For Men",
    nameBn: "Casio স্টাইল ক্লাসিক সিলভার ব্রেসলেট ওয়াচ",
    brand: "Casio Style",
    price: 7.2,
    salePrice: 1.8,
    discount: 64,
    sold: 4100,
    rating: 4.6,
    reviews: 890,
    keywords: "watch for man casio style classic silver bracelet",
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#ecf0f1",
  },
];

function enrich(base) {
  const catName = "Eyewear & Watches";
  return {
    category: "eyewear",
    active: true,
    location: "Dhaka",
    locationBn: "ঢাকা",
    coinsSave: 2 + (parseInt(base.id.replace(/\D/g, ""), 10) % 6) * 4,
    description: `${base.name} — premium men's wristwatch trusted by shoppers across Bangladesh.\n\nStainless steel / leather build, accurate quartz movement, and water-resistant design for daily wear. Ideal for office, casual, and gift occasions.\n\nCash on delivery, easy returns, and fast shipping to Dhaka and major cities. Rated ${base.rating}★ from ${base.reviews}+ reviews with ${base.sold}+ sold.`,
    descriptionBn: `${base.nameBn || base.name} — বাংলাদেশজুড়ে জনপ্রিয় পুরুষদের wristwatch। সঠিক সময়, durable বিল্ড ও everyday ব্যবহারের জন্য ideal। ক্যাশ অন ডেলিভারি ও সহজ রিটার্ন।`,
    highlights: [
      `${base.brand} quality men's analog watch`,
      `${base.discount}% off vs listed price`,
      `${base.sold}+ units sold nationwide`,
      "Water-resistant for daily use",
      "Cash on delivery across Bangladesh",
      "1-year seller warranty on eligible orders",
    ],
    highlightsBn: [
      `${base.brand} ব্র্যান্ডের মানসম্মত ওয়াচ`,
      `${base.discount}% ছাড়`,
      `${base.sold}+ বিক্রি`,
      "দৈনন্দিন ব্যবহারে water-resistant",
      "ক্যাশ অন ডেলিভারি",
      "১ বছর সেলার ওয়ারেন্টি (যোগ্য অর্ডারে)",
    ],
    specs: [
      { label: "Brand", labelBn: "ব্র্যান্ড", value: base.brand },
      { label: "Category", labelBn: "ক্যাটাগরি", value: catName },
      { label: "Movement", labelBn: "মুভমেন্ট", value: "Quartz analog" },
      { label: "Gender", labelBn: "জেন্ডার", value: "Men" },
      { label: "Strap", labelBn: "স্ট্র্যাপ", value: "Stainless steel / Leather" },
      { label: "Water Resistance", labelBn: "ওয়াটার রেজিস্ট্যান্স", value: "3 ATM (daily splash)" },
    ],
    boxContents: ["1 × Wrist Watch", "User manual", "Gift box"],
    boxContentsBn: ["১ × wrist watch", "ইউজার ম্যানুয়াল", "গিফট বক্স"],
    warranty: "1-year seller warranty; 7-day easy return if defective.",
    warrantyBn: "১ বছর সেলার ওয়ারেন্টি; ত্রুটিপূর্ণ হলে ৭ দিনের সহজ রিটার্ন।",
    ...base,
    imageUrl: base.imageUrl,
    imageGallery: [base.imageUrl],
  };
}

const existingIds = new Set(store.products.map((p) => p.id));
watches.forEach((w) => {
  const idx = store.products.findIndex((p) => p.id === w.id);
  const product = enrich(w);
  if (idx >= 0) store.products[idx] = { ...store.products[idx], ...product };
  else {
    store.products.push(product);
    existingIds.add(w.id);
  }
});

if (!store.settings) store.settings = {};
if (!store.settings.searchResultCounts) store.settings.searchResultCounts = {};
store.settings.searchResultCounts["watch for man"] = 42190;
store.settings.watch = {
  searchQuery: "watch for man",
  resultTitle: "watch for man",
};
store.watchProductIds = watches.map((w) => w.id);

const trend = (store.trendingSearches || []).find((t) => String(t.label || "").toLowerCase() === "watch for man");
if (trend) trend.resultCount = 42190;

fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
console.log("Seeded", watches.length, "watch products. watchProductIds:", store.watchProductIds.length);
