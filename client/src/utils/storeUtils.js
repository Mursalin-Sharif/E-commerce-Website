export function getCategoryById(categories, id) {
  return categories.find((c) => c.id === id);
}

export function getProductById(products, id) {
  return products.find((p) => p.id === id);
}

export function categoryLabel(cat, lang) {
  if (!cat) return "";
  return lang === "bn" ? cat.nameBn || cat.name : cat.name;
}

export function productLabel(product, lang) {
  if (!product) return "";
  return lang === "bn" ? product.nameBn || product.name : product.name;
}

export function productImageUrl(product) {
  if (product?.imageUrl) return product.imageUrl;
  const id = encodeURIComponent(product?.id || "p");
  if (/bra for girls|\bbra\b|innerwear|lingerie/i.test(`${product?.keywords || ""} ${product?.name || ""}`)) {
    return `https://picsum.photos/seed/bra-${id}/440/440`;
  }
  if (/watch for man|men watch|analog watch|wrist watch/i.test(`${product?.keywords || ""} ${product?.name || ""}`)) {
    return `https://picsum.photos/seed/wm-${id}/440/440`;
  }
  if (/smart watch|smartwatch|amoled|t900/i.test(`${product?.keywords || ""} ${product?.name || ""}`) || product?.category === "smartwatches") {
    return `https://picsum.photos/seed/sw-${id}/440/440`;
  }
  if (/headphone|earbud|earphone|headset|tws|buds/i.test(`${product?.keywords || ""} ${product?.name || ""}`)) {
    return `https://picsum.photos/seed/hp-${id}/440/440`;
  }
  if (/t shirt|tshirt|tee|kaporer/i.test(`${product?.keywords || ""} ${product?.name || ""}`) || product?.category === "apparel") {
    return `https://picsum.photos/seed/ts-${id}/440/440`;
  }
  return `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=440&h=440&q=80&sig=${id}`;
}

export function productLocation(product, settings, lang) {
  if (lang === "bn") {
    return product.locationBn || product.location || settings.defaultLocationBn || "ঢাকা";
  }
  return product.location || settings.defaultLocation || "Dhaka";
}

export function searchFormatBdt(price) {
  const amount = Math.round(Number(price) * 120);
  return "৳ " + amount.toLocaleString("en-BD");
}

export function searchDiscount(product) {
  if (product.discount != null) return Number(product.discount) || 0;
  const n = parseInt(String(product.id).replace(/\D/g, ""), 10) || 1;
  return 15 + (n % 7) * 7;
}

export function searchSalePrice(product) {
  if (product.salePrice != null) return Number(product.salePrice) || 0;
  return product.price * (1 - searchDiscount(product) / 100);
}

export function searchRating(product) {
  const n = parseInt(String(product.id).replace(/\D/g, ""), 10) || 1;
  const rating = product.rating != null ? Number(product.rating) : 4 + (n % 10) / 10;
  const reviews = product.reviews != null ? Number(product.reviews) : 1 + (n % 40);
  return { rating: Math.min(5, Math.round(rating * 10) / 10), reviews };
}

export function searchSoldLabel(product) {
  const sold = product.sold != null ? Number(product.sold) : 12;
  if (sold >= 1000) return (sold / 1000).toFixed(1).replace(/\.0$/, "") + "K sold";
  return sold + " sold";
}

export function normalizeSearchQuery(query) {
  return String(query || "")
    .trim()
    .toLowerCase()
    .replace(/\bt\s*-?\s*shirts?\b/g, "tshirt")
    .replace(/\bt\s+shirts?\b/g, "tshirt");
}

export function isTshirtQuery(query) {
  const n = normalizeSearchQuery(query);
  if (!n) return false;
  return n.includes("tshirt") || n === "shirt" || /\btee\b/.test(n) || n.includes("kaporer");
}

export function isBraQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  return n.includes("bra for girls") || n.includes("braforgirls") || (n.includes("bra") && n.includes("girl"));
}

export function isBrazilJerseyQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("argentina")) return false;
  if (n.includes("brazil jersey") || n.includes("braziljersey")) return true;
  if (n.includes("brazil") && n.includes("jersey")) return true;
  return n.includes("world cup") && n.includes("2026") && n.includes("brazil");
}

export function isArgentinaJerseyQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("argentina jersey") || n.includes("argentinajersey")) return true;
  if (n.includes("argentina") && n.includes("jersey")) return true;
  return n.includes("world cup") && n.includes("2026") && n.includes("argentina");
}

export function isPortugalJerseyQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("protugal jersey") || n.includes("portugal jersey") || n.includes("portugaljersey")) return true;
  if ((n.includes("portugal") || n.includes("protugal")) && n.includes("jersey")) return true;
  return n.includes("world cup") && n.includes("2026") && (n.includes("portugal") || n.includes("protugal"));
}

export function isSpinJerseyQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("spin jersey") || n.includes("spain jersey") || n.includes("spinjersey")) return true;
  if ((n.includes("spin") || n.includes("spain")) && n.includes("jersey")) return true;
  if (n.includes("2 star") && (n.includes("spain") || n.includes("spin"))) return true;
  return n.includes("world cup") && n.includes("2026") && (n.includes("spain") || n.includes("spin"));
}

export function isBikeStickerPaperFullBodyBlackQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("bike stickers paper full body black") || n.includes("bike sticker paper full body black")) return true;
  if (n.includes("full body black") && n.includes("sticker") && (n.includes("paper") || n.includes("wrap"))) return true;
  if (n.includes("paper") && n.includes("full body") && n.includes("black") && n.includes("sticker")) return true;
  return n.includes("bike") && n.includes("paper") && n.includes("full body") && n.includes("black");
}

export function isBikeStickersQuery(query) {
  if (isBikeStickerPaperFullBodyBlackQuery(query)) return false;
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("bike sticker") || n.includes("bikesticker")) return true;
  if (n.includes("motorcycle sticker") || n.includes("motorcyclesticker")) return true;
  return n.includes("bike") && n.includes("sticker");
}

export function isShoesForGirlsSneakersBlackAndWhiteQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("shoes for girls sneakers black and white") || n.includes("shoesforgirlssneakersblackandwhite")) return true;
  if (n.includes("black and white") && n.includes("sneaker") && (n.includes("girl") || n.includes("girls"))) return true;
  return (n.includes("black") && n.includes("white")) && (n.includes("girls sneakers") || n.includes("girl sneakers"));
}

export function isShoesForGirlsSneakersBlackQuery(query) {
  if (isShoesForGirlsSneakersBlackAndWhiteQuery(query)) return false;
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("shoes for girls sneakers black") || n.includes("shoesforgirlssneakersblack")) return true;
  if (n.includes("black") && n.includes("sneaker") && (n.includes("girl") || n.includes("girls"))) return true;
  return n.includes("black") && (n.includes("girls sneakers") || n.includes("girl sneakers"));
}

export function isShoesForGirlsSneakersQuery(query) {
  if (isShoesForGirlsSneakersBlackQuery(query)) return false;
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("shoes for girls sneakers") || n.includes("shoesforgirlssneakers")) return true;
  if (n.includes("girls sneakers") || n.includes("girl sneakers")) return true;
  return n.includes("sneaker") && (n.includes("girl") || n.includes("girls"));
}

export function isShoesForGirlsQuery(query) {
  if (isShoesForGirlsSneakersQuery(query)) return false;
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("shoes for girls") || n.includes("shoesforgirls")) return true;
  if (n.includes("shoe for girls") || n.includes("shoeforgirls")) return true;
  if (n.includes("girls shoes") || n.includes("girl shoes")) return true;
  return n.includes("shoes") && (n.includes("girl") || n.includes("girls"));
}

export function isShoesForMenHighQualityQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (n.includes("shoes for men high quality") || n.includes("shoe for men high quality")) return true;
  if (n.includes("high quality") && n.includes("shoes") && (n.includes("men") || n.includes("man") || n.includes("mens"))) return true;
  return n.includes("premium") && n.includes("shoes") && (n.includes("men") || n.includes("man") || n.includes("mens"));
}

export function isShoesForMenQuery(query) {
  if (isShoesForMenHighQualityQuery(query) || isShoesForGirlsQuery(query)) return false;
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (isWatchQuery(n)) return false;
  if (n.includes("shoes for men") || n.includes("shoesformen")) return true;
  if (n.includes("shoe for men") || n.includes("shoefor men")) return true;
  if (n.includes("men shoes") || n.includes("mens shoes") || n.includes("men's shoes")) return true;
  return n.includes("shoes") && (n.includes("men") || n.includes("man") || n.includes("mens"));
}

export function isHeadphoneQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  return n.includes("headphone") || n.includes("headphones") || n === "earbuds" || n === "earphone" || n === "earphones";
}

export function isSmartwatchQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  return n.includes("smartwatch") || n.includes("smart watch");
}

export function isWatchQuery(query) {
  const n = normalizeSearchQuery(query).replace(/\s+/g, " ").trim();
  if (!n) return false;
  if (isTshirtQuery(n) || isSmartwatchQuery(n)) return false;
  if (n.includes("watch for man") || n.includes("watchforman")) return true;
  if (n.includes("watch") && (n.includes("man") || n.includes("men") || n.includes("mens"))) return true;
  return n === "men watch" || n === "mens watch" || n === "analog watch";
}

export function curatedCatalogProducts(products, categories, productIds, query, filters = {}, fallbackCategory) {
  const curated = (productIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  const hasQuery = !!(String(query || "").trim() || filters.cat || filters.brand);
  if (!hasQuery) {
    return curated.length ? curated : products.filter((p) => p.category === fallbackCategory);
  }

  const searched = searchProducts(products, categories, query, filters);
  const merged = [];
  const seen = new Set();
  [...curated, ...searched].forEach((p) => {
    if (p && !seen.has(p.id)) {
      seen.add(p.id);
      merged.push(p);
    }
  });
  return merged.length ? merged : searched;
}

export function tshirtCatalogProducts(products, categories, tshirtProductIds, query, filters = {}) {
  const curated = (tshirtProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        p.category === "apparel" &&
        /shirt|tee|tshirt|t-shirt|kaporer/i.test(`${p.name || ""} ${p.keywords || ""}`) &&
        !/bra|panty|innerwear/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/bra|panty|innerwear|lingerie|watch|smartwatch|headphone|earbud/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (p.id === "p1") return false;
    if (!q || isTshirtQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function watchCatalogProducts(products, categories, watchProductIds, query, filters = {}) {
  const curated = (watchProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /watch for man|men watch|analog watch|wrist watch/i.test(`${p.name || ""} ${p.keywords || ""}`) &&
        !/smartwatch|smart watch|t900|amoled/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/smartwatch|smart watch|t900|amoled|bluetooth call/i.test(`${p.name || ""} ${p.keywords || ""}`)) return false;
    if (!q || isWatchQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function smartwatchCatalogProducts(products, categories, smartwatchProductIds, query, filters = {}) {
  const curated = (smartwatchProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        (p.category === "smartwatches" || /smart watch|smartwatch|amoled|t900|bluetooth call/i.test(`${p.name || ""} ${p.keywords || ""}`))
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/watch for man|analog watch|wrist watch|poedagar|curren/i.test(`${p.name || ""} ${p.keywords || ""}`) && !/smart/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isSmartwatchQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function headphoneCatalogProducts(products, categories, landingProductIds, query, filters = {}) {
  const curated = (landingProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /headphone|earbud|earphone|headset|tws|buds/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra|watch for man|smart watch|smartwatch/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isHeadphoneQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function spinJerseyCatalogProducts(products, categories, spinJerseyProductIds, query, filters = {}) {
  const curated = (spinJerseyProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /spin jersey|spain jersey|spain.*jersey|2 star spain|la roja/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/bra for girls|\bbra\b|headphone|smart watch|watch for man|brazil jersey|argentina jersey|portugal jersey|protugal/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isSpinJerseyQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t) || (t === "spin" && hay.includes("spain")))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function portugalJerseyCatalogProducts(products, categories, portugalJerseyProductIds, query, filters = {}) {
  const curated = (portugalJerseyProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /protugal jersey|portugal jersey|portugal.*jersey|ronaldo 7 jersey/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/bra for girls|\bbra\b|headphone|smart watch|watch for man|brazil jersey|argentina jersey/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isPortugalJerseyQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t) || (t === "protugal" && hay.includes("portugal")))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function argentinaJerseyCatalogProducts(products, categories, argentinaJerseyProductIds, query, filters = {}) {
  const curated = (argentinaJerseyProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /argentina jersey|world cup argentina|argentina.*jersey|albiceleste/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/bra for girls|\bbra\b|headphone|smart watch|watch for man|brazil jersey/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isArgentinaJerseyQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function brazilJerseyCatalogProducts(products, categories, brazilJerseyProductIds, query, filters = {}) {
  const curated = (brazilJerseyProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /brazil jersey|world cup 2026|brazil.*jersey|soccer shirt/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/bra for girls|\bbra\b|headphone|smart watch|watch for man/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isBrazilJerseyQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function bikeStickersCatalogProducts(products, categories, bikeStickerProductIds, query, filters = {}) {
  const curated = (bikeStickerProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /bike sticker|motorcycle sticker|bike decal|motorcycle decal|helmet sticker|tank pad sticker|vinyl decal/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isBikeStickersQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function bikeStickerPaperFullBodyBlackCatalogProducts(products, categories, bikeStickerPaperFullBodyBlackProductIds, query, filters = {}) {
  const curated = (bikeStickerPaperFullBodyBlackProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /full body black|black.*full body|vinyl wrap|sticker paper.*black|black.*sticker paper/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isBikeStickerPaperFullBodyBlackQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function shoesForMenCatalogProducts(products, categories, shoesForMenProductIds, query, filters = {}) {
  const curated = (shoesForMenProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        (p.category === "shoes" || /shoes for men|men shoes|mens shoes|men sneaker|men formal shoe|men running shoe/i.test(`${p.name || ""} ${p.keywords || ""}`))
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man|bike sticker/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isShoesForMenQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function shoesForMenHighQualityCatalogProducts(products, categories, shoesForMenHighQualityProductIds, query, filters = {}) {
  const curated = (shoesForMenHighQualityProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /shoes for men high quality|high quality.*men.*shoe|premium.*men.*shoe/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man|bike sticker/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isShoesForMenHighQualityQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function shoesForGirlsSneakersBlackAndWhiteCatalogProducts(products, categories, shoesForGirlsSneakersBlackAndWhiteProductIds, query, filters = {}) {
  const curated = (shoesForGirlsSneakersBlackAndWhiteProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /shoes for girls sneakers black and white|black and white girls sneakers|black white girls sneakers/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker|sandal|ballet|loafer|boot/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isShoesForGirlsSneakersBlackAndWhiteQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function shoesForGirlsSneakersBlackCatalogProducts(products, categories, shoesForGirlsSneakersBlackProductIds, query, filters = {}) {
  const curated = (shoesForGirlsSneakersBlackProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /shoes for girls sneakers black|black girls sneakers|black girl sneakers/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker|sandal|ballet|loafer|boot/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isShoesForGirlsSneakersBlackQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function shoesForGirlsSneakersCatalogProducts(products, categories, shoesForGirlsSneakersProductIds, query, filters = {}) {
  const curated = (shoesForGirlsSneakersProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /shoes for girls sneakers|girls sneakers|girl sneakers|girls sneaker/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker|sandal|ballet|loafer|boot/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isShoesForGirlsSneakersQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function shoesForGirlsCatalogProducts(products, categories, shoesForGirlsProductIds, query, filters = {}) {
  const curated = (shoesForGirlsProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /shoes for girls|girls shoes|girl shoes|girls sneaker|girls sandal|girls school shoe/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker/i.test(`${p.name || ""} ${p.keywords || ""}`)) {
      return false;
    }
    if (!q || isShoesForGirlsQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function braCatalogProducts(products, categories, braProductIds, query, filters = {}) {
  const curated = (braProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && p.active !== false);

  if (!curated.length) {
    return products.filter(
      (p) =>
        p.active !== false &&
        /bra for girls|\bbra\b|innerwear|lingerie|panty set/i.test(`${p.name || ""} ${p.keywords || ""}`)
    );
  }

  const q = String(query || "").trim().toLowerCase();
  const catFilter = filters.cat || "";
  const brandFilter = (filters.brand || "").toLowerCase();

  return curated.filter((p) => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (/shirt|tee|tshirt|t-shirt|kaporer/i.test(`${p.name || ""} ${p.keywords || ""}`)) return false;
    if (!q || isBraQuery(q)) return true;
    const hay = [p.name, p.nameBn, p.brand, p.keywords].filter(Boolean).join(" ").toLowerCase();
    const tokens = q.split(/[\s,+/&]+/).filter((t) => t.length > 1);
    if (tokens.length && tokens.every((t) => hay.includes(t))) return true;
    return hay.includes(q.replace(/\s+/g, ""));
  });
}

export function searchProducts(products, categories, query, filters = {}) {
  const normalized = normalizeSearchQuery(query);
  const q = normalized;
  const tokens = q ? q.split(/[\s,+/&]+/).filter((t) => t.length > 1) : [];
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

  return products.filter((p) => {
    if (p.active === false) return false;
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && String(p.brand || "").toLowerCase() !== brandFilter) return false;
    if (!tokens.length && !q) return true;

    const cat = getCategoryById(categories, p.category);
    const hay = [p.name, p.nameBn, p.brand, p.badge, p.keywords, cat?.name, cat?.nameBn]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (isTshirtQuery(q)) {
      if (/bra for girls|\bbra\b|panty set|innerwear|lingerie/i.test(hay)) return false;
      if (p.category === "apparel" || /shirt|tee|tshirt|t-shirt|kaporer/i.test(hay)) return true;
    }

    if (isBraQuery(q)) {
      if (/shirt|tee|tshirt|t-shirt|kaporer/i.test(hay)) return false;
      if (/bra|innerwear|lingerie|panty set/i.test(hay)) return true;
    }

    if (isSpinJerseyQuery(q)) {
      if (/bra for girls|\bbra\b|headphone|smart watch|watch for man|brazil jersey|argentina jersey|portugal jersey|protugal/i.test(hay)) return false;
      if (/spin jersey|spain jersey|spain.*jersey|2 star|la roja|rfef/i.test(hay)) return true;
    }

    if (isShoesForGirlsSneakersBlackAndWhiteQuery(q)) {
      if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker|sandal|ballet|loafer|boot/i.test(hay)) return false;
      if (/shoes for girls sneakers black and white|black and white.*girls sneakers|black white.*girls sneakers|two tone.*sneaker.*girl/i.test(hay)) return true;
    }

    if (isShoesForGirlsSneakersBlackQuery(q)) {
      if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker|sandal|ballet|loafer|boot/i.test(hay)) return false;
      if (/shoes for girls sneakers black|black girls sneakers|black girl sneakers|black.*sneaker.*girl/i.test(hay)) return true;
    }

    if (isShoesForGirlsSneakersQuery(q)) {
      if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker|sandal|ballet|loafer|boot/i.test(hay)) return false;
      if (/shoes for girls sneakers|girls sneakers|girl sneakers|girls sneaker|sneakers for girls/i.test(hay)) return true;
    }

    if (isShoesForGirlsQuery(q)) {
      if (/shirt|tee|tshirt|bra for girls|\bbra\b|jersey|headphone|smart watch|watch for man|bike sticker/i.test(hay)) return false;
      if (p.category === "shoes" || /shoes for girls|girls shoes|girl shoes|girls sneaker|girls sandal|girls school|girls ballet|girls princess/i.test(hay)) return true;
    }

    if (isShoesForMenHighQualityQuery(q)) {
      if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man|bike sticker/i.test(hay)) return false;
      if (/shoes for men high quality|high quality|premium.*shoe|premium leather|premium sneaker/i.test(hay)) return true;
    }

    if (isShoesForMenQuery(q)) {
      if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man|bike sticker/i.test(hay)) return false;
      if (p.category === "shoes" || /shoes for men|men shoes|mens shoes|sneaker|loafer|formal shoe|running shoe|sandal|boot/i.test(hay)) return true;
    }

    if (isBikeStickerPaperFullBodyBlackQuery(q)) {
      if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man/i.test(hay)) return false;
      if (/full body black|black.*full body|sticker paper|vinyl wrap|matte black wrap/i.test(hay)) return true;
    }

    if (isBikeStickersQuery(q)) {
      if (/shirt|tee|tshirt|bra|jersey|headphone|smart watch|watch for man/i.test(hay)) return false;
      if (/bike sticker|motorcycle sticker|bike decal|motorcycle decal|helmet sticker|tank pad|vinyl decal|sticker/i.test(hay)) return true;
    }

    if (isPortugalJerseyQuery(q)) {
      if (/bra for girls|\bbra\b|headphone|smart watch|watch for man|brazil jersey|argentina jersey/i.test(hay)) return false;
      if (/protugal jersey|portugal jersey|portugal.*jersey|ronaldo|seleção/i.test(hay)) return true;
    }

    if (isArgentinaJerseyQuery(q)) {
      if (/bra for girls|\bbra\b|headphone|smart watch|watch for man|brazil jersey/i.test(hay)) return false;
      if (/argentina jersey|world cup argentina|argentina.*jersey|albiceleste|messi/i.test(hay)) return true;
    }

    if (isBrazilJerseyQuery(q)) {
      if (/bra for girls|\bbra\b|headphone|smart watch|watch for man/i.test(hay)) return false;
      if (/brazil jersey|world cup 2026|brazil.*jersey|soccer shirt|national team/i.test(hay)) return true;
    }

    if (isHeadphoneQuery(q)) {
      if (/shirt|tee|tshirt|bra|watch for man|smart watch/i.test(hay)) return false;
      if (/headphone|earbud|earphone|headset|tws|buds|wireless audio/i.test(hay)) return true;
    }

    if (isSmartwatchQuery(q)) {
      if (p.category === "smartwatches" || /smartwatch|smart watch|amoled|bluetooth call|t900|ultra 2/i.test(hay)) return true;
    }

    if (isWatchQuery(q)) {
      if (/smartwatch|smart watch|t900|amoled|bluetooth call/i.test(hay)) return false;
      if (p.category === "eyewear" || /watch for man|men watch|analog|wrist watch|poedagar|naviforce|curren/i.test(hay)) return true;
    }

    if (q && hay.includes(q)) return true;
    if (q && hay.includes(q.replace(/\s+/g, ""))) return true;
    if (tokens.length) {
      const hits = hitsIn(hay, tokens);
      if (hits === tokens.length) return true;
      if (hits >= Math.max(1, Math.ceil(tokens.length * 0.6))) return true;
      if (cat) {
        const catHay = `${cat.name} ${cat.nameBn || ""}`.toLowerCase();
        if (hitsIn(catHay, tokens) >= Math.max(1, Math.ceil(tokens.length * 0.5))) return true;
      }
    }
    return false;
  });
}

export function getSidebarCategories(categories, sidebarCategoryIds) {
  const ids = sidebarCategoryIds?.length ? sidebarCategoryIds : defaultSidebarCategoryIds();
  return ids.map((id) => getCategoryById(categories, id)).filter(Boolean);
}

export function defaultSidebarCategoryIds() {
  return [
    "shoes",
    "apparel",
    "sportswear",
    "sports",
    "smartwatches",
    "smartwatch-straps",
    "smartwatch-docks",
    "smartwatch-protectors",
    "smartwatch-cases",
    "phone-cases",
    "phone-protectors",
    "fitness-trackers",
    "wall-chargers",
    "phone-cables",
    "smartphone",
    "watch-accessories",
    "tablet-cases",
    "camera-protectors",
    "electronics",
    "eyewear",
    "jewelry",
    "beauty",
    "personal-care",
    "health",
    "kids",
    "luggage",
    "home-garden",
    "furniture",
    "lighting",
    "appliances",
    "auto-supplies",
    "vehicle-parts",
    "tools",
    "safety",
    "food",
    "pets",
    "office",
    "gifts",
    "ent-care",
    "hoses-pipes",
    "water-systems",
    "coolers",
    "packaging",
    "industrial",
    "agriculture",
    "construction-mach",
    "commercial",
    "renewable",
    "electrical",
    "power",
    "components",
    "vehicles",
    "raw-materials",
    "fabrication",
    "soda-makers",
    "powdered-drinks",
    "juice-drinks",
    "soft-drinks",
    "baby-nasal",
    "health-accessories",
    "material-handling",
    "testing",
    "real-estate",
    "belts-hoses",
  ];
}

export function sortProducts(list, sort) {
  const items = list.slice();
  if (sort === "price-asc") items.sort((a, b) => searchSalePrice(a) - searchSalePrice(b));
  else if (sort === "price-desc") items.sort((a, b) => searchSalePrice(b) - searchSalePrice(a));
  else if (sort === "sold") items.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  return items;
}

export function paginateList(list, page, pageSize = 24) {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(Math.max(1, page || 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: safePage, totalPages, total: list.length };
}

export function itemsFoundCount(q, products, settings, trendingSearches) {
  const key = String(q || "").trim().toLowerCase();
  const trend = trendingSearches.find((t) => String(t.label || "").toLowerCase() === key);
  if (trend?.resultCount != null) return Number(trend.resultCount) || products.length;
  if (settings?.searchResultCounts?.[key] != null) {
    return Number(settings.searchResultCounts[key]) || products.length;
  }
  const soldSum = products.reduce((s, p) => s + (Number(p.sold) || 0), 0);
  return Math.max(products.length, soldSum * 17 + products.length * 83 + 120);
}
