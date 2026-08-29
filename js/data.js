let STORE = null;
let CATEGORIES = [];
let PRODUCTS = [];
let REVIEWS = [];
let BANNERS = [];
let FLASH_SALE_IDS = [];
let FEATURED_CATEGORY_IDS = [];
let HOME_CATEGORY_ICONS = [];
let HOME_PRODUCT_IDS = [];
let LANDING_PRODUCT_IDS = [];
let TSHIRT_PRODUCT_IDS = [];
let HOME_CATEGORIES = { title: "Categories", titleBn: "ক্যাটাগরি", items: [] };
let SIDEBAR_CATEGORY_IDS = [];
let TRENDING_SEARCHES = [];
let BRANDS = [];
let WHATSAPP_NUMBER = "8801700000000";
let SITE_SETTINGS = {};

const IMAGE_SEEDS = {
  p1: "tshirt", p2: "earbuds", p5: "sunglasses", p6: "sneakers", p9: "skincare",
  p12: "toys", p23: "blender", p27: "solar", p34: "scooter", p36: "tea",
};

function applyStore(data) {
  STORE = data;
  CATEGORIES = data.categories || [];
  PRODUCTS = (data.products || []).filter((p) => p.active !== false);
  REVIEWS = data.reviews || [];
  BANNERS = (data.banners || []).filter((b) => b.active !== false);
  FLASH_SALE_IDS = data.flashSaleIds || [];
  FEATURED_CATEGORY_IDS = data.featuredCategoryIds || [];
  HOME_CATEGORY_ICONS = data.homeCategoryIcons || [];
  HOME_PRODUCT_IDS = data.homeProductIds || [];
  LANDING_PRODUCT_IDS = data.landingProductIds || [];
  TSHIRT_PRODUCT_IDS = data.tshirtProductIds || [];
  HOME_CATEGORIES = data.homeCategories || { title: "Categories", titleBn: "ক্যাটাগরি", items: [] };
  SIDEBAR_CATEGORY_IDS = data.sidebarCategoryIds || defaultSidebarCategoryIds();
  TRENDING_SEARCHES = data.trendingSearches || [];
  BRANDS = data.brands || [];
  SITE_SETTINGS = data.settings || {};
  WHATSAPP_NUMBER = SITE_SETTINGS.whatsapp || WHATSAPP_NUMBER;
}

async function initStore() {
  if (STORE) return STORE;
  try {
    let res = await fetch("/api/store");
    if (!res.ok) res = await fetch("/data/store.json");
    if (!res.ok) throw new Error("Store unavailable");
    applyStore(await res.json());
  } catch {
    applyStore(getDefaultStore());
  }
  window.dispatchEvent(new CustomEvent("storeReady", { detail: STORE }));
  if (typeof startLayout === "function") startLayout();
  return STORE;
}

function getDefaultStore() {
  return {
    settings: {
      siteName: "E-commerce Website",
      siteNameBn: "ই-কমার্স ওয়েবসাইট",
      whatsapp: WHATSAPP_NUMBER,
      searchPlaceholder: "Search in Daraz",
      searchPlaceholderBn: "Daraz এ সার্চ করুন",
      showHero: false,
      logoUrl: "",
      headerLinks: [
        { id: "save-app", label: "SAVE MORE ON APP", labelBn: "অ্যাপে আরও সাশ্রয়", href: "help.html" },
        { id: "seller", label: "BECOME A SELLER", labelBn: "সেলার হোন", href: "services.html" },
        { id: "help", label: "HELP & SUPPORT", labelBn: "হেল্প ও সাপোর্ট", href: "help.html" },
      ],
      footer: defaultFooterSettings(),
    },
    categories: [],
    products: [],
    banners: [],
    flashSaleIds: [],
    featuredCategoryIds: [],
    homeCategoryIcons: [],
    homeProductIds: [],
    landingProductIds: [],
    tshirtProductIds: [],
    homeCategories: { title: "Categories", titleBn: "ক্যাটাগরি", items: [] },
    sidebarCategoryIds: defaultSidebarCategoryIds(),
    trendingSearches: [],
    brands: [],
    reviews: [],
  };
}

function defaultFooterFirst() {
  return {
    customerTitle: "Customer Care",
    customerTitleBn: "কাস্টমার কেয়ার",
    customerLinks: [
      { label: "Help Center", labelBn: "হেল্প সেন্টার", href: "help.html" },
      { label: "How to Buy", labelBn: "কীভাবে কিনবেন", href: "help.html" },
      { label: "Returns & Refunds", labelBn: "রিটার্ন ও রিফান্ড", href: "help.html" },
      { label: "Contact Us", labelBn: "যোগাযোগ", href: "contact.html" },
      { label: "Terms & Conditions", labelBn: "শর্তাবলি", href: "privacy.html" },
      { label: "CCMS - Central Complain Management System", labelBn: "CCMS", href: "help.html" },
    ],
    companyTitle: "Daraz",
    companyTitleBn: "দারাজ",
    companyLinks: [
      { label: "About Daraz", labelBn: "দারাজ সম্পর্কে", href: "services.html" },
      { label: "Digital Payments", labelBn: "ডিজিটাল পেমেন্ট", href: "help.html" },
      { label: "Daraz Card", labelBn: "দারাজ কার্ড", href: "help.html" },
      { label: "Daraz Blog", labelBn: "দারাজ ব্লগ", href: "review.html" },
      { label: "Daraz Cares", labelBn: "দারাজ কেয়ার্স", href: "help.html" },
      { label: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", href: "privacy.html" },
      { label: "Daraz Mart", labelBn: "দারাজ মার্ট", href: "home.html" },
      { label: "Daraz App", labelBn: "দারাজ অ্যাপ", href: "help.html" },
      { label: "Daraz Exclusives", labelBn: "এক্সক্লুসিভ", href: "home.html" },
      { label: "Daraz Donates", labelBn: "দারাজ ডোনেটস", href: "help.html" },
      { label: "Daraz University", labelBn: "দারাজ ইউনিভার্সিটি", href: "help.html" },
      { label: "Sell on Daraz", labelBn: "দারাজে বিক্রি করুন", href: "services.html" },
      { label: "Code of Conduct", labelBn: "আচরণবিধি", href: "privacy.html" },
      { label: "Join the Daraz Affiliate Program", labelBn: "অ্যাফিলিয়েট প্রোগ্রাম", href: "services.html" },
    ],
    appIconUrl: "/assets/payments/app-icon.svg",
    happyText: "Happy Shopping",
    happyTextBn: "হ্যাপি শপিং",
    downloadText: "Download App",
    downloadTextBn: "অ্যাপ ডাউনলোড",
    appButtons: [
      { id: "ios", label: "App Store", imageUrl: "/assets/payments/appstore.svg", href: "#" },
      { id: "android", label: "Google Play", imageUrl: "/assets/payments/playstore.svg", href: "#" },
      { id: "huawei", label: "AppGallery", imageUrl: "/assets/payments/appgallery.svg", href: "#" },
    ],
  };
}

function defaultFooterSecond() {
  return {
    paymentTitle: "Payment Methods",
    paymentTitleBn: "পেমেন্ট মেথড",
    payments: [
      { id: "cod", label: "Cash on Delivery", imageUrl: "/assets/payments/cod.svg" },
      { id: "visa", label: "Visa", imageUrl: "/assets/payments/visa.svg" },
      { id: "mastercard", label: "Mastercard", imageUrl: "/assets/payments/mastercard.svg" },
      { id: "amex", label: "American Express", imageUrl: "/assets/payments/amex.svg" },
      { id: "emi", label: "Easy Monthly Installments", imageUrl: "/assets/payments/emi.svg" },
      { id: "bkash", label: "bKash", imageUrl: "/assets/payments/bkash.svg" },
      { id: "nagad", label: "Nagad", imageUrl: "/assets/payments/nagad.svg" },
      { id: "nexus", label: "Nexus", imageUrl: "/assets/payments/nexus.svg" },
      { id: "rocket", label: "Rocket", imageUrl: "/assets/payments/rocket.svg" },
    ],
    verifiedTitle: "Verified by",
    verifiedTitleBn: "ভেরিফাইড বাই",
    verified: [
      { id: "pci", label: "PCI DSS Compliant", imageUrl: "/assets/payments/pci.svg" },
    ],
    dbidTitle: "DBID",
    dbidLabel: "Registration ID :",
    dbidLabelBn: "রেজিস্ট্রেশন আইডি :",
    dbidValue: "304903094",
  };
}

function defaultFooterThird() {
  return {
    introTitle: "Experience Personalized Online Shopping in Bangladesh with Daraz.com.bd",
    introTitleBn: "বাংলাদেশে দারাজ.কম.বিডি দিয়ে ব্যক্তিগতকৃত অনলাইন শপিংয়ের অভিজ্ঞতা নিন",
    introHtml:
      "Online shopping BD has never been easier. Daraz.com.bd is best online shopping store in Bangladesh that features 10+ million products at affordable prices. As Bangladesh's online shopping landscape is expanding every year, online shopping in Dhaka, Chittagong, Khulna, Sylhet and other big cities are also gaining momentum. Daraz is among best websites for online shopping in Bangladesh that promises fast, reliable and convenient delivery of products to your doorstep.",
    introHtmlBn:
      "বাংলাদেশে অনলাইন শপিং এখন আরও সহজ। Daraz.com.bd বাংলাদেশের সেরা অনলাইন শপিং স্টোর যেখানে সাশ্রয়ী মূল্যে ১ কোটিরও বেশি পণ্য পাওয়া যায়।",
    moreHtml:
      "Among tons of online stores in Bangladesh, Daraz aims to redefine online shopping with home delivery, cash on delivery and installment facility. Our assortment includes 100% original products from leading electronics, fashion, beauty, and lifestyle brands. Download Daraz app for Android & IOS for a personalized shopping experience.",
    moreHtmlBn:
      "হোম ডেলিভারি, ক্যাশ অন ডেলিভারি ও কিস্তি সুবিধা দিয়ে দারাজ শপিং অভিজ্ঞতা নতুন করে সাজায়। আরও ভালো অভিজ্ঞতার জন্য Daraz অ্যাপ ডাউনলোড করুন।",
    trendingTitle: "Trending",
    trendingTitleBn: "ট্রেন্ডিং",
    trending: [
      { label: "Valentine's Day Sale", href: "home.html?q=valentine" },
      { label: "Daraz Flash Sale", href: "home.html?q=flash" },
      { label: "Smartphone Deals", href: "home.html?q=smartphone" },
      { label: "Fashion Week", href: "home.html?q=fashion" },
    ],
    categoriesTitle: "Top Categories & Brands",
    categoriesTitleBn: "টপ ক্যাটাগরি ও ব্র্যান্ড",
    categoryGroups: [
      {
        title: "MOBILE PHONES",
        items:
          "Xiaomi Mobile, Samsung Mobile, Huawei Mobile, Vivo Mobile, Oppo Mobile, Realme Mobile, OnePlus Mobile, Nokia Mobile, Motorola Mobile, Apple iPhone",
      },
      {
        title: "MOBILE ACCESSORIES",
        items:
          "Earphone, Phone Cover, Power Bank, Screen Protector, Charging Cable, Bluetooth Headset, Smart Watch, Phone Holder",
      },
      {
        title: "LAPTOPS",
        items: "HP Laptop, Dell Laptop, Asus Laptop, Lenovo Laptop, Acer Laptop, Apple MacBook, MSI Laptop",
      },
      {
        title: "LED TV",
        items:
          "Samsung LED TV, Sony LED TV, LG LED TV, Walton LED TV, Singer LED TV, Vision LED TV, 32 Inch TV, 43 Inch TV, 55 Inch TV",
      },
      {
        title: "HOME APPLIANCES",
        items:
          "Refrigerator, Washing Machine, Air Conditioner, Microwave Oven, Blender, Iron, Fan, Water Purifier",
      },
    ],
    bestsellersTitle: "BEST-SELLING PRODUCTS",
    bestsellersTitleBn: "বেস্ট সেলিং প্রোডাক্ট",
    bestsellers:
      "Samsung Galaxy A04s, Oppo F17, realme 7i, Realme 7 Pro, Xiaomi Redmi Note 12, Vivo Y22, Infinix Hot 30, Samsung Galaxy A14, Oppo A17, Realme C55, Nokia G21, Motorola G32, iPhone 13, Samsung Galaxy S23, OnePlus Nord CE, Wireless Earbuds, Power Bank 10000mAh, Type-C Cable, Phone Cover, Bluetooth Speaker",
  };
}

function defaultFooterSettings() {
  return {
    internationalTitle: "Daraz International",
    internationalTitleBn: "দারাজ আন্তর্জাতিক",
    followTitle: "Follow Us",
    followTitleBn: "ফলো করুন",
    copyrightName: "Daraz",
    countries: [
      { id: "pk", name: "Pakistan", nameBn: "পাকিস্তান", flagCode: "pk", href: "https://www.daraz.pk" },
      { id: "bd", name: "Bangladesh", nameBn: "বাংলাদেশ", flagCode: "bd", href: "https://www.daraz.com.bd" },
      { id: "lk", name: "Sri Lanka", nameBn: "শ্রীলঙ্কা", flagCode: "lk", href: "https://www.daraz.lk" },
      { id: "mm", name: "Myanmar", nameBn: "মিয়ানমার", flagCode: "mm", href: "https://www.shop.com.mm" },
      { id: "np", name: "Nepal", nameBn: "নেপাল", flagCode: "np", href: "https://www.daraz.com.np" },
    ],
    socials: [
      { id: "facebook", network: "facebook", href: "https://www.facebook.com/" },
      { id: "youtube", network: "youtube", href: "https://www.youtube.com/" },
      { id: "twitter", network: "twitter", href: "https://twitter.com/" },
      { id: "instagram", network: "instagram", href: "https://www.instagram.com/" },
    ],
    third: defaultFooterThird(),
    second: defaultFooterSecond(),
    first: defaultFooterFirst(),
  };
}

function footerSettings() {
  const base = defaultFooterSettings();
  const saved = SITE_SETTINGS.footer || {};
  return {
    ...base,
    ...saved,
    third: { ...base.third, ...(saved.third || {}) },
    second: {
      ...base.second,
      ...(saved.second || {}),
      payments: Array.isArray(saved.second?.payments) ? saved.second.payments : base.second.payments,
      verified: Array.isArray(saved.second?.verified) ? saved.second.verified : base.second.verified,
    },
    first: {
      ...base.first,
      ...(saved.first || {}),
      customerLinks: Array.isArray(saved.first?.customerLinks)
        ? saved.first.customerLinks
        : base.first.customerLinks,
      companyLinks: Array.isArray(saved.first?.companyLinks)
        ? saved.first.companyLinks
        : base.first.companyLinks,
      appButtons: Array.isArray(saved.first?.appButtons)
        ? saved.first.appButtons
        : base.first.appButtons,
    },
  };
}

function siteName() {
  return getLang() === "bn" ? SITE_SETTINGS.siteNameBn || SITE_SETTINGS.siteName : SITE_SETTINGS.siteName || "E-commerce Website";
}

function searchPlaceholder() {
  return getLang() === "bn"
    ? SITE_SETTINGS.searchPlaceholderBn || SITE_SETTINGS.searchPlaceholder
    : SITE_SETTINGS.searchPlaceholder || t("header.search");
}

function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function defaultSidebarCategoryIds() {
  return [
    "smartwatch-straps",
    "smartwatch-docks",
    "smartwatch-protectors",
    "smartwatch-cases",
    "smartwatches",
    "phone-cases",
    "phone-protectors",
    "fitness-trackers",
    "wall-chargers",
    "phone-cables",
    "smartphone",
    "watch-accessories",
    "tablet-cases",
    "camera-protectors",
  ];
}

function getSidebarCategories() {
  const ids = SIDEBAR_CATEGORY_IDS && SIDEBAR_CATEGORY_IDS.length ? SIDEBAR_CATEGORY_IDS : defaultSidebarCategoryIds();
  return ids.map((id) => getCategoryById(id)).filter(Boolean);
}

function getProductsByCategory(catId) {
  return PRODUCTS.filter((p) => p.category === catId);
}

function searchProducts(query, filters = {}) {
  const q = (query || "").trim().toLowerCase();
  const tokens = q
    ? q
        .split(/[\s,+/&]+/)
        .filter((t) => t.length > 1)
    : [];
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  function hitsIn(hay, toks) {
    return toks.filter(
      (t) =>
        hay.includes(t) ||
        (t.endsWith("s") && hay.includes(t.slice(0, -1))) ||
        (!t.endsWith("s") && hay.includes(t + "s"))
    ).length;
  }

  return PRODUCTS.filter((p) => {
    if (p.active === false) return false;
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (!tokens.length) return true;
    const cat = getCategoryById(p.category);
    const hay = [
      p.name,
      p.nameBn,
      p.brand,
      p.badge,
      p.keywords,
      cat && cat.name,
      cat && cat.nameBn,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const hits = hitsIn(hay, tokens);
    if (hits === tokens.length) return true;
    if (hits >= Math.max(2, Math.ceil(tokens.length * 0.6))) return true;
    if (cat) {
      const catHay = `${cat.name} ${cat.nameBn || ""}`.toLowerCase();
      const ch = hitsIn(catHay, tokens);
      if (ch >= Math.max(2, Math.ceil(tokens.length * 0.5))) return true;
    }
    return false;
  });
}

function trendingLabel(item) {
  return getLang() === "bn" ? item.labelBn || item.label : item.label;
}

function productLocation(product) {
  if (getLang() === "bn") {
    return product.locationBn || product.location || SITE_SETTINGS.defaultLocationBn || SITE_SETTINGS.defaultLocation || "Dhaka";
  }
  return product.location || SITE_SETTINGS.defaultLocation || "Dhaka";
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function productImageUrl(product) {
  if (product.imageUrl) return product.imageUrl;
  const seed = encodeURIComponent(IMAGE_SEEDS[product.id] || product.id || "product");
  return `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=440&h=440&q=80&sig=${seed}`;
}

function productThumbStyle(product) {
  return `background: linear-gradient(145deg, ${product.color} 0%, #0f1f24 100%);`;
}

function getFeaturedCategories() {
  return FEATURED_CATEGORY_IDS.map((id) => getCategoryById(id)).filter(Boolean);
}

function getHomeProducts() {
  return HOME_PRODUCT_IDS.map((id) => getProductById(id)).filter(Boolean);
}

function getFlashSaleProducts() {
  return FLASH_SALE_IDS.map((id) => getProductById(id)).filter(Boolean);
}

function homeCategoryIconLabel(icon) {
  return getLang() === "bn" ? icon.labelBn || icon.label : icon.label;
}

function bannerField(banner, key) {
  const bnKey = key + "Bn";
  return getLang() === "bn" && banner[bnKey] ? banner[bnKey] : banner[key];
}

initStore();
