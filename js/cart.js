const CART_KEY = "ecom_cart";
const USER_KEY = "ecom_user";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
  document.dispatchEvent(new CustomEvent("cartchange", { detail: { items } }));
}

function addToCart(productId, qty = 1) {
  const items = getCart();
  const existing = items.find((i) => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ id: productId, qty });
  }
  saveCart(items);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.id !== productId));
}

function setCartQty(productId, qty) {
  const items = getCart();
  const item = items.find((i) => i.id === productId);
  if (!item) return;
  const next = Math.max(1, Number(qty) || 1);
  item.qty = next;
  saveCart(items);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, i) => {
    const p = getProductById(i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count === 0;
  });
}

function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
  document.dispatchEvent(new CustomEvent("userchange"));
}

function logoutUser() {
  setUser(null);
}

function formatPrice(n) {
  return "$" + Number(n).toFixed(2);
}

function jfyDiscount(product) {
  if (product.discount != null) return Number(product.discount) || 0;
  const sale = jfySalePrice(product);
  const original = jfyOriginalPrice(product);
  if (original > 0 && sale < original) return Math.round(((original - sale) / original) * 100);
  const n = parseInt(String(product.id).replace(/\D/g, ""), 10) || 1;
  return 15 + (n % 7) * 7;
}

function jfySalePrice(product) {
  if (product.salePrice != null) return Number(product.salePrice) || 0;
  if (product.discount != null) return product.price * (1 - Number(product.discount) / 100);
  return product.price * (1 - jfyDiscount(product) / 100);
}

function jfyOriginalPrice(product) {
  if (product.originalPrice != null) return Number(product.originalPrice) || product.price;
  return product.price;
}

function jfyRatingInfo(product) {
  if (product.rating != null || product.reviews != null) {
    return {
      rating: product.rating != null ? Number(product.rating) : 4.5,
      reviews: product.reviews != null ? Number(product.reviews) : 0,
    };
  }
  const n = parseInt(String(product.id).replace(/\D/g, ""), 10) || 1;
  const rating = 3.5 + (n % 15) / 10;
  const reviews = 20 + ((n * 37) % 580);
  return { rating: Math.min(5, Math.round(rating * 10) / 10), reviews };
}

function formatBdt(price) {
  const amount = Math.round(Number(price) * 120);
  return "৳" + amount.toLocaleString("en-BD");
}

function starsHtml(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '<span class="jfy-star is-on">★</span>';
    else if (i === full && half) html += '<span class="jfy-star is-half">★</span>';
    else html += '<span class="jfy-star">★</span>';
  }
  return html;
}

function createJfyCard(product) {
  const pct = jfyDiscount(product);
  const { rating, reviews } = jfyRatingInfo(product);
  const sale = jfySalePrice(product);
  const title = productLabel(product);
  const img = productImageUrl(product);
  const sold = product.sold != null ? Number(product.sold) : 0;

  const a = document.createElement("a");
  a.className = "jfy-card";
  a.href = `product.html?id=${encodeURIComponent(product.id)}`;
  a.title = title;
  a.dataset.id = product.id;
  a.innerHTML = `
    <div class="jfy-card__img">
      <img src="${img}" alt="${title}" loading="lazy" width="200" height="200"
        onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='${product.color || "#f5f5f5"}'" />
      ${product.badge ? `<span class="jfy-card__badge">${product.badge}</span>` : ""}
    </div>
    <div class="jfy-card__body">
      <p class="jfy-card__title">${title}</p>
      <div class="jfy-card__price-row">
        <span class="jfy-card__price">${formatBdt(sale)}</span>
        ${pct > 0 ? `<span class="jfy-card__discount">-${pct}%</span>` : ""}
      </div>
      <div class="jfy-card__rating" aria-label="${rating} stars">
        ${starsHtml(rating)}
        <span class="jfy-card__reviews">(${reviews})</span>
      </div>
      ${sold > 0 ? `<p class="jfy-card__sold">${sold} sold</p>` : ""}
    </div>
  `;
  return a;
}

function createProductCard(product, options = {}) {
  const { animate = false } = options;
  const card = createJfyCard(product);
  if (animate) card.classList.add("product-card--animate");
  return card;
}

function refreshProductLabels() {
  document.querySelectorAll(".jfy-card").forEach((card) => {
    const product = getProductById(card.dataset.id);
    if (!product) return;
    card.replaceWith(createJfyCard(product));
  });
}

document.addEventListener("langchange", refreshProductLabels);
