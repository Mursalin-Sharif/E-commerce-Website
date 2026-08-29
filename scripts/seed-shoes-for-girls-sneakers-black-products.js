const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));

const QUERY = "shoes for girls sneakers black";

const templates = [
  { name: "Black Girls Sneakers Classic Lace Up Daily Wear Comfortable Soft Sole", nameBn: "কালো মেয়েদের স্নিকার্স ক্লাসিক লেস আপ", brand: "ClassicGirl", price: 8.0, salePrice: 2.4, discount: 66, sold: 5678, rating: 4.7, reviews: 1023, badge: "BEST PRICE", keywords: "shoes for girls sneakers black classic lace up daily wear comfortable", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 13 },
  { name: "All Black Girls Canvas Sneakers Low Top School Casual Shoes", nameBn: "অল ব্ল্যাক মেয়েদের ক্যানভাস স্নিকার্স", brand: "CanvasKids", price: 6.8, salePrice: 2.04, discount: 66, sold: 5123, rating: 4.7, reviews: 978, keywords: "shoes for girls sneakers black canvas low top school casual all black", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 11 },
  { name: "Black Girls High Top Sneakers Fashion Street Lace Up Ankle Support", nameBn: "কালো মেয়েদের হাই টপ স্নিকার্স স্ট্রিট ফ্যাশন", brand: "StreetGirl", price: 10.5, salePrice: 3.15, discount: 66, sold: 3456, rating: 4.8, reviews: 712, keywords: "shoes for girls sneakers black high top fashion street lace ankle", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 16 },
  { name: "Black Girls Platform Sneakers Chunky Sole Trendy School Shoes", nameBn: "কালো মেয়েদের প্ল্যাটফর্ম স্নিকার্স চাঙ্কি সোল", brand: "ChunkyStep", price: 11.0, salePrice: 3.3, discount: 66, sold: 2890, rating: 4.6, reviews: 534, tag: "CHOICE", keywords: "shoes for girls sneakers black platform chunky sole trendy school", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 17 },
  { name: "Black Girls Velcro Sneakers Easy Wear No Lace School Shoes", nameBn: "কালো মেয়েদের ভেলক্রো স্নিকার্স সহজ পরার", brand: "EasyStep", price: 7.5, salePrice: 2.25, discount: 66, sold: 4567, rating: 4.8, reviews: 890, keywords: "shoes for girls sneakers black velcro easy wear no lace school", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 12 },
  { name: "Black Girls Running Sneakers Cushion Sole Lightweight Jogging Sports", nameBn: "কালো মেয়েদের রানিং স্নিকার্স কুশন সোল", brand: "RunGirl", price: 9.2, salePrice: 2.76, discount: 66, sold: 3789, rating: 4.7, reviews: 645, badge: "PAYDAY SALE", keywords: "shoes for girls sneakers black running cushion sole lightweight jogging", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 15 },
  { name: "Black Pink Girls Sneakers Color Block Casual Fashion Shoes", nameBn: "কালো পিঙ্ক মেয়েদের স্নিকার্স কালার ব্লক", brand: "ColorBlock", price: 8.5, salePrice: 2.55, discount: 66, sold: 3234, rating: 4.7, reviews: 612, keywords: "shoes for girls sneakers black pink color block casual fashion", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 14 },
  { name: "Matte Black Girls Sneakers Premium Finish Daily Wear Soft Insole", nameBn: "ম্যাট ব্ল্যাক মেয়েদের স্নিকার্স প্রিমিয়াম ফিনিশ", brand: "MatteStep", price: 9.0, salePrice: 2.7, discount: 66, sold: 2678, rating: 4.8, reviews: 534, keywords: "shoes for girls sneakers black matte premium finish daily soft insole", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Rangpur", locationBn: "রংপুর", coinsSave: 15 },
  { name: "Black Girls Slip On Sneakers No Lace Elastic Band School Shoes", nameBn: "কালো মেয়েদের স্লিপ অন স্নিকার্স ইলাস্টিক", brand: "SlipGirl", price: 7.0, salePrice: 2.1, discount: 66, sold: 4123, rating: 4.6, reviews: 789, keywords: "shoes for girls sneakers black slip on no lace elastic band school", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 11 },
  { name: "Black Girls Mesh Sneakers Breathable Summer Sports Lightweight", nameBn: "কালো মেয়েদের মেশ স্নিকার্স ব্রিদ্যাবল", brand: "AirGirl", price: 8.8, salePrice: 2.64, discount: 66, sold: 3012, rating: 4.7, reviews: 567, keywords: "shoes for girls sneakers black mesh breathable summer sports lightweight", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 14 },
  { name: "Black White Girls Sneakers Two Tone Classic School Casual Shoes", nameBn: "কালো সাদা মেয়েদের স্নিকার্স টু টোন", brand: "TwoTone", price: 7.8, salePrice: 2.34, discount: 66, sold: 3890, rating: 4.8, reviews: 698, badge: "FLASH SALE", keywords: "shoes for girls sneakers black white two tone classic school casual", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 12 },
  { name: "Black Girls Skate Sneakers Flat Sole Grip Non Slip Street Style", nameBn: "কালো মেয়েদের স্কেট স্নিকার্স গ্রিপ সোল", brand: "SkateGirl", price: 10.0, salePrice: 3.0, discount: 66, sold: 1890, rating: 4.6, reviews: 345, keywords: "shoes for girls sneakers black skate flat sole grip non slip street", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 16 },
  { name: "Black Girls Sport Sneakers Training Non Slip Sole Gym Shoes", nameBn: "কালো মেয়েদের স্পোর্ট স্নিকার্স ট্রেনিং", brand: "SportyGirl", price: 8.2, salePrice: 2.46, discount: 66, sold: 3456, rating: 4.7, reviews: 612, keywords: "shoes for girls sneakers black sport training non slip sole gym", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 13 },
  { name: "Black Girls Leather Look Sneakers Shiny Patent School Formal", nameBn: "কালো মেয়েদের লেদার লুক স্নিকার্স পেটেন্ট", brand: "ShineStep", price: 10.5, salePrice: 3.15, discount: 66, sold: 1567, rating: 4.9, reviews: 289, tag: "CHOICE", keywords: "shoes for girls sneakers black leather look shiny patent school formal", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 17 },
  { name: "Black Girls Double Strap Sneakers Hook Loop Fastener School", nameBn: "কালো মেয়েদের ডাবল স্ট্র্যাপ স্নিকার্স", brand: "FastGirl", price: 8.5, salePrice: 2.55, discount: 66, sold: 3345, rating: 4.8, reviews: 678, keywords: "shoes for girls sneakers black double strap hook loop fastener school", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 14 },
  { name: "Black Girls Mid Top Sneakers Ankle Support Basketball Style", nameBn: "কালো মেয়েদের মিড টপ স্নিকার্স বাস্কেটবল", brand: "CourtGirl", price: 10.8, salePrice: 3.24, discount: 66, sold: 1789, rating: 4.7, reviews: 334, keywords: "shoes for girls sneakers black mid top ankle support basketball style", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Barishal", locationBn: "বরিশাল", coinsSave: 17 },
  { name: "Black Girls Memory Foam Sneakers Ultra Soft Insole All Day Comfort", nameBn: "কালো মেয়েদের মেমরি ফোম স্নিকার্স আল্ট্রা সফট", brand: "CloudStep", price: 9.8, salePrice: 2.94, discount: 66, sold: 2567, rating: 4.9, reviews: 534, badge: "BEST PRICE", keywords: "shoes for girls sneakers black memory foam ultra soft insole comfort", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 16 },
  { name: "Black Girls Retro Sneakers Vintage Style Classic Daily Wear", nameBn: "কালো মেয়েদের রেট্রো স্নিকার্স ভিনটেজ", brand: "RetroGirl", price: 10.2, salePrice: 3.06, discount: 66, sold: 1890, rating: 4.7, reviews: 356, keywords: "shoes for girls sneakers black retro vintage style classic daily wear", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Khulna", locationBn: "খুলনা", coinsSave: 16 },
  { name: "Black Girls Waterproof Sneakers Rain Ready Rubber Toe Cap", nameBn: "কালো মেয়েদের ওয়াটারপ্রুফ স্নিকার্স রেইন রেডি", brand: "RainGirl", price: 11.2, salePrice: 3.36, discount: 66, sold: 1678, rating: 4.8, reviews: 298, mall: true, keywords: "shoes for girls sneakers black waterproof rain ready rubber toe cap", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 18 },
  { name: "Black Gold Girls Sneakers Accent Detail Party Casual Shoes", nameBn: "কালো গোল্ড মেয়েদের স্নিকার্স এক্সেন্ট ডিটেইল", brand: "GoldAccent", price: 11.5, salePrice: 3.45, discount: 66, sold: 1456, rating: 4.8, reviews: 267, keywords: "shoes for girls sneakers black gold accent detail party casual", imageUrl: "https://images.unsplash.com/photo-1560769629-975ec0942a06?auto=format&fit=crop&w=800&h=800&q=80", location: "Rangpur", locationBn: "রংপুর", coinsSave: 18 },
  { name: "Black Girls Star Print Sneakers Cute Design Kids Fashion", nameBn: "কালো মেয়েদের স্টার প্রিন্ট স্নিকার্স", brand: "StarKids", price: 7.9, salePrice: 2.37, discount: 66, sold: 2789, rating: 4.8, reviews: 512, keywords: "shoes for girls sneakers black star print cute design kids fashion", imageUrl: "https://images.unsplash.com/photo-1518002171953-a0803db3844f?auto=format&fit=crop&w=800&h=800&q=80", location: "Rajshahi", locationBn: "রাজশাহী", coinsSave: 13 },
  { name: "Black Girls Wedge Sneakers Hidden Heel Fashion Casual Shoes", nameBn: "কালো মেয়েদের ওয়েজ স্নিকার্স হিডেন হিল", brand: "WedgeGirl", price: 11.8, salePrice: 3.54, discount: 66, sold: 1234, rating: 4.7, reviews: 234, keywords: "shoes for girls sneakers black wedge hidden heel fashion casual", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&h=800&q=80", location: "Sylhet", locationBn: "সিলেট", coinsSave: 19 },
  { name: "Black Girls School Sneakers Uniform Compliant Durable Sole", nameBn: "কালো মেয়েদের স্কুল স্নিকার্স ইউনিফর্ম", brand: "SchoolStep", price: 7.2, salePrice: 2.16, discount: 66, sold: 4890, rating: 4.8, reviews: 890, badge: "PAYDAY SALE", keywords: "shoes for girls sneakers black school uniform compliant durable sole", imageUrl: "https://images.unsplash.com/photo-1515347619252-b4670ea612f0?auto=format&fit=crop&w=800&h=800&q=80", location: "Dhaka", locationBn: "ঢাকা", coinsSave: 11 },
  { name: "Black Girls Lightweight Sneakers Ultra Flex Sole Travel Daily", nameBn: "কালো মেয়েদের লাইটওয়েট স্নিকার্স আল্ট্রা ফ্লেক্স", brand: "FlexStep", price: 8.6, salePrice: 2.58, discount: 66, sold: 2123, rating: 4.7, reviews: 389, keywords: "shoes for girls sneakers black lightweight ultra flex sole travel daily", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=800&q=80", location: "Chattogram", locationBn: "চট্টগ্রাম", coinsSave: 14 },
];

const shoes = templates.map((t, i) => ({ id: `sfgsb${i + 1}`, ...t }));

function enrich(base) {
  return {
    category: "shoes",
    active: true,
    description: `${base.name}\n\nStylish black girls sneakers for school, sports, and daily wear. Durable sole, soft insole, and classic black designs kids love.\n\nCash on delivery across Bangladesh. Rated ${base.rating}★ from ${base.reviews}+ reviews with ${base.sold}+ sold.`,
    descriptionBn: `${base.nameBn || base.name} — কালো মেয়েদের স্টাইলিশ স্নিকার্স। স্কুল, স্পোর্টস ও দৈনন্দিন ব্যবহারের জন্য। ক্যাশ অন ডেলিভারি সারাদেশে।`,
    highlights: [
      `${base.brand} black girls sneakers`,
      `${base.discount}% off vs listed price`,
      `${base.sold}+ units sold`,
      "Classic black color — easy to match outfits",
      "Non-slip sole — school & sports ready",
      "Cash on delivery · 7-day easy size exchange",
    ],
    highlightsBn: [
      `${base.brand} কালো মেয়েদের স্নিকার্স`,
      `${base.discount}% ছাড়`,
      `${base.sold}+ বিক্রি`,
      "ক্লাসিক কালো রঙ — যেকোনো পোশাকের সাথে মিলবে",
      "নন-স্লিপ সোল",
      "ক্যাশ অন ডেলিভারি · ৭ দিনের সাইজ এক্সচেঞ্জ",
    ],
    specs: [
      { label: "Brand", labelBn: "ব্র্যান্ড", value: base.brand },
      { label: "Gender", labelBn: "জেন্ডার", value: "Girls" },
      { label: "Color", labelBn: "রঙ", value: "Black" },
      { label: "Type", labelBn: "টাইপ", value: "Sneakers" },
    ],
    boxContents: ["1 pair of black sneakers", "Extra laces", "Size guide card"],
    boxContentsBn: ["১ জোড়া কালো স্নিকার্স", "অতিরিক্ত লেস", "সাইজ গাইড কার্ড"],
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
store.settings.searchResultCounts[QUERY] = 54;
store.settings.shoesForGirlsSneakersBlack = {
  searchQuery: QUERY,
  resultTitle: QUERY,
};
store.shoesForGirlsSneakersBlackProductIds = shoes.map((s) => s.id);

if (!store.trendingSearches) store.trendingSearches = [];
const trend = store.trendingSearches.find((t) => String(t.label || "").toLowerCase() === QUERY);
if (trend) trend.resultCount = 54;
else store.trendingSearches.unshift({ label: QUERY, resultCount: 54 });

fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
console.log("Seeded", shoes.length, "shoes for girls sneakers black products. shoesForGirlsSneakersBlackProductIds:", store.shoesForGirlsSneakersBlackProductIds.length);
