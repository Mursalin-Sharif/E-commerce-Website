const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "js", "data.js");
const code = fs.readFileSync(dataPath, "utf8") + `
;return { WHATSAPP_NUMBER, CATEGORIES, PRODUCTS, REVIEWS };
`;
const { WHATSAPP_NUMBER, CATEGORIES, PRODUCTS, REVIEWS } = new Function(code)();

const store = {
  settings: {
    siteName: "E-commerce Website",
    siteNameBn: "ই-কমার্স ওয়েবসাইট",
    whatsapp: WHATSAPP_NUMBER,
    searchPlaceholder: "Search in E-commerce Website",
    searchPlaceholderBn: "E-commerce Website এ সার্চ করুন",
    showHero: false,
  },
  categories: CATEGORIES,
  products: PRODUCTS.map((p) => ({ ...p, imageUrl: "", active: true })),
  banners: [
    {
      id: "b1",
      title: "Fast Delivery",
      titleBn: "দ্রুত ডেলিভারি",
      stats: ["2500+ SELLERS", "NATIONWIDE DELIVERY", "50K+ PRODUCTS"],
      subtitle: "Experience Delivery Like Never Before",
      subtitleBn: "আগের চেয়ে দ্রুত ডেলিভারি",
      cta: "Shop Now",
      ctaBn: "এখনই কিনুন",
      href: "home.html",
      theme: "delivery",
      active: true,
    },
    {
      id: "b2",
      title: "Mega Electronics Sale",
      titleBn: "মেগা ইলেকট্রনিক্স সেল",
      stats: ["UP TO 40% OFF", "HOT DEALS", "FREE RETURNS"],
      subtitle: "Phones, gadgets & accessories — limited time",
      subtitleBn: "ফোন, গ্যাজেট ও এক্সেসরিজ — সীমিত সময়",
      cta: "Shop Now",
      ctaBn: "এখনই কিনুন",
      href: "home.html?q=electronics",
      theme: "sale",
      active: true,
    },
    {
      id: "b3",
      title: "Fashion Week Deals",
      titleBn: "ফ্যাশন উইক ডিল",
      stats: ["NEW ARRIVALS", "TRENDING", "ALL SIZES"],
      subtitle: "Apparel & accessories for every style",
      subtitleBn: "সব স্টাইলের পোশাক ও এক্সেসরিজ",
      cta: "Shop Now",
      ctaBn: "এখনই কিনুন",
      href: "category.html?cat=apparel",
      theme: "fashion",
      active: true,
    },
    {
      id: "b4",
      title: "Home Essentials",
      titleBn: "হোম এসেনশিয়াল",
      stats: ["APPLIANCES", "BEST PRICE", "FAST SHIP"],
      subtitle: "Upgrade your home with trusted brands",
      subtitleBn: "ব trusted ব্র্যান্ড দিয়ে ঘর সাজান",
      cta: "Shop Now",
      ctaBn: "এখনই কিনুন",
      href: "category.html?cat=appliances",
      theme: "home",
      active: true,
    },
  ],
  flashSaleIds: ["p2", "p5", "p9", "p12", "p23", "p27", "p34", "p36", "p1", "p6"],
  featuredCategoryIds: ["apparel", "electronics", "sports", "jewelry", "eyewear", "shoes", "home-garden", "sportswear"],
  homeCategoryIcons: [
    { id: "hci1", categoryId: "electronics", icon: "📱", label: "Mobile", labelBn: "মোবাইল" },
    { id: "hci2", categoryId: "apparel", icon: "👕", label: "Fashion", labelBn: "ফ্যাশন" },
    { id: "hci3", categoryId: "beauty", icon: "💄", label: "Beauty", labelBn: "বিউটি" },
    { id: "hci4", categoryId: "appliances", icon: "🏠", label: "Home", labelBn: "হোম" },
    { id: "hci5", categoryId: "sports", icon: "⚽", label: "Sports", labelBn: "স্পোর্টস" },
    { id: "hci6", categoryId: "kids", icon: "🧸", label: "Kids", labelBn: "কিডস" },
    { id: "hci7", categoryId: "food", icon: "🍵", label: "Grocery", labelBn: "গrocery" },
    { id: "hci8", categoryId: "vehicles", icon: "🛵", label: "Vehicles", labelBn: "যানবাহন" },
  ],
  homeProductIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12"],
  reviews: REVIEWS,
};

const out = path.join(__dirname, "..", "data", "store.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(store, null, 2));
console.log("Created", out);
