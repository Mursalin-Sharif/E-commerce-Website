const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));

const shirts = [
  {
    id: "ts1",
    name: "Fashionable New Design Digital Printed T-shirt For Men",
    nameBn: "ডিজিটাল প্রিন্টেড টি-শার্ট পুরুষদের জন্য",
    brand: "Fashion BD",
    price: 0.72,
    salePrice: 0.72,
    discount: 59,
    sold: 179,
    rating: 5,
    reviews: 21,
    badge: "PAYDAY SALE",
    keywords: "t shirt tshirt men fashion printed",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#ffffff",
  },
  {
    id: "ts2",
    name: "New Joker Fashionable Design Digital Printed T-shirt For Men",
    nameBn: "জোকার ডিজাইন প্রিন্টেড টি-শার্ট",
    brand: "Joker Wear",
    price: 0.68,
    salePrice: 0.68,
    discount: 62,
    sold: 249,
    rating: 5,
    reviews: 42,
    badge: "PAYDAY SALE",
    keywords: "t shirt joker printed men",
    imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#bdc3c7",
  },
  {
    id: "ts3",
    name: "Polycotton Kaporer Half Sleeve T Shirt For Men Summer Collection",
    nameBn: "পলিকটন হাফ স্লিভ টি-শার্ট",
    brand: "Kaporer",
    price: 0.77,
    salePrice: 0.77,
    discount: 54,
    sold: 126,
    rating: 4.9,
    reviews: 18,
    keywords: "t shirt polycotton half sleeve summer",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#2c3e50",
  },
  {
    id: "ts4",
    name: "Eagle Print Long Sleeve T-Shirt For Men Premium Cotton",
    nameBn: "ইগল প্রিন্ট লং স্লিভ টি-শার্ট",
    brand: "Street Style",
    price: 0.95,
    salePrice: 0.95,
    discount: 48,
    sold: 88,
    rating: 4.8,
    reviews: 15,
    keywords: "t shirt long sleeve eagle print",
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#1a237e",
  },
  {
    id: "ts5",
    name: "Oversized Graphic Tee Unisex Streetwear T-Shirt",
    nameBn: "ওভারসাইজ গ্রাফিক টি-শার্ট",
    brand: "Urban Fit",
    price: 0.82,
    salePrice: 0.82,
    discount: 55,
    sold: 312,
    rating: 5,
    reviews: 56,
    badge: "BEST PRICE",
    keywords: "t shirt oversized graphic unisex",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-6a8c0609a369?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#95a5a6",
  },
  {
    id: "ts6",
    name: "Premium Cotton Round Neck T-Shirt Pack of 2 For Men",
    nameBn: "প্রিমিয়াম কটন রাউন্ড নেক টি-শার্ট ২ পিস",
    brand: "Comfort Wear",
    price: 1.15,
    salePrice: 1.15,
    discount: 40,
    sold: 445,
    rating: 4.9,
    reviews: 89,
    keywords: "t shirt cotton round neck pack",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#ecf0f1",
  },
  {
    id: "ts7",
    name: "Tie Dye Colorful T-Shirt For Men and Women Trendy",
    nameBn: "টাই ডাই কালারফুল টি-শার্ট",
    brand: "Color Pop",
    price: 0.74,
    salePrice: 0.74,
    discount: 57,
    sold: 167,
    rating: 4.7,
    reviews: 33,
    keywords: "t shirt tie dye colorful trendy",
    imageUrl: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#9b59b6",
  },
  {
    id: "ts8",
    name: "Sports Dry Fit Gym T-Shirt Quick Dry Breathable",
    nameBn: "স্পোর্টস ড্রাই ফিট জিম টি-শার্ট",
    brand: "ActivePro",
    price: 0.65,
    salePrice: 0.65,
    discount: 65,
    sold: 520,
    rating: 5,
    reviews: 112,
    badge: "FLASH SALE",
    keywords: "t shirt sports gym dry fit",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-f397f2412458?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#27ae60",
  },
  {
    id: "ts9",
    name: "Vintage Wash Distressed T-Shirt Street Fashion Men",
    nameBn: "ভিন্টেজ ওয়াশ ডিস্ট্রেসড টি-শার্ট",
    brand: "Retro Lane",
    price: 0.88,
    salePrice: 0.88,
    discount: 50,
    sold: 203,
    rating: 4.8,
    reviews: 47,
    keywords: "t shirt vintage wash street",
    imageUrl: "https://images.unsplash.com/photo-1571941757769-0e2f7d2c3e2c?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#7f8c8d",
  },
  {
    id: "ts10",
    name: "Striped Casual T-Shirt For Men Soft Cotton Blend",
    nameBn: "স্ট্রাইপ ক্যাজুয়াল টি-শার্ট",
    brand: "Daily Wear",
    price: 0.7,
    salePrice: 0.7,
    discount: 58,
    sold: 134,
    rating: 4.6,
    reviews: 24,
    keywords: "t shirt striped casual cotton",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#3498db",
  },
  {
    id: "ts11",
    name: "Anime Character Printed T-Shirt For Boys and Girls",
    nameBn: "অ্যানিমে ক্যারেক্টার প্রিন্টেড টি-শার্ট",
    brand: "Otaku Style",
    price: 0.79,
    salePrice: 0.79,
    discount: 52,
    sold: 278,
    rating: 5,
    reviews: 61,
    keywords: "t shirt anime printed kids",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#e74c3c",
  },
  {
    id: "ts12",
    name: "Polo Collar T-Shirt For Men Office Casual Smart Fit",
    nameBn: "পোলো কলার টি-শার্ট পুরুষদের জন্য",
    brand: "SmartLine",
    price: 1.05,
    salePrice: 1.05,
    discount: 42,
    sold: 156,
    rating: 4.9,
    reviews: 38,
    mall: true,
    badge: "Official Store",
    keywords: "t shirt polo collar office men",
    imageUrl: "https://images.unsplash.com/photo-1562157873-5e87bf91139a?auto=format&fit=crop&w=800&h=800&q=80",
    color: "#2c3e50",
  },
];

function enrich(base) {
  const cat = store.categories.find((c) => c.id === "apparel") || store.categories[0];
  const catName = cat ? cat.name : "Apparel";
  return {
    category: cat ? cat.id : "apparel",
    active: true,
    location: "Dhaka",
    locationBn: "ঢাকা",
    coinsSave: 2 + (parseInt(base.id.replace(/\D/g, ""), 10) % 4),
    description: `${base.name} — premium quality ${catName} for everyday wear in Bangladesh.\n\nSoft fabric, modern fit, and durable print. Perfect for casual outings, gym, or street style. Cash on delivery available nationwide.\n\nRated ${base.rating}★ from ${base.reviews}+ reviews. ${base.sold}+ sold across Dhaka and major cities.`,
    descriptionBn: `${base.nameBn || base.name} — বাংলাদেশে প্রতিদিনের ব্যবহারের জন্য মানসম্মত ${catName}। ক্যাশ অন ডেলিভারি সুবিধা।`,
    highlights: [
      "Soft breathable fabric",
      `${base.discount}% discount vs listed price`,
      `${base.sold}+ units sold`,
      "Cash on delivery nationwide",
      "Easy size exchange policy",
    ],
    highlightsBn: ["নরম ও আরামদায়ক কাপড়", `${base.discount}% ছাড়`, `${base.sold}+ বিক্রি`, "ক্যাশ অন ডেলিভারি", "সাইজ এক্সচেঞ্জ সুবিধা"],
    specs: [
      { label: "Brand", labelBn: "ব্র্যান্ড", value: base.brand },
      { label: "Category", labelBn: "ক্যাটাগরি", value: catName },
      { label: "Material", labelBn: "ম্যাটেরিয়াল", value: "Cotton / Polycotton blend" },
      { label: "Fit", labelBn: "ফিট", value: "Regular fit" },
      { label: "Care", labelBn: "কেয়ার", value: "Machine wash cold" },
    ],
    boxContents: ["1 × T-Shirt", "Brand tag / packaging"],
    boxContentsBn: ["১ × টি-শার্ট", "ব্র্যান্ড ট্যাগ / প্যাকেজিং"],
    warranty: "7-day easy return if size/color mismatch.",
    warrantyBn: "সাইজ/কালার মিসম্যাচ হলে ৭ দিনের সহজ রিটার্ন।",
    imageGallery: [base.imageUrl],
    colors: [
      { label: "White", image: base.imageUrl },
      { label: "Black", image: base.imageUrl },
      { label: "Navy", image: base.imageUrl },
    ],
    storageOptions: ["S", "M", "L", "XL", "XXL"],
    ...base,
    imageUrl: base.imageUrl,
    imageGallery: [base.imageUrl],
    colors: [
      { label: "White", image: base.imageUrl },
      { label: "Black", image: base.imageUrl },
      { label: "Navy", image: base.imageUrl },
    ],
  };
}

shirts.forEach((s) => {
  const idx = store.products.findIndex((p) => p.id === s.id);
  const product = enrich(s);
  if (idx >= 0) store.products[idx] = { ...store.products[idx], ...product };
  else store.products.push(product);
});

const p1 = store.products.find((p) => p.id === "p1");
if (p1) {
  p1.imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&h=800&q=80&sig=p1";
  p1.imageGallery = [p1.imageUrl];
  p1.keywords = "t shirt tshirt classic cotton tee men";
  p1.salePrice = 1.48;
  p1.price = 1.9;
  p1.discount = 22;
}

if (!store.settings) store.settings = {};
if (!store.settings.searchResultCounts) store.settings.searchResultCounts = {};
store.settings.searchResultCounts["t shirt"] = 8310;
if (!store.settings.tshirt) store.settings.tshirt = {};
store.settings.tshirt.searchQuery = "t shirt";
store.settings.tshirt.resultTitle = "t shirt";
store.tshirtProductIds = shirts.map((s) => s.id);

fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
console.log("Seeded", shirts.length, "t-shirt products. tshirtProductIds:", store.tshirtProductIds.length);
