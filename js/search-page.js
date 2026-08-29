let searchCatsExpanded = false;
let searchBrandsExpanded = true;
let searchSort = "best";
let searchView = "grid";

function isLandingStorePage() {
  const path = window.location.pathname.replace(/\/+$/, "");
  return document.body.classList.contains("landing-store") || path.endsWith("index.html");
}

function isTshirtStorePage() {
  const path = window.location.pathname.replace(/\/+$/, "");
  return document.body.classList.contains("tshirt-store") || path.endsWith("tshirt.html");
}

function storeListPageBase() {
  if (isLandingStorePage()) return "index.html";
  if (isTshirtStorePage()) return "tshirt.html";
  return "home.html";
}

function landingStoreSettings() {
  return (typeof SITE_SETTINGS !== "undefined" && SITE_SETTINGS.landing) || {};
}

function landingDefaultQuery() {
  return String(landingStoreSettings().searchQuery || "headphone").trim();
}

function landingFeedProducts() {
  const ids = typeof LANDING_PRODUCT_IDS !== "undefined" ? LANDING_PRODUCT_IDS : [];
  if (ids && ids.length) {
    return ids.map((id) => getProductById(id)).filter((p) => p && p.active !== false);
  }
  return searchProducts(landingDefaultQuery());
}

function tshirtStoreSettings() {
  return (typeof SITE_SETTINGS !== "undefined" && SITE_SETTINGS.tshirt) || {};
}

function tshirtDefaultQuery() {
  return String(tshirtStoreSettings().searchQuery || "t shirt").trim();
}

function tshirtResultTitle() {
  const S = tshirtStoreSettings();
  return String(S.resultTitle || S.searchQuery || "t shirt").trim();
}

function tshirtFeedProducts() {
  const ids = typeof TSHIRT_PRODUCT_IDS !== "undefined" ? TSHIRT_PRODUCT_IDS : [];
  if (ids && ids.length) {
    return ids.map((id) => getProductById(id)).filter((p) => p && p.active !== false);
  }
  return searchProducts(tshirtDefaultQuery());
}

function searchDiscount(product) {
  if (product.discount != null) return Number(product.discount) || 0;
  const n = parseInt(String(product.id).replace(/\D/g, ""), 10) || 1;
  return 15 + (n % 7) * 7;
}

function searchRating(product) {
  const n = parseInt(String(product.id).replace(/\D/g, ""), 10) || 1;
  const rating = product.rating != null ? Number(product.rating) : 4 + (n % 10) / 10;
  const reviews = product.reviews != null ? Number(product.reviews) : 1 + (n % 40);
  return { rating: Math.min(5, Math.round(rating * 10) / 10), reviews };
}

function searchFormatBdt(price) {
  const amount = Math.round(Number(price) * 120);
  return "৳ " + amount.toLocaleString("en-BD");
}

function searchStarsHtml(rating) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="sr-star${i <= filled ? " is-on" : ""}">★</span>`;
  }
  return html;
}

function searchCoinsSave(product) {
  if (product.coinsSave != null) return Number(product.coinsSave);
  const n = parseInt(String(product.id).replace(/\D/g, ""), 10) || 1;
  return 2 + (n % 8);
}

function searchSoldLabel(product) {
  const sold = product.sold != null ? Number(product.sold) : 12;
  if (sold >= 1000) return (sold / 1000).toFixed(1).replace(/\.0$/, "") + "K sold";
  return sold + " sold";
}

function promoClass(badge) {
  const b = String(badge || "").toUpperCase();
  if (b.includes("PAYDAY") || b.includes("SALE")) return " sr-card__promo--sale";
  if (b.includes("CHOICE") || b.includes("MALL") || b.includes("OFFICIAL")) return " sr-card__promo--mall";
  return "";
}

function searchSalePrice(product) {
  if (product.salePrice != null) return Number(product.salePrice) || 0;
  return product.price * (1 - searchDiscount(product) / 100);
}

function searchBannerStrip(product) {
  if (product.bannerStrip) return String(product.bannerStrip);
  const badge = String(product.badge || "").toLowerCase();
  if (badge.includes("official") || product.mall) {
    return product.bannerStrip || "Official Mobile · Authentic · 0% EMI · Fast Delivery";
  }
  return "";
}

function createSearchResultCard(product) {
  const pct = searchDiscount(product);
  const sale = searchSalePrice(product);
  const title = productLabel(product);
  const img = productImageUrl(product);
  const loc = productLocation(product);
  const { rating, reviews } = searchRating(product);
  const badge = product.badge ? String(product.badge).trim() : "";
  const tag = product.tag ? String(product.tag).trim() : product.mall ? "Mall" : "";
  const coins = searchCoinsSave(product);
  const strip = searchBannerStrip(product);

  const a = document.createElement("a");
  a.className = "sr-card";
  a.href = `product.html?id=${encodeURIComponent(product.id)}`;
  a.title = title;
  a.innerHTML = `
    <div class="sr-card__img">
      ${strip ? `<div class="sr-card__banner">${strip}</div>` : ""}
      <img src="${img}" alt="${title}" loading="lazy" width="220" height="220"
        onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='${product.color || "#eee"}'" />
    </div>
    <div class="sr-card__body">
      <div class="sr-card__tags">
        ${tag ? `<span class="sr-card__tag">${tag}</span>` : ""}
        ${badge ? `<span class="sr-card__promo${promoClass(badge)}">${badge}</span>` : ""}
      </div>
      <p class="sr-card__title">${title}</p>
      <div class="sr-card__price-row">
        <span class="sr-card__price">${searchFormatBdt(sale)}</span>
      </div>
      <div class="sr-card__deal">
        <span class="sr-card__off">${pct}% Off</span>
        <span class="sr-card__coins">Coins save ৳ ${coins}</span>
      </div>
      <div class="sr-card__meta">
        <span class="sr-card__sold">${searchSoldLabel(product)}</span>
        <span class="sr-card__rating" aria-label="${rating} stars">${searchStarsHtml(rating)} <em>(${reviews})</em></span>
        <span class="sr-card__loc">${loc}</span>
      </div>
    </div>
  `;
  return a;
}

function getSearchParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    q: (params.get("q") || "").trim(),
    cat: params.get("cat") || "",
    brand: params.get("brand") || "",
    mall: params.get("mall") === "1",
    sort: params.get("sort") || searchSort || "best",
    view: params.get("view") || searchView || "grid",
    page: Math.max(1, parseInt(params.get("page") || "1", 10) || 1),
  };
}

function buildSearchUrl(next) {
  const cur = getSearchParams();
  const merged = { ...cur, ...next };
  const p = new URLSearchParams();
  if (merged.q) p.set("q", merged.q);
  if (merged.cat) p.set("cat", merged.cat);
  if (merged.brand) p.set("brand", merged.brand);
  if (merged.mall) p.set("mall", "1");
  if (merged.sort && merged.sort !== "best") p.set("sort", merged.sort);
  if (merged.view && merged.view !== "grid") p.set("view", merged.view);
  if (merged.page && Number(merged.page) > 1) p.set("page", String(merged.page));
  const qs = p.toString();
  return storeListPageBase() + (qs ? "?" + qs : "");
}

function homeFeedProducts() {
  const ids = typeof HOME_PRODUCT_IDS !== "undefined" ? HOME_PRODUCT_IDS : [];
  if (ids && ids.length) {
    return ids.map((id) => getProductById(id)).filter((p) => p && p.active !== false);
  }
  return PRODUCTS.filter((p) => p.active !== false);
}

function landingResultTitle() {
  const L = landingStoreSettings();
  return String(L.resultTitle || L.searchQuery || "headphone").trim();
}

function resolveSearchHeading(q, cat, { landingFeed = false, tshirtFeed = false } = {}) {
  if (q && String(q).trim()) return String(q).trim();
  if (landingFeed) return landingResultTitle();
  if (tshirtFeed) return tshirtResultTitle();
  if (cat) {
    const c = getCategoryById(cat);
    if (c) return categoryLabel(c);
  }
  const title =
    getLang() === "bn"
      ? SITE_SETTINGS.homePageTitleBn || SITE_SETTINGS.homePageTitle || "হোম"
      : SITE_SETTINGS.homePageTitle || "Just For You";
  return title;
}

function paginateList(list, page, pageSize) {
  const size = pageSize || 24;
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const safePage = Math.min(Math.max(1, page || 1), totalPages);
  const start = (safePage - 1) * size;
  return {
    items: list.slice(start, start + size),
    page: safePage,
    totalPages,
    total: list.length,
  };
}

function renderPagination(page, totalPages) {
  if (totalPages <= 1) return "";
  const buttons = [];
  const maxButtons = 5;
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);
  for (let i = start; i <= end; i++) {
    buttons.push(
      `<a class="sr-page${i === page ? " is-active" : ""}" href="${buildSearchUrl({ page: i })}">${i}</a>`
    );
  }
  return `<nav class="sr-pagination" aria-label="Pagination">${buttons.join("")}</nav>`;
}

function tokenizeQuery(query) {
  return String(query || "")
    .trim()
    .toLowerCase()
    .split(/[\s,+/&]+/)
    .filter((t) => t.length > 1);
}

function tokenHitsHay(token, hay) {
  if (hay.includes(token)) return true;
  if (token.endsWith("s") && hay.includes(token.slice(0, -1))) return true;
  if (!token.endsWith("s") && hay.includes(token + "s")) return true;
  return false;
}

function scoreCategoryQuery(cat, query) {
  const tokens = tokenizeQuery(query);
  if (!tokens.length || !cat) return 0;
  const hay = `${cat.name} ${cat.nameBn || ""}`.toLowerCase();
  const hits = tokens.filter((t) => tokenHitsHay(t, hay)).length;
  if (cat.name.toLowerCase() === String(query || "").trim().toLowerCase()) return 100;
  return hits;
}

function categoryMatchesQuery(cat, query) {
  const tokens = tokenizeQuery(query);
  if (!tokens.length) return false;
  const hits = scoreCategoryQuery(cat, query);
  if (hits >= 100) return true;
  const need = Math.max(1, Math.ceil(tokens.length * 0.5));
  return hits >= need;
}

function findBestCategoryForQuery(query) {
  let best = null;
  let bestScore = 0;
  CATEGORIES.forEach((c) => {
    const s = scoreCategoryQuery(c, query);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  });
  if (!best) return null;
  const tokens = tokenizeQuery(query);
  const need = Math.max(1, Math.ceil(tokens.length * 0.5));
  return bestScore >= need || bestScore >= 100 ? best : null;
}

function relatedCategories(query, activeCat, { homeFeed = false } = {}) {
  const sidebar = getSidebarCategories();
  const sidebarIds = new Set(sidebar.map((c) => c.id));
  const matchedByName = query ? CATEGORIES.filter((c) => categoryMatchesQuery(c, query)) : [];

  if (activeCat) {
    const current = getCategoryById(activeCat);
    const rest = sidebar.filter((c) => c.id !== activeCat);
    if (current && !sidebarIds.has(activeCat)) {
      return [current, ...sidebar];
    }
    return current ? [current, ...rest] : sidebar.length ? sidebar : CATEGORIES.slice();
  }

  if (homeFeed || (!query && !activeCat)) {
    return sidebar.length ? sidebar : CATEGORIES.slice();
  }

  if (matchedByName.length || query) {
    const matched = searchProducts(query);
    const fromProducts = [...new Set(matched.map((p) => p.category))]
      .map((id) => getCategoryById(id))
      .filter(Boolean);
    const front = [];
    const seen = new Set();
    [...matchedByName, ...fromProducts, ...sidebar].forEach((c) => {
      if (c && !seen.has(c.id)) {
        seen.add(c.id);
        front.push(c);
      }
    });
    return front.length ? front : sidebar.length ? sidebar : CATEGORIES.slice();
  }

  return sidebar.length ? sidebar : CATEGORIES.slice();
}

function brandsForResults(products) {
  const fromProducts = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const catalog = BRANDS.map((b) => b.name);
  const merged = [];
  const seen = new Set();
  [...fromProducts, ...catalog].forEach((name) => {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(name);
    }
  });
  return merged.length ? merged : catalog;
}

function sortProducts(list, sort) {
  const items = list.slice();
  if (sort === "price-asc") {
    items.sort((a, b) => searchSalePrice(a) - searchSalePrice(b));
  } else if (sort === "price-desc") {
    items.sort((a, b) => searchSalePrice(b) - searchSalePrice(a));
  } else if (sort === "sold") {
    items.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  }
  return items;
}

function itemsFoundCount(q, products) {
  const key = String(q || "").trim().toLowerCase();
  const trend = (typeof TRENDING_SEARCHES !== "undefined" ? TRENDING_SEARCHES : []).find(
    (t) => String(t.label || "").toLowerCase() === key
  );
  if (trend && trend.resultCount != null) return Number(trend.resultCount) || products.length;
  if (SITE_SETTINGS && SITE_SETTINGS.searchResultCounts && SITE_SETTINGS.searchResultCounts[key] != null) {
    return Number(SITE_SETTINGS.searchResultCounts[key]) || products.length;
  }
  const soldSum = products.reduce((s, p) => s + (Number(p.sold) || 0), 0);
  return Math.max(products.length, soldSum * 17 + products.length * 83 + 120);
}

function filterByMall(products, mallOnly) {
  if (!mallOnly) return products;
  return products.filter((p) => p.mall === true);
}

function renderTrendingChips() {
  const el = document.getElementById("trending-searches");
  if (!el) return;
  if (!TRENDING_SEARCHES.length) {
    el.innerHTML = "";
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.innerHTML = TRENDING_SEARCHES.map((item) => {
    const label = trendingLabel(item);
    return `<a class="trend-chip" href="${buildSearchUrl({ q: label, cat: "", brand: "", mall: false })}">${label}</a>`;
  }).join("");
}

function pageTitleText(heading) {
  return String(heading || "").trim();
}

function renderSearchPage() {
  const root = document.getElementById("search-results");
  if (!root) return;

  const onLanding = isLandingStorePage();
  const onTshirt = isTshirtStorePage();
  const { q, cat, brand, mall, sort, view, page } = getSearchParams();
  searchSort = sort;
  searchView = view;

  const landingQuery = landingDefaultQuery();
  const tshirtQuery = tshirtDefaultQuery();
  const hasFilters = !!(q || cat || brand);
  const isHomeFeed = !onLanding && !onTshirt && !hasFilters;
  const isLandingFeed = onLanding && !hasFilters;
  const isTshirtFeed = onTshirt && !hasFilters;
  const effectiveQ = q || (isLandingFeed ? landingQuery : isTshirtFeed ? tshirtQuery : "");

  let products;
  if (isLandingFeed) {
    products = landingFeedProducts();
  } else if (isTshirtFeed) {
    products = tshirtFeedProducts();
  } else if (isHomeFeed) {
    products = homeFeedProducts();
  } else {
    products = searchProducts(effectiveQ, { cat, brand });
  }
  products = filterByMall(products, mall);
  products = sortProducts(products, sort);

  const pageSize = 24;
  const paged = paginateList(products, page, pageSize);
  const pageProducts = paged.items;

  const allCats = relatedCategories(effectiveQ, cat, { homeFeed: isHomeFeed || isLandingFeed || isTshirtFeed });
  const visibleCats = searchCatsExpanded ? allCats : allCats.slice(0, 10);
  const brandSource = isLandingFeed
    ? landingFeedProducts()
    : isTshirtFeed
      ? tshirtFeedProducts()
      : isHomeFeed
        ? homeFeedProducts()
        : searchProducts(effectiveQ, { cat: cat || "" });
  const allBrands = brandsForResults(brandSource);
  const visibleBrands = searchBrandsExpanded ? allBrands : allBrands.slice(0, 8);
  const heading = resolveSearchHeading(q, cat, { landingFeed: isLandingFeed, tshirtFeed: isTshirtFeed });
  const bestCat = findBestCategoryForQuery(effectiveQ);
  const highlightedCatId = cat || bestCat?.id || "";
  const found = isHomeFeed ? products.length : itemsFoundCount(effectiveQ || q, products);
  const showingLabel = isHomeFeed
    ? getLang() === "bn"
      ? `${found.toLocaleString("en-BD")} টি পণ্য`
      : `${found.toLocaleString("en-BD")} products`
    : getLang() === "bn"
      ? `${found.toLocaleString("en-BD")} টি ফলাফল "${heading}" এর জন্য`
      : `${found.toLocaleString("en-BD")} items found for "${heading}"`;

  const sortOptions = [
    { id: "best", label: "Best Match" },
    { id: "sold", label: "Top Sales" },
    { id: "price-asc", label: "Price low to high" },
    { id: "price-desc", label: "Price high to low" },
  ];

  root.innerHTML = `
    <div class="search-layout">
      <aside class="search-sidebar">
        <div class="search-filter">
          <h3 class="search-filter__title">${getLang() === "bn" ? "ক্যাটাগরি" : "Category"}</h3>
          <ul class="search-filter__list" id="search-cat-list">
            ${visibleCats
              .map((c) => {
                const active = c.id === highlightedCatId ? " is-active" : "";
                return `<li><a class="search-filter__link${active}" href="${buildSearchUrl({ cat: c.id, q: effectiveQ || q || "", page: 1 })}">${categoryLabel(c)}</a></li>`;
              })
              .join("")}
          </ul>
          ${
            allCats.length > 10
              ? `<button type="button" class="search-filter__toggle" id="cat-toggle">${
                  searchCatsExpanded ? "VIEW LESS" : "VIEW MORE"
                }</button>`
              : ""
          }
        </div>
        <div class="search-filter">
          <h3 class="search-filter__title">${getLang() === "bn" ? "ব্র্যান্ড" : "Brand"}</h3>
          <ul class="search-filter__brands">
            ${visibleBrands
              .map((name) => {
                const checked = name.toLowerCase() === brand.toLowerCase();
                return `<li>
                  <label class="search-brand">
                    <input type="checkbox" data-brand="${name.replace(/"/g, "&quot;")}" ${checked ? "checked" : ""} />
                    <span>${name}</span>
                  </label>
                </li>`;
              })
              .join("")}
          </ul>
          ${
            allBrands.length > 8
              ? `<button type="button" class="search-filter__toggle" id="brand-toggle">${
                  searchBrandsExpanded ? "VIEW LESS" : "VIEW MORE"
                }</button>`
              : ""
          }
        </div>
        <div class="search-filter">
          <h3 class="search-filter__title">${getLang() === "bn" ? "সার্ভিস ও প্রমো" : "Service & Promotion"}</h3>
          <ul class="search-filter__brands">
            <li>
              <label class="search-brand">
                <input type="checkbox" id="mall-filter" ${mall ? "checked" : ""} />
                <span>Mall</span>
              </label>
            </li>
          </ul>
        </div>
      </aside>
      <section class="search-main">
        <div class="search-main__panel">
          <header class="search-main__head">
            <div>
              <h1 class="search-main__title">${pageTitleText(heading)}</h1>
              <p class="search-main__sub">${showingLabel}</p>
            </div>
          </header>
          <div class="search-toolbar">
            <div class="search-toolbar__sort">
              <span class="search-toolbar__label">Sort By:</span>
              ${sortOptions
                .map(
                  (opt) =>
                    `<button type="button" class="search-sort-btn${sort === opt.id ? " is-active" : ""}" data-sort="${opt.id}">${opt.label}</button>`
                )
                .join("")}
            </div>
            <div class="search-toolbar__view" role="group" aria-label="View">
              <span class="search-toolbar__label">View:</span>
              <button type="button" class="search-view-btn${view === "grid" ? " is-active" : ""}" data-view="grid" title="Grid">▦</button>
              <button type="button" class="search-view-btn${view === "list" ? " is-active" : ""}" data-view="list" title="List">☰</button>
            </div>
          </div>
          <div class="sr-grid${view === "list" ? " sr-grid--list" : ""}" id="sr-grid"></div>
          ${
            !pageProducts.length
              ? `<p class="empty-state">${getLang() === "bn" ? "কোনো পণ্য পাওয়া যায়নি।" : "No products found."}</p>`
              : ""
          }
          ${renderPagination(paged.page, paged.totalPages)}
        </div>
      </section>
    </div>
  `;

  const grid = root.querySelector("#sr-grid");
  if (grid && pageProducts.length) {
    pageProducts.forEach((p) => grid.appendChild(createSearchResultCard(p)));
  }

  const toggle = root.querySelector("#cat-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      searchCatsExpanded = !searchCatsExpanded;
      renderSearchPage();
    });
  }

  const brandToggle = root.querySelector("#brand-toggle");
  if (brandToggle) {
    brandToggle.addEventListener("click", () => {
      searchBrandsExpanded = !searchBrandsExpanded;
      renderSearchPage();
    });
  }

  const mallInput = root.querySelector("#mall-filter");
  if (mallInput) {
    mallInput.addEventListener("change", () => {
      window.location.href = buildSearchUrl({ mall: mallInput.checked, page: 1 });
    });
  }

  root.querySelectorAll(".search-brand input[data-brand]").forEach((input) => {
    input.addEventListener("change", () => {
      window.location.href = buildSearchUrl({
        brand: input.checked ? input.dataset.brand : "",
        page: 1,
      });
    });
  });

  root.querySelectorAll(".search-sort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = buildSearchUrl({ sort: btn.dataset.sort, page: 1 });
    });
  });

  root.querySelectorAll(".search-view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = buildSearchUrl({ view: btn.dataset.view, page: 1 });
    });
  });

  renderTrendingChips();
}

document.addEventListener("storeReady", renderSearchPage);
document.addEventListener("langchange", renderSearchPage);

function bootSearchPage() {
  if (STORE) renderSearchPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootSearchPage);
} else {
  bootSearchPage();
}
