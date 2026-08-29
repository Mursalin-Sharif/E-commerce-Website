const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));

const QUERY = "shoes for girls sneakers black and white";

const templates = [
  { name: "Black White Girls Sneakers Two Tone Classic School Casual Shoes", nameBn: "কালো সাদা মেয়েদের স্নিকার্স টু টোন", brand: "TwoTone", price: 7.8, salePrice: 2.34, discount: 66, sold: 3890, rating: 4.8, reviews: 698, badge: "BEST PRICE", keywords: "shoes for girls sneakers black and white two tone classic school casual", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 12 },
  { name: "Girls Black White Canvas Sneakers Low Top Lace Up Daily Wear", nameBn: "মেয়েদের কালো সাদা ক্যানভাস স্নিকার্স", brand: "CanvasKids", price: 6.8, salePrice: 2.04, discount: 66, sold: 5123, rating: 4.7, reviews: 978, keywords: "shoes for girls sneakers black and white canvas low top lace daily", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 11 },
  { name: "Black White Girls High Top Sneakers Color Block Street Fashion", nameBn: "কালো সাদা হাই টপ স্নিকার্স কালার ব্লক", brand: "StreetGirl", price: 10.5, salePrice: 3.15, discount: 66, sold: 3456, rating: 4.8, reviews: 712, keywords: "shoes for girls sneakers black and white high top color block street", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 16 },
  { name: "Girls Panda Sneakers Black White Cute Design Kids Casual Shoes", nameBn: "মেয়েদের পান্ডা স্নিকার্স কালো সাদা কিউট", brand: "PandaKids", price: 8.5, salePrice: 2.55, discount: 66, sold: 4234, rating: 4.9, reviews: 812, tag: "CHOICE", keywords: "shoes for girls sneakers black and white panda cute design kids casual", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 14 },
  { name: "Black White Girls Running Sneakers Cushion Sole Lightweight Sports", nameBn: "কালো সাদা রানিং স্নিকার্স কুশন সোল", brand: "RunGirl", price: 9.2, salePrice: 2.76, discount: 66, sold: 3789, rating: 4.7, reviews: 645, badge: "PAYDAY SALE", keywords: "shoes for girls sneakers black and white running cushion sole lightweight", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 15 },
  { name: "Girls Zebra Print Sneakers Black White Pattern Fashion School", nameBn: "মেয়েদের জেব্রা প্রিন্ট স্নিকার্স কালো সাদা", brand: "ZebraStep", price: 8.0, salePrice: 2.4, discount: 66, sold: 2678, rating: 4.6, reviews: 534, keywords: "shoes for girls sneakers black and white zebra print pattern fashion school", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 13 },
  { name: "Black White Girls Platform Sneakers Chunky Sole Trendy Two Tone", nameBn: "কালো সাদা প্ল্যাটফর্ম স্নিকার্স চাঙ্কি সোল", brand: "ChunkyStep", price: 11.0, salePrice: 3.3, discount: 66, sold: 1890, rating: 4.7, reviews: 412, keywords: "shoes for girls sneakers black and white platform chunky sole trendy", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Rangpur", locationBn: "রংপুর", coinsSave: 17 },
  { name: "Girls Contrast Sole Sneakers Black Upper White Sole School Shoes", nameBn: "মেয়েদের কনট্রাস্ট সোল স্নিকার্স কালো আপার", brand: "ContrastStep", price: 7.5, salePrice: 2.25, discount: 66, sold: 4567, rating: 4.8, reviews: 890, keywords: "shoes for girls sneakers black and white contrast sole black upper white sole", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 12 },
  { name: "Black White Girls Velcro Sneakers Easy Wear No Lace School", nameBn: "কালো সাদা ভেলক্রো স্নিকার্স সহজ পরার", brand: "EasyStep", price: 7.2, salePrice: 2.16, discount: 66, sold: 3345, rating: 4.7, reviews: 678, keywords: "shoes for girls sneakers black and white velcro easy wear no lace school", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 11 },
  { name: "Girls Star Print Sneakers Black White Cute Kids Fashion Shoes", nameBn: "মেয়েদের স্টার প্রিন্ট স্নিকার্স কালো সাদা", brand: "StarKids", price: 7.9, salePrice: 2.37, discount: 66, sold: 2789, rating: 4.8, reviews: 512, keywords: "shoes for girls sneakers black and white star print cute kids fashion", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 13 },
  { name: "Black White Girls Slip On Sneakers Elastic Band Casual Daily", nameBn: "কালো সাদা স্লিপ অন স্নিকার্স ইলাস্টিক", brand: "SlipGirl", price: 7.0, salePrice: 2.1, discount: 66, sold: 3123, rating: 4.6, reviews: 589, keywords: "shoes for girls sneakers black and white slip on elastic band casual daily", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 11 },
  { name: "Girls Retro Sneakers Black White Vintage Color Block Classic", nameBn: "মেয়েদের রেট্রো স্নিকার্স কালো সাদা ভিনটেজ", brand: "RetroGirl", price: 10.2, salePrice: 3.06, discount: 66, sold: 1890, rating: 4.7, reviews: 356, badge: "FLASH SALE", keywords: "shoes for girls sneakers black and white retro vintage color block classic", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 16 },
  { name: "Black White Girls Mesh Sneakers Breathable Summer Sports Lightweight", nameBn: "কালো সাদা মেশ স্নিকার্স ব্রিদ্যাবল", brand: "AirGirl", price: 8.8, salePrice: 2.64, discount: 66, sold: 2456, rating: 4.7, reviews: 467, keywords: "shoes for girls sneakers black and white mesh breathable summer sports", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 14 },
  { name: "Girls Skate Sneakers Black White Flat Sole Grip Street Style", nameBn: "মেয়েদের স্কেট স্নিকার্স কালো সাদা গ্রিপ", brand: "SkateGirl", price: 10.0, salePrice: 3.0, discount: 66, sold: 1678, rating: 4.6, reviews: 312, keywords: "shoes for girls sneakers black and white skate flat sole grip street", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 16 },
  { name: "Black White Girls School Sneakers Uniform Compliant Durable Sole", nameBn: "কালো সাদা স্কুল স্নিকার্স ইউনিফর্ম", brand: "SchoolStep", price: 7.2, salePrice: 2.16, discount: 66, sold: 4890, rating: 4.8, reviews: 890, keywords: "shoes for girls sneakers black and white school uniform compliant durable", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Rangpur", locationBn: "রংপুর", coinsSave: 11 },
  { name: "Girls Polka Dot Sneakers Black White Spot Pattern Cute Casual", nameBn: "মেয়েদের পোলকা ডট স্নিকার্স কালো সাদা", brand: "DotKids", price: 8.2, salePrice: 2.46, discount: 66, sold: 2234, rating: 4.7, reviews: 445, keywords: "shoes for girls sneakers black and white polka dot spot pattern cute", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 13 },
  { name: "Black White Girls Memory Foam Sneakers Ultra Soft Insole Comfort", nameBn: "কালো সাদা মেমরি ফোম স্নিকার্স আল্ট্রা সফট", brand: "CloudStep", price: 9.8, salePrice: 2.94, discount: 66, sold: 2567, rating: 4.9, reviews: 534, tag: "CHOICE", keywords: "shoes for girls sneakers black and white memory foam ultra soft insole", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 16 },
  { name: "Girls Striped Sneakers Black White Horizontal Lines Fashion", nameBn: "মেয়েদের স্ট্রাইপ স্নিকার্স কালো সাদা", brand: "StripeStep", price: 8.6, salePrice: 2.58, discount: 66, sold: 1987, rating: 4.6, reviews: 378, keywords: "shoes for girls sneakers black and white striped horizontal lines fashion", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 14 },
  { name: "Black White Girls Double Strap Sneakers Hook Loop Fastener", nameBn: "কালো সাদা ডাবল স্ট্র্যাপ স্নিকার্স", brand: "FastGirl", price: 8.5, salePrice: 2.55, discount: 66, sold: 2890, rating: 4.8, reviews: 567, keywords: "shoes for girls sneakers black and white double strap hook loop fastener", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 14 },
  { name: "Girls Checkerboard Sneakers Black White Grid Pattern Trendy", nameBn: "মেয়েদের চেকারবোর্ড স্নিকার্স কালো সাদা", brand: "CheckStep", price: 9.0, salePrice: 2.7, discount: 66, sold: 2123, rating: 4.7, reviews: 423, badge: "BEST PRICE", keywords: "shoes for girls sneakers black and white checkerboard grid pattern trendy", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 15 },
  { name: "Black White Girls Sport Sneakers Training Non Slip Gym Shoes", nameBn: "কালো সাদা স্পোর্ট স্নিকার্স ট্রেনিং", brand: "SportyGirl", price: 8.2, salePrice: 2.46, discount: 66, sold: 3012, rating: 4.7, reviews: 534, keywords: "shoes for girls sneakers black and white sport training non slip gym", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 13 },
  { name: "Girls Heart Print Sneakers Black White Love Design Kids Cute", nameBn: "মেয়েদের হার্ট প্রিন্ট স্নিকার্স কালো সাদা", brand: "HeartKids", price: 8.4, salePrice: 2.52, discount: 66, sold: 2456, rating: 4.8, reviews: 489, keywords: "shoes for girls sneakers black and white heart print love design kids cute", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Rangpur", locationBn: "রংপুর", coinsSave: 14 },
  { name: "Black White Girls Mid Top Sneakers Ankle Support Basketball Style", nameBn: "কালো সাদা মিড টপ স্নিকার্স বাস্কেটবল", brand: "CourtGirl", price: 10.8, salePrice: 3.24, discount: 66, sold: 1567, rating: 4.7, reviews: 298, keywords: "shoes for girls sneakers black and white mid top ankle support basketball", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 17 },
  { name: "Girls Minimal Sneakers Black White Clean Design Everyday Casual", nameBn: "মেয়েদের মিনিমাল স্নিকার্স কালো সাদা ক্লিন", brand: "MinimalStep", price: 7.6, salePrice: 2.28, discount: 66, sold: 3678, rating: 4.8, reviews: 712, mall: true, keywords: "shoes for girls sneakers black and white minimal clean design everyday casual", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 12 },
];

const shoes = templates.map((t, i) => ({ id: `sfgsbw${i + 1}`, ...t }));

function enrich(base) {
  return {
    category: "shoes",
    active: true,
    description: `${base.name}\n\nStylish black and white girls sneakers with classic two-tone designs. Perfect for school, sports, and daily wear.\n\nCash on delivery across Bangladesh. Rated ${base.rating}★ from ${base.reviews}+ reviews with ${base.sold}+ sold.`,
    descriptionBn: `${base.nameBn || base.name} — কালো সাদা মেয়েদের স্টাইলিশ স্নিকার্স। স্কুল, স্পোর্টস ও দৈনন্দিন ব্যবহারের জন্য। ক্যাশ অন ডেলিভারি সারাদেশে।`,
    highlights: [
      `${base.brand} black & white girls sneakers`,
      `${base.discount}% off vs listed price`,
      `${base.sold}+ units sold`,
      "Classic black & white two-tone design",
      "Non-slip sole — school & sports ready",
      "Cash on delivery · 7-day easy size exchange",
    ],
    highlightsBn: [
      `${base.brand} কালো সাদা মেয়েদের স্নিকার্স`,
      `${base.discount}% ছাড়`,
      `${base.sold}+ বিক্রি`,
      "ক্লাসিক কালো সাদা টু-টোন ডিজাইন",
      "নন-স্লিপ সোল",
      "ক্যাশ অন ডেলিভারি · ৭ দিনের সাইজ এক্সচেঞ্জ",
    ],
    specs: [
      { label: "Brand", labelBn: "ব্র্যান্ড", value: base.brand },
      { label: "Gender", labelBn: "জেন্ডার", value: "Girls" },
      { label: "Color", labelBn: "রঙ", value: "Black & White" },
      { label: "Type", labelBn: "টাইপ", value: "Sneakers" },
    ],
    boxContents: ["1 pair of black & white sneakers", "Extra laces", "Size guide card"],
    boxContentsBn: ["১ জোড়া কালো সাদা স্নিকার্স", "অতিরিক্ত লেস", "সাইজ গাইড কার্ড"],
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
store.settings.searchResultCounts[QUERY] = 15;
store.settings.shoesForGirlsSneakersBlackAndWhite = {
  searchQuery: QUERY,
  resultTitle: QUERY,
};
store.shoesForGirlsSneakersBlackAndWhiteProductIds = shoes.map((s) => s.id);

if (!store.trendingSearches) store.trendingSearches = [];
const trend = store.trendingSearches.find((t) => String(t.label || "").toLowerCase() === QUERY);
if (trend) trend.resultCount = 15;
else store.trendingSearches.unshift({ label: QUERY, resultCount: 15 });

fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
console.log("Seeded", shoes.length, "shoes for girls sneakers black and white products. shoesForGirlsSneakersBlackAndWhiteProductIds:", store.shoesForGirlsSneakersBlackAndWhiteProductIds.length);
