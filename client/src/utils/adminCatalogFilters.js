function haystack(product) {
  return `${product?.name || ""} ${product?.keywords || ""} ${product?.id || ""}`.toLowerCase();
}

export function defaultCatalogProductIds(kind, products = []) {
  const ids = products.map((p) => p.id).filter(Boolean);
  const byPrefix = (re) => ids.filter((id) => re.test(id));
  switch (kind) {
    case "headphone":
      return byPrefix(/^hp\d+$/i);
    case "tshirt":
      return byPrefix(/^ts\d+$/i);
    case "watch":
      return byPrefix(/^wm\d+$/i);
    case "smartwatch":
      return byPrefix(/^sw\d+$/i);
    case "bra":
      return byPrefix(/^bg\d+$/i);
    case "brazil-jersey":
      return byPrefix(/^bj\d+$/i);
    case "argentina-jersey":
      return byPrefix(/^aj\d+$/i);
    case "portugal-jersey":
      return byPrefix(/^pj\d+$/i);
    case "spin-jersey":
      return byPrefix(/^sj\d+$/i);
    case "bike-stickers":
      return byPrefix(/^bs\d+$/i);
    case "bike-sticker-paper-black":
      return byPrefix(/^bsp\d+$/i);
    case "shoes-for-men":
      return byPrefix(/^sfm\d+$/i);
    case "shoes-for-men-high-quality":
      return byPrefix(/^sfhq\d+$/i);
    case "shoes-for-girls":
      return byPrefix(/^sfg\d+$/i);
    case "shoes-for-girls-sneakers":
      return byPrefix(/^sfgs\d+$/i);
    case "shoes-for-girls-sneakers-black":
      return byPrefix(/^sfgsb\d+$/i);
    case "shoes-for-girls-sneakers-black-and-white":
      return byPrefix(/^sfgsbw\d+$/i);
    default:
      return [];
  }
}

export function matchesCatalogProduct(kind, product, selectedIds = []) {
  if (!product || product.active === false) return false;
  if (selectedIds.includes(product.id)) return true;

  const hay = haystack(product);
  const id = String(product.id || "");

  switch (kind) {
    case "headphone":
      if (/^hp\d+$/i.test(id)) return true;
      return /headphone|earbuds|earphone|tws|gaming earbuds/i.test(hay) && !/watch|smartphone|tee|shirt/i.test(hay);
    case "tshirt":
      if (/^ts\d+$/i.test(id)) return true;
      return /t-shirt|tshirt|\btee\b|kaporer|cotton tee/i.test(hay) && !/watch|bra|jersey/i.test(hay);
    case "watch":
      if (/^wm\d+$/i.test(id)) return true;
      return /watch for man|men watch|analog wrist|poedagar|curren|naviforce|wrist watch/i.test(hay) && !/smart watch|smartwatch|t900|t-shirt|tee/i.test(hay);
    case "smartwatch":
      if (/^sw\d+$/i.test(id)) return true;
      return /smart watch|smartwatch|bluetooth call|amoled|fitness tracker|t900|t800|y80/i.test(hay) && !/^wm\d+$/i.test(id);
    case "bra":
      if (/^bg\d+$/i.test(id)) return true;
      return /bra for girls|\bbra\b/i.test(hay) && !/watch|jersey|shirt/i.test(hay);
    case "brazil-jersey":
      if (/^bj\d+$/i.test(id)) return true;
      return /brazil jersey|brasil jersey/i.test(hay);
    case "argentina-jersey":
      if (/^aj\d+$/i.test(id)) return true;
      return /argentina jersey/i.test(hay);
    case "portugal-jersey":
      if (/^pj\d+$/i.test(id)) return true;
      return /portugal jersey|protugal jersey/i.test(hay);
    case "spin-jersey":
      if (/^sj\d+$/i.test(id)) return true;
      return /spin jersey|world cup 2 star/i.test(hay);
    case "bike-stickers":
      if (/^bs\d+$/i.test(id)) return true;
      return /bike sticker/i.test(hay) && !/paper full body black/i.test(hay);
    case "bike-sticker-paper-black":
      if (/^bsp\d+$/i.test(id)) return true;
      return /bike sticker.*paper.*full body black|paper full body black/i.test(hay);
    case "shoes-for-men":
      if (/^sfm\d+$/i.test(id)) return true;
      return /shoes for men/i.test(hay) && !/high quality|girls|sneakers/i.test(hay);
    case "shoes-for-men-high-quality":
      if (/^sfhq\d+$/i.test(id)) return true;
      return /shoes for men high quality/i.test(hay);
    case "shoes-for-girls":
      if (/^sfg\d+$/i.test(id)) return true;
      return /shoes for girls/i.test(hay) && !/sneakers/i.test(hay);
    case "shoes-for-girls-sneakers":
      if (/^sfgs\d+$/i.test(id)) return true;
      return /shoes for girls sneakers/i.test(hay) && !/black/i.test(hay);
    case "shoes-for-girls-sneakers-black":
      if (/^sfgsb\d+$/i.test(id)) return true;
      return /shoes for girls sneakers black/i.test(hay) && !/white/i.test(hay);
    case "shoes-for-girls-sneakers-black-and-white":
      if (/^sfgsbw\d+$/i.test(id)) return true;
      return /shoes for girls sneakers black and white/i.test(hay);
    default:
      return false;
  }
}
