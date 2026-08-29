function reviewPageSettings() {
  const defaults = {
    eyebrow: "IN THEIR OWN WORDS",
    eyebrowBn: "তাদের নিজের ভাষায়",
    title: "Stories from our customers.",
    titleBn: "আমাদের কাস্টমারদের গল্প।",
  };
  return { ...defaults, ...(SITE_SETTINGS.reviewsPage || {}) };
}

function reviewStars(n) {
  const rating = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="wp-story-card__star${i <= rating ? " is-on" : ""}">★</span>`;
  }
  return html;
}

function reviewInitial(name) {
  return String(name || "?").trim().charAt(0).toUpperCase() || "?";
}

function groupReviewsByCategory(reviews) {
  const map = new Map();
  reviews.forEach((r) => {
    const key = r.category || r.categoryBn || "Customer Stories";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });
  return map;
}

function renderReviewsPage() {
  const root = document.getElementById("reviews-page");
  if (!root) return;

  const page = reviewPageSettings();
  const bn = getLang() === "bn";
  const eyebrow = bn ? page.eyebrowBn || page.eyebrow : page.eyebrow;
  const title = bn ? page.titleBn || page.title : page.title;
  const list = Array.isArray(REVIEWS) ? REVIEWS : [];

  if (!list.length) {
    root.innerHTML = `
      <section class="wp-stories-section section-blend">
        <div class="wp-stories-section__inner">
          <p class="wp-stories-section__eyebrow">${eyebrow || ""}</p>
          <h1 class="wp-stories-section__title">${title || ""}</h1>
          <p class="wp-stories-section__empty">${bn ? "এখনো কোনো রিভিউ নেই।" : "No reviews yet."}</p>
        </div>
      </section>`;
    return;
  }

  const groups = groupReviewsByCategory(list);
  const sectionsHtml = [...groups.entries()]
    .map(([catKey, items]) => {
      const heading =
        bn && items[0]?.categoryBn
          ? items[0].categoryBn
          : items[0]?.category || catKey;
      const cards = items
        .map((r) => {
          const text = bn ? r.textBn || r.text : r.text || r.textBn;
          const name = r.name || "Customer";
          return `
          <article class="wp-story-card">
            <div class="wp-story-card__stars" aria-label="${r.rating || 5} stars">${reviewStars(r.rating || 5)}</div>
            <p class="wp-story-card__quote">${text || ""}</p>
            <div class="wp-story-card__person">
              <span class="wp-story-card__avatar" aria-hidden="true">${reviewInitial(name)}</span>
              <strong class="wp-story-card__name">${name}</strong>
            </div>
          </article>`;
        })
        .join("");
      return `
        <div class="wp-stories-group">
          <h2 class="wp-stories-group__title">✓ ${heading}</h2>
          <div class="wp-stories-grid">${cards}</div>
        </div>`;
    })
    .join("");

  root.innerHTML = `
    <section class="wp-stories-section section-blend">
      <div class="wp-stories-section__inner">
        <p class="wp-stories-section__eyebrow">${eyebrow || ""}</p>
        <h1 class="wp-stories-section__title">${title || ""}</h1>
        ${sectionsHtml}
      </div>
    </section>
  `;
}

document.addEventListener("storeReady", renderReviewsPage);
document.addEventListener("langchange", renderReviewsPage);
if (STORE) renderReviewsPage();
else if (typeof initStore === "function") initStore().then(renderReviewsPage);
