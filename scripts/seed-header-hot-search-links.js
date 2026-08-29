const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");
const store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));

if (!store.settings) store.settings = {};

const DEFAULT_LINKS = [
  { id: "hhs-landing", label: "Landing Page", labelBn: "ল্যান্ডিং পেজ", to: "/landing", active: true },
  { id: "hhs-headphone", label: "headphone", labelBn: "হেডফোন", to: "/headphone", active: true },
  { id: "hhs-watch", label: "watch for man", labelBn: "পুরুষদের ঘড়ি", to: "/watch", active: true },
  { id: "hhs-smartwatch", label: "smart watch", labelBn: "স্মার্ট ওয়াচ", to: "/smartwatch", active: true },
  { id: "hhs-tshirt", label: "T-Shirt", labelBn: "টি-শার্ট", to: "/tshirt", active: true },
  { id: "hhs-spin-jersey", label: "spin jersey 2026 world cup 2 star", labelBn: "স্পিন জার্সি ২০২৬ ওয়ার্ল্ড কাপ ২ স্টার", to: "/spin-jersey", active: true },
  { id: "hhs-portugal", label: "protugal jersey", labelBn: "protugal jersey", to: "/portugal-jersey", active: true },
  { id: "hhs-argentina", label: "jersey 2026 world cup argentina", labelBn: "jersey 2026 world cup argentina", to: "/argentina-jersey", active: true },
  { id: "hhs-brazil", label: "brazil jersey 2026 world cup", labelBn: "brazil jersey 2026 world cup", to: "/brazil-jersey", active: true },
  { id: "hhs-bra", label: "bra for girls", labelBn: "bra for girls", to: "/bra", active: true },
  { id: "hhs-bike-stickers", label: "bike stickers", labelBn: "bike stickers", to: "/bike-stickers", active: true },
  { id: "hhs-bike-paper", label: "bike stickers paper full body black", labelBn: "bike stickers paper full body black", to: "/bike-sticker-paper-full-body-black", active: true },
  { id: "hhs-shoes-men", label: "shoes for men", labelBn: "shoes for men", to: "/shoes-for-men", active: true },
  { id: "hhs-shoes-men-hq", label: "shoes for men high quality", labelBn: "shoes for men high quality", to: "/shoes-for-men-high-quality", active: true },
  { id: "hhs-shoes-girls", label: "shoes for girls", labelBn: "shoes for girls", to: "/shoes-for-girls", active: true },
  { id: "hhs-shoes-girls-sneakers", label: "shoes for girls sneakers", labelBn: "shoes for girls sneakers", to: "/shoes-for-girls-sneakers", active: true },
  { id: "hhs-shoes-girls-sneakers-black", label: "shoes for girls sneakers black", labelBn: "shoes for girls sneakers black", to: "/shoes-for-girls-sneakers-black", active: true },
  { id: "hhs-shoes-girls-sneakers-bw", label: "shoes for girls sneakers black and white", labelBn: "shoes for girls sneakers black and white", to: "/shoes-for-girls-sneakers-black-and-white", active: true },
];

const defaultById = Object.fromEntries(DEFAULT_LINKS.map((link) => [link.id, link]));
const existing = Array.isArray(store.settings.headerHotSearchLinks) ? store.settings.headerHotSearchLinks : [];
const existingIds = new Set(existing.map((link) => link.id));
let merged = [...existing];
let added = 0;

for (const link of DEFAULT_LINKS) {
  if (!existingIds.has(link.id)) {
    merged.push(link);
    existingIds.add(link.id);
    added += 1;
  }
}

let updated = 0;
merged = merged.map((link) => {
  const def = defaultById[link.id];
  if (def?.to && link.to !== def.to) {
    updated += 1;
    return { ...link, to: def.to };
  }
  return link;
});

store.settings.headerHotSearchLinks = merged.length ? merged : DEFAULT_LINKS;
console.log(
  `Catalog links: ${store.settings.headerHotSearchLinks.length}` +
    (added ? ` (+${added} new)` : "") +
    (updated ? ` (${updated} routes updated)` : "") +
    (!added && !updated ? " — up to date" : "")
);

fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
