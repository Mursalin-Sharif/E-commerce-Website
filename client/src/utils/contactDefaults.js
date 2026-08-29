export const DEFAULT_CONTACT = {
  brandName: "IoT Programmers",
  brandNameBn: "IoT Programmers",
  eyebrow: "CONTACT",
  eyebrowBn: "যোগাযোগ",
  headline: "IoT Programmers",
  headlineBn: "IoT Programmers",
  subtitle: "Get in touch. We respond fast.",
  subtitleBn: "যোগাযোগ করুন। আমরা দ্রুত উত্তর দিই।",
  intro:
    "WhatsApp is the fastest way to reach us: portfolio websites, demo showcases, landing pages and admin dashboards for agencies and brands.",
  introBn:
    "WhatsApp-এ আমাদের সাথে যোগাযোগ করুন: পোর্টফোলিও ওয়েবসাইট, ডেমো শোকেস, ল্যান্ডিং পেজ ও অ্যাডমিন ড্যাশবোর্ড।",
  whatsappButton: "WhatsApp Us",
  whatsappButtonBn: "WhatsApp করুন",
  callButton: "Call",
  callButtonBn: "কল করুন",
  phone: "01302003306",
  whatsapp: "01302003306",
  whatsappMessage: "Hi, I want to get in touch about a MERN portfolio website.",
  whatsappMessageBn: "হ্যালো, আমি MERN পোর্টফোলিও ওয়েবসাইট সম্পর্কে যোগাযোগ করতে চাই।",
  email: "iotprogrammers@gmail.com",
  addressLine1: "Gopalganj, Bangladesh",
  addressLine1Bn: "গোপালগঞ্জ, বাংলাদেশ",
  addressLine2: "Dhaka Division",
  addressLine2Bn: "ঢাকা বিভাগ",
  addressLine3: "",
  addressLine3Bn: "",
  tagline: "MERN Portfolio · Demo Websites · WhatsApp Leads",
  taglineBn: "MERN পোর্টফোলিও · ডেমো ওয়েবসাইট · WhatsApp লিড",
  description:
    "Premium MERN portfolio and demo websites—admin-controlled content. Landing pages, reviews, gallery, and WhatsApp CTAs for agencies and brands.",
  descriptionBn:
    "প্রিমিয়াম MERN পোর্টফোলিও ও ডেমো ওয়েবসাইট—অ্যাডমিন থেকে কন্ট্রোলযোগ্য কন্টেন্ট। ল্যান্ডিং পেজ, রিভিউ, গ্যালারি ও WhatsApp CTA।",
  copyrightName: "IoTProgrammers",
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
