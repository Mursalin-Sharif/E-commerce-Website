function getPromoBannerHTML() {
  const slides = BANNERS.map((b) => {
    const href = b.href || "home.html";
    const title = bannerField(b, "title");
    const subtitle = bannerField(b, "subtitle");
    const cta = bannerField(b, "cta") || "Shop Now";
    const badge = bannerField(b, "badge") || (b.stats && b.stats[0]) || "";

    if (b.imageUrl) {
      return `
      <a class="banner-slide banner-slide--image" href="${href}">
        <img class="banner-slide__img" src="${b.imageUrl}" alt="${title || "Promo"}" loading="eager" />
        ${
          title || subtitle || badge
            ? `<div class="banner-slide__overlay">
                ${badge ? `<span class="banner-slide__badge">${badge}</span>` : ""}
                ${title ? `<h2 class="banner-slide__title">${title}</h2>` : ""}
                ${subtitle ? `<p class="banner-slide__sub">${subtitle}</p>` : ""}
                ${cta ? `<span class="banner-slide__cta">${cta}</span>` : ""}
              </div>`
            : ""
        }
      </a>`;
    }

    const stats = (b.stats || [])
      .map((s, i) => (i === 1 ? `<em>${s}</em>` : `<span>${s}</span>`))
      .join("");
    const theme = b.theme || "delivery";
    const artClass = `banner-slide__art banner-slide__art--${theme}`;
    return `
      <a class="banner-slide banner-slide--${theme}" href="${href}">
        <div class="banner-slide__copy">
          <h2 class="banner-slide__title">${title}</h2>
          <div class="banner-slide__stats">${stats}</div>
          <p class="banner-slide__sub">${subtitle}</p>
          <span class="banner-slide__cta">${cta}</span>
        </div>
        <div class="${artClass}" aria-hidden="true">
          ${theme === "delivery" ? '<div class="art-road"></div><div class="art-scooter"></div><div class="art-box art-box--1"></div><div class="art-box art-box--2"></div><div class="art-box art-box--3"></div>' : ""}
          ${theme === "sale" ? '<div class="art-gadget"></div><div class="art-badge">40%</div>' : ""}
          ${theme === "fashion" ? '<div class="art-hanger"></div>' : ""}
          ${theme === "home" ? '<div class="art-house"></div>' : ""}
        </div>
      </a>`;
  }).join("");

  return `
    <section class="banner-slider pc-banner-slider-container" data-banner-slider aria-roledescription="carousel" aria-label="Promotions">
      <div class="banner-slider__viewport banner-container-inner">
        <div class="banner-slider__track swiper-wrapper">${slides}</div>
      </div>
      <button type="button" class="banner-slider__prev" aria-label="Previous slide">‹</button>
      <button type="button" class="banner-slider__next" aria-label="Next slide">›</button>
      <div class="banner-slider__dots" role="tablist" aria-label="Slide indicators"></div>
    </section>
  `;
}

function renderPromoBanner() {
  const el = document.getElementById("promo-banner");
  if (!el) return;
  if (!BANNERS.length) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = getPromoBannerHTML();
  const node = el.querySelector("[data-banner-slider]");
  if (node && typeof initBannerSlider === "function") initBannerSlider(node);
}
