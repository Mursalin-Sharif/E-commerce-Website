const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));

const QUERY = "shoes for girls sneakers";

const templates = [
  { name: "Pink Girls Sneakers Lightweight Running Sports Shoes Breathable Mesh", nameBn: "পিঙ্ক মেয়েদের স্নিকার্স লাইটওয়েট স্পোর্টস", brand: "PinkRun", price: 8.5, salePrice: 2.55, discount: 66, sold: 6234, rating: 4.7, reviews: 1124, badge: "PAYDAY SALE", keywords: "shoes for girls sneakers pink lightweight running sports breathable mesh", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 14 },
  { name: "White Girls Canvas Sneakers Low Top Fashion Casual School Shoes", nameBn: "সাদা মেয়েদের ক্যানভাস স্নিকার্স স্কুল জুতা", brand: "CanvasKids", price: 6.8, salePrice: 2.04, discount: 66, sold: 5123, rating: 4.7, reviews: 978, keywords: "shoes for girls sneakers white canvas low top school fashion casual", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 11 },
  { name: "Girls High Top Sneakers Fashion Street Style White Purple Lace Up", nameBn: "মেয়েদের হাই টপ স্নিকার্স ফ্যাশন স্ট্রিট", brand: "StreetGirl", price: 10.5, salePrice: 3.15, discount: 66, sold: 3456, rating: 4.8, reviews: 712, badge: "BEST PRICE", keywords: "shoes for girls sneakers high top fashion street white purple lace", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 16 },
  { name: "Girls Platform Sneakers Chunky Sole Fashion White Pink Trendy", nameBn: "মেয়েদের প্ল্যাটফর্ম স্নিকার্স চাঙ্কি সোল", brand: "ChunkyStep", price: 11.0, salePrice: 3.3, discount: 66, sold: 2890, rating: 4.6, reviews: 534, tag: "CHOICE", keywords: "shoes for girls sneakers platform chunky sole fashion white pink", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 17 },
  { name: "Girls Velcro Sneakers Easy Wear No Lace School Shoes Grey Pink", nameBn: "মেয়েদের ভেলক্রো স্নিকার্স সহজ পরার স্কুল জুতা", brand: "EasyStep", price: 7.5, salePrice: 2.25, discount: 66, sold: 4567, rating: 4.8, reviews: 890, keywords: "shoes for girls sneakers velcro easy wear no lace school grey pink", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 12 },
  { name: "Blue Girls Running Sneakers Cushion Sole Lightweight Jogging Sports", nameBn: "নীল মেয়েদের রানিং স্নিকার্স কুশন সোল", brand: "RunGirl", price: 9.2, salePrice: 2.76, discount: 66, sold: 3789, rating: 4.7, reviews: 645, badge: "FLASH SALE", keywords: "shoes for girls sneakers blue running cushion sole lightweight jogging", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 15 },
  { name: "Girls LED Light Up Sneakers USB Rechargeable Flashing Sole Pink", nameBn: "মেয়েদের LED লাইট আপ স্নিকার্স ফ্ল্যাশিং সোল", brand: "GlowKids", price: 12.5, salePrice: 3.75, discount: 66, sold: 2345, rating: 4.9, reviews: 456, keywords: "shoes for girls sneakers led light up usb rechargeable flashing pink", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 19 },
  { name: "Black Girls Sneakers Classic Lace Up Daily Wear Comfortable Soft", nameBn: "কালো মেয়েদের স্নিকার্স ক্লাসিক লেস আপ", brand: "ClassicGirl", price: 8.0, salePrice: 2.4, discount: 66, sold: 5678, rating: 4.7, reviews: 1023, keywords: "shoes for girls sneakers black classic lace up daily wear comfortable", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 13 },
  { name: "Girls Slip On Sneakers No Lace Elastic Band Easy School Grey", nameBn: "মেয়েদের স্লিপ অন স্নিকার্স ইলাস্টিক ব্যান্ড", brand: "SlipGirl", price: 7.0, salePrice: 2.1, discount: 66, sold: 4123, rating: 4.6, reviews: 789, keywords: "shoes for girls sneakers slip on no lace elastic band easy school grey", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Rangpur", locationBn: "রংপুর", coinsSave: 11 },
  { name: "Purple Girls Sneakers Mesh Upper Breathable Summer Sports Shoes", nameBn: "পার্পল মেয়েদের স্নিকার্স মেশ আপার ব্রিদ্যাবল", brand: "AirGirl", price: 8.8, salePrice: 2.64, discount: 66, sold: 3012, rating: 4.7, reviews: 567, keywords: "shoes for girls sneakers purple mesh upper breathable summer sports", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 14 },
  { name: "Girls Rainbow Color Sneakers Fun Design Kids Casual Shoes Multicolor", nameBn: "মেয়েদের রেইনবো কালার স্নিকার্স মাল্টিকালার", brand: "RainbowKids", price: 9.5, salePrice: 2.85, discount: 66, sold: 2678, rating: 4.8, reviews: 498, badge: "PAYDAY SALE", keywords: "shoes for girls sneakers rainbow color fun design kids casual multicolor", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 15 },
  { name: "Girls Skate Sneakers Flat Sole Grip Tape Style White Black", nameBn: "মেয়েদের স্কেট স্নিকার্স ফ্ল্যাট সোল গ্রিপ", brand: "SkateGirl", price: 10.0, salePrice: 3.0, discount: 66, sold: 1890, rating: 4.6, reviews: 345, keywords: "shoes for girls sneakers skate flat sole grip tape style white black", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 16 },
  { name: "Red Girls Sneakers Sporty Design Running Training Non Slip Sole", nameBn: "লাল মেয়েদের স্নিকার্স স্পোর্টি ডিজাইন", brand: "SportyGirl", price: 8.2, salePrice: 2.46, discount: 66, sold: 3456, rating: 4.7, reviews: 612, keywords: "shoes for girls sneakers red sporty design running training non slip", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 13 },
  { name: "Girls Glitter Sneakers Sparkle Party Shoes Pink Gold Shiny", nameBn: "মেয়েদের গ্লিটার স্নিকার্স স্পার্কল পার্টি", brand: "SparkleStep", price: 11.5, salePrice: 3.45, discount: 66, sold: 1567, rating: 4.9, reviews: 289, tag: "CHOICE", keywords: "shoes for girls sneakers glitter sparkle party pink gold shiny", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 18 },
  { name: "Green Girls Sneakers Eco Friendly Canvas Casual Everyday Shoes", nameBn: "সবুজ মেয়েদের স্নিকার্স ইকো ফ্রেন্ডলি ক্যানভাস", brand: "EcoGirl", price: 7.8, salePrice: 2.34, discount: 66, sold: 2234, rating: 4.6, reviews: 412, keywords: "shoes for girls sneakers green eco friendly canvas casual everyday", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 12 },
  { name: "Girls Mid Top Sneakers Ankle Support Basketball Style White Red", nameBn: "মেয়েদের মিড টপ স্নিকার্স অ্যাঙ্কল সাপোর্ট", brand: "CourtGirl", price: 10.8, salePrice: 3.24, discount: 66, sold: 1789, rating: 4.7, reviews: 334, keywords: "shoes for girls sneakers mid top ankle support basketball style white red", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 17 },
  { name: "Yellow Girls Sneakers Bright Color Fun School Casual Shoes", nameBn: "হলুদ মেয়েদের স্নিকার্স উজ্জ্বল রঙ স্কুল", brand: "SunnyStep", price: 7.2, salePrice: 2.16, discount: 66, sold: 2890, rating: 4.6, reviews: 523, keywords: "shoes for girls sneakers yellow bright color fun school casual", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Rangpur", locationBn: "রংপুর", coinsSave: 11 },
  { name: "Girls Double Strap Sneakers Hook Loop Fastener School Shoes Navy", nameBn: "মেয়েদের ডাবল স্ট্র্যাপ স্নিকার্স হুক লুপ", brand: "FastGirl", price: 8.5, salePrice: 2.55, discount: 66, sold: 3345, rating: 4.8, reviews: 678, badge: "BEST PRICE", keywords: "shoes for girls sneakers double strap hook loop fastener school navy", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 14 },
  { name: "Girls Wedge Sneakers Hidden Heel Fashion Casual White Beige", nameBn: "মেয়েদের ওয়েজ স্নিকার্স হিডেন হিল ফ্যাশন", brand: "WedgeGirl", price: 11.8, salePrice: 3.54, discount: 66, sold: 1456, rating: 4.7, reviews: 267, keywords: "shoes for girls sneakers wedge hidden heel fashion casual white beige", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 19 },
  { name: "Orange Girls Sneakers Bold Color Sports Running Lightweight Mesh", nameBn: "কমলা মেয়েদের স্নিকার্স বোল্ড কালার স্পোর্টস", brand: "BoldRun", price: 8.6, salePrice: 2.58, discount: 66, sold: 2123, rating: 4.6, reviews: 389, keywords: "shoes for girls sneakers orange bold color sports running lightweight mesh", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 14 },
  { name: "Girls Star Print Sneakers Cute Design Kids Fashion White Blue", nameBn: "মেয়েদের স্টার প্রিন্ট স্নিকার্স কিউট ডিজাইন", brand: "StarKids", price: 7.9, salePrice: 2.37, discount: 66, sold: 3789, rating: 4.8, reviews: 712, keywords: "shoes for girls sneakers star print cute design kids fashion white blue", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 13 },
  { name: "Girls Memory Foam Sneakers Ultra Soft Insole All Day Comfort Pink", nameBn: "মেয়েদের মেমরি ফোম স্নিকার্স আল্ট্রা সফট", brand: "CloudStep", price: 9.8, salePrice: 2.94, discount: 66, sold: 2567, rating: 4.9, reviews: 534, badge: "FLASH SALE", keywords: "shoes for girls sneakers memory foam ultra soft insole all day comfort pink", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 16 },
  { name: "Girls Retro Sneakers Vintage Style Color Block White Red Blue", nameBn: "মেয়েদের রেট্রো স্নিকার্স ভিনটেজ স্টাইল", brand: "RetroGirl", price: 10.2, salePrice: 3.06, discount: 66, sold: 1890, rating: 4.7, reviews: 356, keywords: "shoes for girls sneakers retro vintage style color block white red blue", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 16 },
  { name: "Girls Waterproof Sneakers Rain Ready Rubber Toe Cap Black Pink", nameBn: "মেয়েদের ওয়াটারপ্রুফ স্নিকার্স রেইন রেডি", brand: "RainGirl", price: 11.2, salePrice: 3.36, discount: 66, sold: 1678, rating: 4.8, reviews: 298, mall: true, keywords: "shoes for girls sneakers waterproof rain ready rubber toe cap black pink", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 18 },
];

const shoes = templates.map((t, i) => ({ id: `sfgs${i + 1}`, ...t }));

function enrich(base) {
  return {
    category: "shoes",
    active: true,
    description: `${base.name}\n\nStylish girls sneakers for school, sports, and daily wear. Breathable mesh, cushioned sole, and trendy designs kids love.\n\nCash on delivery across Bangladesh. Rated ${base.rating}★ from ${base.reviews}+ reviews with ${base.sold}+ sold.`,
    descriptionBn: `${base.nameBn || base.name} — মেয়েদের স্টাইলিশ স্নিকার্স। স্কুল, স্পোর্টস ও দৈনন্দিন ব্যবহারের জন্য। ক্যাশ অন ডেলিভারি সারাদেশে।`,
    highlights: [
      `${base.brand} girls sneakers`,
      `${base.discount}% off vs listed price`,
      `${base.sold}+ units sold`,
      "Breathable & lightweight — all-day comfort",
      "Non-slip sole — school & sports ready",
      "Cash on delivery · 7-day easy size exchange",
    ],
    highlightsBn: [
      `${base.brand} মেয়েদের স্নিকার্স`,
      `${base.discount}% ছাড়`,
      `${base.sold}+ বিক্রি`,
      "ব্রিদ্যাবল ও লাইটওয়েট",
      "নন-স্লিপ সোল",
      "ক্যাশ অন ডেলিভারি · ৭ দিনের সাইজ এক্সচেঞ্জ",
    ],
    specs: [
      { label: "Brand", labelBn: "ব্র্যান্ড", value: base.brand },
      { label: "Gender", labelBn: "জেন্ডার", value: "Girls" },
      { label: "Type", labelBn: "টাইপ", value: "Sneakers" },
      { label: "Use", labelBn: "ব্যবহার", value: "School / Sports / Casual" },
    ],
    boxContents: ["1 pair of sneakers", "Extra laces", "Size guide card"],
    boxContentsBn: ["১ জোড়া স্নিকার্স", "অতিরিক্ত লেস", "সাইজ গাইড কার্ড"],
    warranty: "7-day easy return for size mismatch or manufacturing defect.",
    warrantyBn: "সাইজ মিসম্যাচ বা ত্রুটির জন্য ৭ দিনের সহজ রিটার্ন।",
    ...base,
    imageUrl: base.imageUrl,
    imageGallery: [base.imageUrl],
  };
}

shoes.forEach((item) => {
  const idx = store.products.findIndex((p) => p.id === item.id);
  const product = enrich(item);
  if (idx >= 0) store.products[idx] = { ...store.products[idx], ...product };
  else store.products.push(product);
});

if (!store.settings) store.settings = {};
if (!store.settings.searchResultCounts) store.settings.searchResultCounts = {};
store.settings.searchResultCounts[QUERY] = 1017;
store.settings.shoesForGirlsSneakers = {
  searchQuery: QUERY,
  resultTitle: QUERY,
};
store.shoesForGirlsSneakersProductIds = shoes.map((s) => s.id);

if (!store.trendingSearches) store.trendingSearches = [];
const trend = store.trendingSearches.find((t) => String(t.label || "").toLowerCase() === QUERY);
if (trend) trend.resultCount = 1017;
else store.trendingSearches.unshift({ label: QUERY, resultCount: 1017 });

fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
console.log("Seeded", shoes.length, "shoes for girls sneakers products. shoesForGirlsSneakersProductIds:", store.shoesForGirlsSneakersProductIds.length);
