let productQty = 1;
let activeGalleryIndex = 0;
let activeColorIndex = 0;
let activeStorage = "";

function pdpFormatBdt(price) {
  const amount = Math.round(Number(price) * 120);
  return "৳ " + amount.toLocaleString("en-BD");
}

function productGallery(product) {
  const gallery = Array.isArray(product.imageGallery) ? product.imageGallery.filter(Boolean) : [];
  if (product.imageUrl) gallery.unshift(product.imageUrl);
  if (!gallery.length) gallery.push(productImageUrl(product));
  return [...new Set(gallery)];
}

function pdpDiscount(product) {
  if (product.discount != null) return Number(product.discount) || 0;
  const sale = pdpSalePrice(product);
  const original = pdpOriginalPrice(product);
  if (original > 0 && sale < original) return Math.round(((original - sale) / original) * 100);
  return 20;
}

function pdpSalePrice(product) {
  if (product.salePrice != null) return Number(product.salePrice) || 0;
  const discount = product.discount != null ? Number(product.discount) || 0 : 20;
  return product.price * (1 - discount / 100);
}

function pdpOriginalPrice(product) {
  if (product.originalPrice != null) return Number(product.originalPrice) || product.price;
  return product.price;
}

function pdpStars(rating) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  let html = "";
  for (let i = 1; i <= 5; i++) html += `<span class="pdp-star${i <= filled ? " is-on" : ""}">★</span>`;
  return html;
}

function pdpFlashEndsAt(product) {
  const now = new Date();
  const days = Number(product.flashDays || 0);
  const hours = Number(product.flashHours != null ? product.flashHours : 8);
  const mins = Number(product.flashMinutes != null ? product.flashMinutes : 45);
  const secs = Number(product.flashSeconds != null ? product.flashSeconds : 0);
  return new Date(now.getTime() + days * 86400000 + hours * 3600000 + mins * 60000 + secs * 1000);
}

function pdpCountdownText(endAt, withDays) {
  const diff = Math.max(0, endAt.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hoursTotal = Math.floor(diff / 3600000);
  const hours = String(withDays && days > 0 ? Math.floor((diff % 86400000) / 3600000) : hoursTotal).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  if (withDays && days > 0) return `${days} days ${hours}:${mins}:${secs}`;
  return `${hours}:${mins}:${secs}`;
}

function pdpColorOptions(product, gallery) {
  if (Array.isArray(product.colors) && product.colors.length) {
    return product.colors.map((c, i) => ({
      label: typeof c === "string" ? c : c.label || `Color ${i + 1}`,
      image: (typeof c === "object" && c.image) || gallery[i] || gallery[0],
    }));
  }
  return gallery.slice(0, Math.min(4, gallery.length)).map((src, i) => ({
    label: product.colorLabel || `Option ${i + 1}`,
    image: src,
  }));
}

function pdpStorageOptions(product) {
  if (Array.isArray(product.storageOptions) && product.storageOptions.length) return product.storageOptions;
  if (product.storage) return [String(product.storage)];
  const match = String(product.name || "").match(/(\d+\s*\/\s*\d+\s*GB|\d+\s*GB)/i);
  return match ? [match[1].replace(/\s+/g, "")] : [];
}

function pdpInstalmentText(product, sale) {
  if (product.instalmentText) return product.instalmentText;
  const months = Number(product.instalmentMonths || 6);
  const perMonth = Math.round((sale * 120) / months);
  return `Up to ${months} months, as low as ৳ ${perMonth.toLocaleString("en-BD")} per month`;
}

function renderProductDetail() {
  const root = document.getElementById("product-detail");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id"));
  if (!product) {
    root.innerHTML = `<div class="content-card"><h1 class="page-title">Product not found</h1><p class="page-lead">Choose a product from search or category page.</p></div>`;
    return;
  }

  const cat = getCategoryById(product.category);
  const gallery = productGallery(product);
  const colors = pdpColorOptions(product, gallery);
  activeColorIndex = Math.min(activeColorIndex, Math.max(0, colors.length - 1));
  activeGalleryIndex = Math.min(activeGalleryIndex, gallery.length - 1);
  const storageOptions = pdpStorageOptions(product);
  if (!activeStorage && storageOptions.length) activeStorage = storageOptions[0];
  if (activeStorage && !storageOptions.includes(activeStorage) && storageOptions.length) {
    activeStorage = storageOptions[0];
  }

  const mainImage = colors[activeColorIndex]?.image || gallery[activeGalleryIndex];
  const rating = product.rating != null ? product.rating : 5;
  const reviews = product.reviews != null ? product.reviews : 0;
  const sale = pdpSalePrice(product);
  const original = pdpOriginalPrice(product);
  const badge = product.badge || "FLASH SALE";
  const brand = product.brand || "No Brand";
  const sold = product.sold != null ? product.sold : 0;
  const colorLabel = colors[activeColorIndex]?.label || product.colorLabel || "Default";
  const endAt = pdpFlashEndsAt(product);
  const showDays = Number(product.flashDays || 0) > 0;
  const promoText = product.detailPromoText || "";
  const promoMeta = product.detailPromoMeta || "";
  const stockNote = product.stockNote || "Almost sold out, buy now!";
  const parentCrumb = cat ? categoryLabel(cat) : "Products";
  const tshirtIds = typeof TSHIRT_PRODUCT_IDS !== "undefined" ? TSHIRT_PRODUCT_IDS : [];
  const isTshirtProduct = tshirtIds.includes(product.id) || product.category === "apparel";
  const storeHref = isTshirtProduct ? "tshirt.html" : "index.html";
  const storeLabel = isTshirtProduct ? "T-Shirt" : "Store";
  const listHref = isTshirtProduct
    ? "tshirt.html"
    : `index.html?q=${encodeURIComponent((SITE_SETTINGS.landing && SITE_SETTINGS.landing.searchQuery) || "headphone")}`;

  root.innerHTML = `
    <section class="pdp">
      <nav class="pdp-breadcrumb">
        <a href="${storeHref}">${storeLabel}</a>
        <span>›</span>
        <a href="${listHref}">${parentCrumb}</a>
        <span>›</span>
        <span>${productLabel(product)}</span>
      </nav>
      <div class="pdp-shell">
        <div class="pdp-gallery">
          <div class="pdp-gallery__main">
            <img src="${mainImage}" alt="${productLabel(product)}" />
          </div>
          <div class="pdp-gallery__thumbs">
            ${gallery
              .map(
                (src, i) => `<button type="button" class="pdp-thumb${i === activeGalleryIndex ? " is-active" : ""}" data-gallery="${i}">
                  <img src="${src}" alt="thumb ${i + 1}" />
                </button>`
              )
              .join("")}
          </div>
        </div>
        <div class="pdp-main">
          ${
            promoText
              ? `<div class="pdp-promo">
                  <strong>${promoText}</strong>
                  ${promoMeta ? `<span>${promoMeta}</span>` : ""}
                </div>`
              : `<div class="pdp-flash">
                  <span class="pdp-flash__tag">${badge.includes("FLASH") ? "FLASH SALE" : badge || "FLASH SALE"}</span>
                  <span class="pdp-flash__timer">Ends in <strong id="pdp-countdown">${pdpCountdownText(endAt, showDays)}</strong></span>
                  <span class="pdp-flash__sold">${sold} sold</span>
                </div>`
          }

          <h1 class="pdp-title">${productLabel(product)}</h1>
          <div class="pdp-rating">
            <span class="pdp-rating__stars">${pdpStars(rating)}</span>
            <span class="pdp-rating__count">Ratings ${reviews}</span>
          </div>

          <p class="pdp-brand">
            Brand: <a href="home.html?q=${encodeURIComponent(brand)}"><strong>${brand}</strong></a>
            <span>|</span>
            <a href="home.html?q=${encodeURIComponent(brand)}">More ${parentCrumb} from ${brand}</a>
          </p>

          <div class="pdp-pricebox">
            <div class="pdp-price">${pdpFormatBdt(sale)}</div>
            <div class="pdp-pricebox__sub">
              <span class="pdp-pricebox__old">${pdpFormatBdt(original)}</span>
              <span class="pdp-pricebox__off">-${pdpDiscount(product)}%</span>
            </div>
            <p class="pdp-instalment">Instalment: ${pdpInstalmentText(product, sale)}</p>
          </div>

          <div class="pdp-option">
            <span class="pdp-option__label">Color Family</span>
            <div>
              <div class="pdp-option__value">${colorLabel}</div>
              <div class="pdp-colors">
                ${colors
                  .map(
                    (c, i) => `<button type="button" class="pdp-color${i === activeColorIndex ? " is-active" : ""}" data-color="${i}" title="${c.label}">
                      <img src="${c.image}" alt="${c.label}" />
                      ${i === activeColorIndex ? `<span class="pdp-color__check">✓</span>` : ""}
                    </button>`
                  )
                  .join("")}
              </div>
            </div>
          </div>

          ${
            storageOptions.length
              ? `<div class="pdp-option">
                  <span class="pdp-option__label">Storage Capacity</span>
                  <div>
                    <div class="pdp-option__value">${activeStorage}</div>
                    <div class="pdp-storage">
                      ${storageOptions
                        .map(
                          (s) =>
                            `<button type="button" class="pdp-storage__btn${s === activeStorage ? " is-active" : ""}" data-storage="${s}">${s}</button>`
                        )
                        .join("")}
                    </div>
                  </div>
                </div>`
              : ""
          }

          <div class="pdp-buyrow">
            <label class="pdp-qty">
              <span>Quantity</span>
              <div class="pdp-qty__wrap">
                <div class="pdp-qty__ctrl">
                  <button type="button" id="qty-minus">−</button>
                  <input id="qty-input" type="number" min="1" value="${productQty}" />
                  <button type="button" id="qty-plus">+</button>
                </div>
                <em class="pdp-stocknote">${stockNote}</em>
              </div>
            </label>
          </div>

          <div class="pdp-actions">
            <button type="button" class="btn btn--sky" id="buy-now-btn">Buy Now</button>
            <button type="button" class="btn btn--primary" id="add-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
      <div class="pdp-details">
        <h2 class="pdp-details__title">${getLang() === "bn" ? "পণ্যের বিবরণ" : "Product details"}</h2>
        ${(() => {
          const bn = getLang() === "bn";
          const desc = bn
            ? product.descriptionBn || product.description
            : product.description || product.descriptionBn;
          const highlights = bn
            ? product.highlightsBn || product.highlights
            : product.highlights || product.highlightsBn;
          const box = bn
            ? product.boxContentsBn || product.boxContents
            : product.boxContents || product.boxContentsBn;
          const specs = Array.isArray(product.specs) ? product.specs : [];
          const warranty = bn ? product.warrantyBn || product.warranty : product.warranty || product.warrantyBn;
          const escText = (v) =>
            String(v ?? "")
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");

          const descHtml = desc
            ? String(desc)
                .split(/\n+/)
                .filter(Boolean)
                .map((para) => `<p>${escText(para)}</p>`)
                .join("")
            : `<p>${escText(
                bn
                  ? `${productLabel(product)} — ব্র্যান্ড ${brand}, ক্যাটাগরি ${parentCrumb}। অরিজিনাল পণ্য, ক্যাশ অন ডেলিভারি ও দ্রুত হোম ডেলিভারি সুবিধা।`
                  : `${productLabel(product)} from ${brand} in ${parentCrumb}. Authentic product with cash on delivery and fast home delivery across Bangladesh.`
              )}</p>`;

          const highlightHtml =
            Array.isArray(highlights) && highlights.length
              ? `<div class="pdp-details__block">
                  <h3 class="pdp-details__subtitle">${bn ? "হাইলাইটস" : "Highlights"}</h3>
                  <ul class="pdp-details__list">
                    ${highlights.map((h) => `<li>${escText(h)}</li>`).join("")}
                  </ul>
                </div>`
              : "";

          const specsHtml = `<div class="pdp-details__block">
                  <h3 class="pdp-details__subtitle">${bn ? "স্পেসিফিকেশন" : "Specifications"}</h3>
                  <table class="pdp-specs">
                    <tbody>
                      ${
                        specs.length
                          ? specs
                              .map((row) => {
                                const label = bn ? row.labelBn || row.label : row.label;
                                const value = row.value || "";
                                return `<tr><th>${escText(label)}</th><td>${escText(value)}</td></tr>`;
                              })
                              .join("")
                          : `<tr><th>${bn ? "ব্র্যান্ড" : "Brand"}</th><td>${escText(brand)}</td></tr>
                             <tr><th>${bn ? "ক্যাটাগরি" : "Category"}</th><td>${escText(parentCrumb)}</td></tr>
                             <tr><th>${bn ? "কালার" : "Color"}</th><td>${escText(colorLabel)}</td></tr>
                             ${activeStorage ? `<tr><th>Storage</th><td>${escText(activeStorage)}</td></tr>` : ""}
                             ${sold ? `<tr><th>${bn ? "বিক্রি" : "Sold"}</th><td>${sold}</td></tr>` : ""}`
                      }
                    </tbody>
                  </table>
                </div>`;

          const boxHtml =
            Array.isArray(box) && box.length
              ? `<div class="pdp-details__block">
                  <h3 class="pdp-details__subtitle">${bn ? "বক্সে যা থাকবে" : "What's in the box"}</h3>
                  <ul class="pdp-details__list">
                    ${box.map((item) => `<li>${escText(item)}</li>`).join("")}
                  </ul>
                </div>`
              : "";

          const warrantyHtml = warranty
            ? `<div class="pdp-details__block">
                <h3 class="pdp-details__subtitle">${bn ? "ওয়ারেন্টি ও সার্ভিস" : "Warranty & service"}</h3>
                <p class="pdp-details__note">${escText(warranty)}</p>
              </div>`
            : "";

          return `
            <div class="pdp-details__grid">
              <div class="pdp-details__main">
                <div class="pdp-details__block">
                  <h3 class="pdp-details__subtitle">${bn ? "বিস্তারিত বর্ণনা" : "Description"}</h3>
                  <div class="pdp-details__body">${descHtml}</div>
                </div>
                ${highlightHtml}
                ${boxHtml}
                ${warrantyHtml}
              </div>
              <aside class="pdp-details__aside">
                ${specsHtml}
              </aside>
            </div>`;
        })()}
      </div>
    </section>
  `;

  const countdownEl = document.getElementById("pdp-countdown");
  if (window.pdpTimer) clearInterval(window.pdpTimer);
  if (countdownEl) {
    window.pdpTimer = setInterval(() => {
      countdownEl.textContent = pdpCountdownText(endAt, showDays);
    }, 1000);
  }

  root.querySelectorAll("[data-gallery]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeGalleryIndex = Number(btn.dataset.gallery) || 0;
      activeColorIndex = Math.min(activeGalleryIndex, colors.length - 1);
      renderProductDetail();
    });
  });

  root.querySelectorAll("[data-color]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeColorIndex = Number(btn.dataset.color) || 0;
      activeGalleryIndex = Math.min(activeColorIndex, gallery.length - 1);
      renderProductDetail();
    });
  });

  root.querySelectorAll("[data-storage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeStorage = btn.dataset.storage || "";
      renderProductDetail();
    });
  });

  const qtyInput = root.querySelector("#qty-input");
  root.querySelector("#qty-minus").addEventListener("click", () => {
    productQty = Math.max(1, productQty - 1);
    qtyInput.value = productQty;
  });
  root.querySelector("#qty-plus").addEventListener("click", () => {
    productQty += 1;
    qtyInput.value = productQty;
  });
  qtyInput.addEventListener("input", () => {
    productQty = Math.max(1, Number(qtyInput.value) || 1);
    qtyInput.value = productQty;
  });

  root.querySelector("#add-cart-btn").addEventListener("click", () => {
    addToCart(product.id, productQty);
  });
  root.querySelector("#buy-now-btn").addEventListener("click", () => {
    addToCart(product.id, productQty);
    window.location.href = "cart.html";
  });
}

window.addEventListener("storeReady", renderProductDetail);
document.addEventListener("langchange", renderProductDetail);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (STORE) renderProductDetail();
    else initStore().then(renderProductDetail);
  });
} else if (STORE) {
  renderProductDetail();
} else {
  initStore().then(renderProductDetail);
}
