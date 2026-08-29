let jfyVisible = 16;

function getJfyProducts() {
  if (HOME_PRODUCT_IDS && HOME_PRODUCT_IDS.length) {
    const picked = HOME_PRODUCT_IDS.map((id) => getProductById(id)).filter(Boolean);
    if (picked.length) return picked;
  }
  return PRODUCTS.slice();
}

function renderCategoryStrip() {
  const root = document.getElementById("category-strip");
  if (!root) return;
  if (!HOME_CATEGORY_ICONS.length) {
    root.innerHTML = `
      <section class="category-strip" aria-label="Categories">
        <div class="category-strip__row">
          ${CATEGORIES.slice(0, 12)
            .map(
              (c) => `
            <a class="category-strip__item" href="category.html?cat=${c.id}">
              <span class="category-strip__icon" aria-hidden="true">🛍️</span>
              <span class="category-strip__label">${categoryLabel(c)}</span>
            </a>`
            )
            .join("")}
        </div>
      </section>`;
    return;
  }

  root.innerHTML = `
    <section class="category-strip" aria-label="Categories">
      <div class="category-strip__row">
        ${HOME_CATEGORY_ICONS.map((icon) => {
          const href = icon.categoryId ? `category.html?cat=${icon.categoryId}` : "home.html";
          return `
            <a class="category-strip__item" href="${href}">
              <span class="category-strip__icon" aria-hidden="true">${icon.icon || "🛍️"}</span>
              <span class="category-strip__label">${homeCategoryIconLabel(icon)}</span>
            </a>`;
        }).join("")}
      </div>
    </section>
  `;
}

function renderHomeCategoriesGrid() {
  const root = document.getElementById("js-categories");
  if (!root) return;

  const cfg = HOME_CATEGORIES || {};
  const items = Array.isArray(cfg.items) ? cfg.items : [];
  if (!items.length) {
    root.innerHTML = "";
    return;
  }

  const title = getLang() === "bn" ? cfg.titleBn || cfg.title || "ক্যাটাগরি" : cfg.title || "Categories";

  root.innerHTML = `
    <section class="card-categories hp-mod-card" id="js_categories" aria-label="Categories">
      <div class="card-categories__inner">
        <h2 class="card-categories__title">${title}</h2>
        <div class="card-categories__grid">
          ${items
            .map((item) => {
              const label = getLang() === "bn" ? item.labelBn || item.label : item.label;
              let href = "#";
              if (item.linkType === "product" && item.productId) {
                href = `product.html?id=${encodeURIComponent(item.productId)}`;
              } else if (item.categoryId) {
                href = `category.html?cat=${encodeURIComponent(item.categoryId)}`;
              } else if (item.productId) {
                href = `product.html?id=${encodeURIComponent(item.productId)}`;
              } else if (item.href) {
                href = item.href;
              }
              const img =
                item.imageUrl ||
                (item.productId && getProductById(item.productId)
                  ? productImageUrl(getProductById(item.productId))
                  : "") ||
                "";
              return `
              <a class="card-categories__item" href="${href}" title="${label || ""}">
                <span class="card-categories__thumb">
                  ${
                    img
                      ? `<img src="${img}" alt="" loading="lazy" onerror="this.style.display='none'" />`
                      : `<span class="card-categories__fallback">${(label || "?").charAt(0)}</span>`
                  }
                </span>
                <span class="card-categories__label">${label || ""}</span>
              </a>`;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderHomeProducts() {
  const root = document.getElementById("home-products");
  if (!root) return;

  const products = getJfyProducts();
  root.innerHTML = `
    <section class="jfy pc-custom-link hp-mod-card jfy-comp-container" id="js_jfy">
      <div class="hp-mod-card-content">
        <h2 class="jfy__title" data-i18n="section.justForYou">${t("section.justForYou")}</h2>
        <div class="card-jfy-wrapper flex flex-row flex-wrap" id="jfy-grid"></div>
        <div class="jfy__more-wrap">
          <button type="button" class="jfy-load-more" id="jfy-load-more" data-i18n="section.loadMore">${t("section.loadMore")}</button>
        </div>
      </div>
    </section>
  `;

  const grid = root.querySelector("#jfy-grid");
  const moreBtn = root.querySelector("#jfy-load-more");

  function paint() {
    const slice = products.slice(0, jfyVisible);
    grid.innerHTML = "";
    slice.forEach((p) => grid.appendChild(createJfyCard(p)));
    if (moreBtn) {
      moreBtn.hidden = jfyVisible >= products.length;
    }
  }

  if (!products.length) {
    grid.innerHTML = `<p class="empty-state">${getLang() === "bn" ? "কোনো পণ্য নেই" : "No products yet."}</p>`;
    if (moreBtn) moreBtn.hidden = true;
    return;
  }

  paint();

  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      jfyVisible += 16;
      paint();
    });
  }
}

function renderFeaturedCategories() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  const list =
    FEATURED_CATEGORY_IDS && FEATURED_CATEGORY_IDS.length
      ? FEATURED_CATEGORY_IDS.map((id) => getCategoryById(id)).filter(Boolean)
      : CATEGORIES.slice();

  grid.innerHTML = list
    .map(
      (c) => `
      <a class="feature-card" href="category.html?cat=${c.id}">
        <h3>${categoryLabel(c)}</h3>
        <p>${getLang() === "bn" ? "এই ক্যাটাগরির পণ্য দেখুন" : "Browse products in this category"}</p>
        <span class="feature-card__count">${getProductsByCategory(c.id).length} products</span>
      </a>`
    )
    .join("");
}

function initHomeSections() {
  jfyVisible = 16;
  renderCategoryStrip();
  renderHomeCategoriesGrid();
  renderHomeProducts();
  renderFeaturedCategories();
}

document.addEventListener("langchange", () => {
  renderCategoryStrip();
  renderHomeCategoriesGrid();
  renderHomeProducts();
  renderFeaturedCategories();
});
