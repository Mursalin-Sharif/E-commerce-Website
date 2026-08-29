const fs = require("fs");
const path = "data/store.json";
const s = JSON.parse(fs.readFileSync(path, "utf8"));

const pool = {
  phone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&h=800&q=80",
  ],
  case: [
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&h=800&q=80",
  ],
  charger: [
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1609091839311-d5365f0ff0c8?auto=format&fit=crop&w=800&h=800&q=80",
  ],
  watch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&h=800&q=80",
  ],
  drink: [
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&h=800&q=80",
  ],
  health: [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&h=800&q=80",
  ],
  hose: [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&h=800&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=800&q=80",
  ],
};

const counters = {};

function pick(key) {
  const list = pool[key] || pool.default;
  counters[key] = counters[key] || 0;
  const url = list[counters[key] % list.length];
  counters[key] += 1;
  return url;
}

function kind(p) {
  const t = `${p.id} ${p.category || ""} ${p.name || ""}`.toLowerCase();
  if (/charger|adapter|wall-charg/.test(t)) return "charger";
  if (/case|cover|phone-cases/.test(t)) return "case";
  if (/phone|smartphone|infinix|redmi|coolpad|mobile/.test(t)) return "phone";
  if (/watch|strap|dock|protector/.test(t)) return "watch";
  if (/soda|juice|drink|powder/.test(t)) return "drink";
  if (/health|nasal|ent-care|care|medicine/.test(t)) return "health";
  if (/hose|pipe|water|belt/.test(t)) return "hose";
  return "default";
}

let n = 0;
for (const p of s.products) {
  const url = p.imageUrl || "";
  if (url && !url.includes("picsum.photos")) continue;
  const k = kind(p);
  const next = pick(k);
  p.imageUrl = next;
  if (Array.isArray(p.gallery) && p.gallery.length) {
    p.gallery = p.gallery.map((g) =>
      typeof g === "string" && g.includes("picsum") ? pick(k) : g
    );
  }
  n += 1;
}

const phoneImgs = pool.phone;
["sp1", "sp2", "sp3", "sp4"].forEach((id, i) => {
  const p = s.products.find((x) => x.id === id);
  if (!p) return;
  p.imageUrl = phoneImgs[i % phoneImgs.length];
  p.gallery = [
    phoneImgs[i % phoneImgs.length],
    phoneImgs[(i + 1) % phoneImgs.length],
    phoneImgs[(i + 2) % phoneImgs.length],
  ];
});

const sp5 = s.products.find((x) => x.id === "sp5");
if (sp5) {
  sp5.imageUrl = pool.case[0];
  sp5.gallery = [pool.case[0], pool.case[1]];
}
const sp6 = s.products.find((x) => x.id === "sp6");
if (sp6) {
  sp6.imageUrl = pool.charger[0];
  sp6.gallery = [pool.charger[0], pool.charger[1]];
}

fs.writeFileSync(path, JSON.stringify(s, null, 2));
console.log("updated", n, "products");
console.log(
  s.products
    .filter((p) => p.id.startsWith("sp"))
    .map((p) => ({ id: p.id, img: p.imageUrl.slice(0, 75) }))
);
