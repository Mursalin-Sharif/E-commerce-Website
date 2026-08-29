export function siteDisplayName(settings = {}, lang = "en") {
  if (lang === "bn") return settings.siteNameBn || settings.siteName || "E-commerce Website";
  return settings.siteName || settings.siteNameBn || "E-commerce Website";
}

export function contactBrandName(contact = {}, settings = {}, lang = "en") {
  const fromContact = lang === "bn" ? contact.brandNameBn || contact.brandName : contact.brandName || contact.brandNameBn;
  return fromContact || siteDisplayName(settings, lang);
}

export function contactHeadline(contact = {}, settings = {}, lang = "en") {
  const fromContact = lang === "bn" ? contact.headlineBn || contact.headline : contact.headline || contact.headlineBn;
  return fromContact || siteDisplayName(settings, lang);
}

export const DEFAULT_CONTACT = {
  brandName: "E-commerce Website",
  brandNameBn: "ই-কমার্স ওয়েবসাইট",
  eyebrow: "CONTACT",
  eyebrowBn: "যোগাযোগ",
  headline: "E-commerce Website",
  headlineBn: "ই-কমার্স ওয়েবসাইট",
  subtitle: "Get in touch. We respond fast.",
  subtitleBn: "যোগাযোগ করুন। আমরা দ্রুত উত্তর দিই।",
  intro:
    "Shop online with fast delivery and great deals. WhatsApp or call us for orders, product questions, and support.",
  introBn:
    "দ্রুত ডেলিভারি ও ভালো দামে অনলাইনে কেনাকাটা করুন। অর্ডার, প্রোডাক্ট বা সাপোর্টের জন্য WhatsApp বা কল করুন।",
  whatsappButton: "WhatsApp Us",
  whatsappButtonBn: "WhatsApp করুন",
  callButton: "Call",
  callButtonBn: "কল করুন",
  phone: "01343787983",
  whatsapp: "01343787983",
  whatsappMessage: "Hi, I have a question about my order.",
  whatsappMessageBn: "হ্যালো, আমার অর্ডার/প্রোডাক্ট সম্পর্কে জানতে চাই।",
  email: "support@ecommerce-demo.com",
  addressLine1: "Gopalganj, Bangladesh",
  addressLine1Bn: "গোপালগঞ্জ, বাংলাদেশ",
  addressLine2: "Dhaka Division",
  addressLine2Bn: "ঢাকা বিভাগ",
  addressLine3: "",
  addressLine3Bn: "",
  tagline: "Online Shopping · Fast Delivery · Best Deals",
  taglineBn: "অনলাইন শপিং · দ্রুত ডেলিভারি · সেরা অফার",
  description:
    "Daraz-style online shop — fashion, electronics, home and more. Order on the website or message us on WhatsApp.",
  descriptionBn:
    "Daraz-style অনলাইন শপ — ফ্যাশন, ইলেকট্রনিক্স, হোম ও আরও। ওয়েবসাইটে অর্ডার করুন অথবা WhatsApp-এ মেসেজ করুন।",
  copyrightName: "E-commerce Website",
  linksTitle: "Links",
  linksTitleBn: "লিংক",
  links: [
    { label: "Home", labelBn: "হোম", href: "/", active: true },
    { label: "Landing", labelBn: "ল্যান্ডিং", href: "/landing", active: true },
    { label: "Reviews", labelBn: "রিভিউ", href: "/review", active: true },
    { label: "Contact", labelBn: "যোগাযোগ", href: "/contact", active: true },
  ],
  contactTitle: "Contact",
  contactTitleBn: "যোগাযোগ",
  whatsappNowLabel: "WhatsApp Now",
  whatsappNowLabelBn: "এখনই WhatsApp",
  legalTitle: "Legal",
  legalTitleBn: "আইনি",
  legalLinks: [
    { label: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", href: "/privacy", active: true },
    { label: "Terms of Service", labelBn: "সেবার শর্তাবলী", href: "/services", active: true },
    { label: "Cookie Policy", labelBn: "কুকি পলিসি", href: "/privacy", active: true },
    { label: "Refund Policy", labelBn: "রিফান্ড পলিসি", href: "/help", active: true },
  ],
  servicesTitle: "Services",
  servicesTitleBn: "সেবা",
  services: ["Portfolio websites", "Demo showcases", "Admin dashboards", "WhatsApp lead systems"],
  servicesBn: ["পোর্টফোলিও ওয়েবসাইট", "ডেমো শোকেস", "অ্যাডমিন ড্যাশবোর্ড", "WhatsApp লিড সিস্টেম"],
  facebookLabel: "Facebook Page",
  facebookLabelBn: "Facebook পেজ",
  facebookHref: "https://www.facebook.com/",
  showProductGrid: true,
  productGridTitle: "Just For You",
  productGridTitleBn: "আপনার জন্য",
  loadMore: "LOAD MORE",
  loadMoreBn: "আরও দেখুন",
  showMap: true,
  mapQuery: "Natore Sadar Bangladesh",
  mapZoom: 12,
  mapTitle: "map",
  mapTitleBn: "মানচিত্র",
};

export function contactMapEmbedUrl(query, zoom = 12) {
  const q = String(query || "").trim();
  if (!q) return "";
  const z = Math.min(20, Math.max(1, Number(zoom) || 12));
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=${z}&ie=UTF8&iwloc=&output=embed`;
}

export function mergeContactSettings(settings = {}) {
  const partial = settings.contact || {};
  const merged = { ...DEFAULT_CONTACT, ...partial };

  if (!partial.links?.length) merged.links = DEFAULT_CONTACT.links;
  if (!partial.legalLinks?.length) merged.legalLinks = DEFAULT_CONTACT.legalLinks;
  if (!partial.services?.length) merged.services = DEFAULT_CONTACT.services;
  if (!partial.servicesBn?.length) merged.servicesBn = DEFAULT_CONTACT.servicesBn;

  merged.whatsapp = partial.whatsapp || settings.whatsapp || DEFAULT_CONTACT.whatsapp;
  merged.phone = partial.phone || partial.whatsapp || settings.whatsapp || DEFAULT_CONTACT.phone;
  merged.email = partial.email || DEFAULT_CONTACT.email;
  merged.facebookHref = partial.facebookHref || DEFAULT_CONTACT.facebookHref;

  for (const key of Object.keys(DEFAULT_CONTACT)) {
    if (typeof DEFAULT_CONTACT[key] === "string" && !merged[key]) {
      merged[key] = DEFAULT_CONTACT[key];
    }
  }

  return merged;
}
