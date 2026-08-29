function flashSalePrice(product) {
  const discount = 0.15 + (parseInt(product.id.replace("p", ""), 10) % 5) * 0.05;
  const sale = product.price * (1 - discount);
  return { sale, old: product.price, pct: Math.round(discount * 100) };
}

function flashProductTitle(product) {
  const name = productLabel(product);
  const suffix = getLang() === "bn" ? " | বিশেষ অফার" : " | Special Offer";
  return name + suffix;
}

function renderFlashSale() {
  const root = document.getElementById("flash-sale");
  if (!root) return;

  const items = getFlashSaleProducts();
  if (!items.length) {
    root.innerHTML = "";
    return;
  }

  const cards = items
    .map((p) => {
      const { sale, pct } = flashSalePrice(p);
      const cat = getCategoryById(p.category);
      const catName = cat ? categoryLabel(cat) : "";
      const img = productImageUrl(p);
      const title = flashProductTitle(p);
      return `
        <a class="fs-card" href="product.html?id=${p.id}" data-id="${p.id}" title="${title}">
          <div class="common-img fs-card-img img-w100p">
            <picture>
              <img
                src="${img}"
                alt="${productLabel(p)}"
                loading="lazy"
                width="188"
                height="188"
                data-fallback-color="${p.color}"
                data-fallback-pct="${pct}"
              />
            </picture>
            <span class="fs-card-img__badge">-${pct}%</span>
          </div>
          <div class="fs-card__body">
            <p class="fs-card__name">${title}</p>
            <p class="fs-card__cat">${catName}</p>
            <p class="fs-card__price"><strong>${formatPrice(sale)}</strong></p>
          </div>
        </a>`;
    })
    .join("");

  root.innerHTML = `
    <section class="flash-sale cardFsContent" id="js_flashSale">
      <h2 class="flash-sale__title" data-i18n="flash.title">${t("flash.title")}</h2>
      <div class="flash-sale__header card-fs-content-header flex flex-justify-between">
        <span class="flash-sale__status" data-i18n="flash.onSale">${t("flash.onSale")}</span>
        <a class="flash-sale__shop-all" href="home.html" data-i18n="flash.shopAll">${t("flash.shopAll")}</a>
      </div>
      <div class="flash-sale__row flex">${cards}</div>
    </section>
  `;

  root.querySelectorAll(".fs-card-img img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        const wrap = img.closest(".fs-card-img");
        if (!wrap || wrap.querySelector(".fs-card-img__fallback")) return;
        const color = img.dataset.fallbackColor || "#f57224";
        const pct = img.dataset.fallbackPct || "";
        wrap.innerHTML = `<div class="fs-card-img__fallback" style="--fs-accent:${color}"><span>-${pct}%</span></div>`;
      },
      { once: true }
    );
  });
}

document.addEventListener("langchange", renderFlashSale);
document.addEventListener("storeReady", renderFlashSale);
