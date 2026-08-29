function currentPage() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "") return "home.html";
  return path.split("/").pop() || "home.html";
}

function storeListPageBase() {
  if (currentPage() === "index.html" || document.body.classList.contains("landing-store")) return "index.html";
  if (currentPage() === "tshirt.html" || document.body.classList.contains("tshirt-store")) return "tshirt.html";
  return "home.html";
}

function headerSearchValue() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) return q;
  if (typeof SITE_SETTINGS !== "undefined") {
    const page = currentPage();
    if (page === "index.html") {
      const landing = SITE_SETTINGS.landing || {};
      if (landing.showStoreGrid !== false && landing.searchQuery) return landing.searchQuery;
    }
    if (page === "tshirt.html") {
      const tshirt = SITE_SETTINGS.tshirt || {};
      if (tshirt.searchQuery) return tshirt.searchQuery;
    }
  }
  return "";
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;

  const user = getUser();
  const authLinks = user
    ? `<span class="top-links__user">${user.name || user.email}</span>
       <button type="button" class="top-links__item top-links__btn" id="logout-btn" data-i18n="header.logout">LOGOUT</button>`
    : `<a class="top-links__item" href="login.html" data-i18n="header.login">LOGIN</a>
       <a class="top-links__item" href="signup.html" data-i18n="header.signup">SIGN UP</a>`;

  const links = Array.isArray(SITE_SETTINGS.headerLinks) ? SITE_SETTINGS.headerLinks : [];
  const topLinkHtml = links
    .map((link, i) => {
      const label = getLang() === "bn" ? link.labelBn || link.label : link.label;
      const hideClass = i < 2 ? " is-priority-hide" : "";
      return `<a class="top-links__item${hideClass}" href="${link.href || "#"}">${label || ""}</a>`;
    })
    .join("");

  const logoUrl = SITE_SETTINGS.logoUrl || "";
  const name = siteName();
  const mark = (SITE_SETTINGS.siteName || "D").trim().charAt(0).toLowerCase() || "d";
  const brandHtml = logoUrl
    ? `<img class="brand__logo" src="${logoUrl}" alt="${name}" />`
    : `<span class="brand__mark" aria-hidden="true">${mark}</span><span class="brand__text">${name}</span>`;

  el.innerHTML = `
    <div class="top-action-bar">
      <div class="container top-action-bar__inner">
        <div class="top-links links-list" id="topActionLinks">
          ${topLinkHtml}
          ${authLinks}
          <div class="top-links__lang" role="group" aria-label="Language">
            <span class="top-links__item top-links__lang-label" data-i18n="header.lang">ভাষা</span>
            <button type="button" class="lang-btn" data-lang="en">EN</button>
            <button type="button" class="lang-btn" data-lang="bn">বাং</button>
          </div>
        </div>
      </div>
    </div>
    <div class="main-header-bar">
      <div class="container header__inner">
        <a class="brand" href="home.html">${brandHtml}</a>
        <form class="header-search" id="site-search-form" action="${storeListPageBase()}" method="get" role="search">
          <div class="search-box">
            <input
              type="search"
              id="q"
              name="q"
              class="header-search__input search-box__input"
              data-i18n-placeholder="header.search"
              placeholder="${searchPlaceholder()}"
              autocomplete="off"
              tabindex="1"
              value="${headerSearchValue()}"
            />
            <button type="submit" class="header-search__btn" aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="search-suggest" id="search-suggest" hidden></div>
          </div>
        </form>
        <div class="header__actions">
          <a class="cart-link" href="cart.html" aria-label="Cart">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="20" r="1.2" fill="currentColor"/>
              <circle cx="18" cy="20" r="1.2" fill="currentColor"/>
            </svg>
            <span class="cart-badge" hidden>0</span>
          </a>
          <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  `;

  el.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  const logoutBtn = el.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutUser();
      renderHeader();
      applyI18n();
      updateCartBadge();
    });
  }

  const toggle = el.querySelector("#nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const nav = document.getElementById("site-nav");
      const open = nav && nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", !!open);
    });
  }

  initHeaderSearch(el);
}

function initHeaderSearch(headerEl) {
  const input = headerEl.querySelector("#q");
  const suggest = headerEl.querySelector("#search-suggest");
  const form = headerEl.querySelector("#site-search-form");
  if (!input || !suggest || !form) return;

  function hideSuggest() {
    suggest.hidden = true;
    suggest.innerHTML = "";
  }

  function showSuggest(query) {
    const q = query.trim();
    if (q.length < 1) {
      hideSuggest();
      return;
    }
    const matches = searchProducts(q).slice(0, 8);
    if (!matches.length) {
      suggest.innerHTML = `<div class="search-suggest__empty">${
        getLang() === "bn" ? "কোনো ফলাফল নেই" : "No results found"
      }</div>`;
      suggest.hidden = false;
      return;
    }
    suggest.innerHTML = matches
      .map((p) => {
        const cat = getCategoryById(p.category);
        return `<button type="button" class="search-suggest__item" data-id="${p.id}" data-name="${productLabel(p)}">
          <span class="search-suggest__name">${productLabel(p)}</span>
          <span class="search-suggest__meta">${cat ? categoryLabel(cat) : ""} · ${formatPrice(p.price)}</span>
        </button>`;
      })
      .join("");
    suggest.hidden = false;

    suggest.querySelectorAll(".search-suggest__item").forEach((btn) => {
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = btn.dataset.name;
        window.location.href = `${storeListPageBase()}?q=${encodeURIComponent(btn.dataset.name)}`;
      });
    });
  }

  input.addEventListener("input", () => showSuggest(input.value));
  input.addEventListener("focus", () => {
    if (input.value.trim()) showSuggest(input.value);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideSuggest();
  });
  document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) hideSuggest();
  });

  form.addEventListener("submit", (e) => {
    const q = input.value.trim();
    if (!q) {
      e.preventDefault();
      input.focus();
      return;
    }
    hideSuggest();
  });
}

function renderNav() {
  const el = document.getElementById("site-nav");
  if (!el) return;

  const page = currentPage();
  const navQuery = (new URLSearchParams(window.location.search).get("q") || "").trim().toLowerCase();
  const links = [
    { href: "home.html", key: "nav.home", match: ["home.html"], matchQuery: "" },
    { href: "index.html", key: "nav.landing", match: ["index.html"] },
    { href: "tshirt.html", key: "nav.tshirt", match: ["tshirt.html"] },
    { href: "review.html", key: "nav.review", match: ["review.html"] },
    { href: "contact.html", key: "nav.contact", match: ["contact.html"] },
    { href: "services.html", key: "nav.services", match: ["services.html"] },
    { href: "privacy.html", key: "nav.privacy", match: ["privacy.html"] },
  ];

  const linkHtml = links
    .map((l) => {
      const queryOk =
        l.matchQuery === undefined ||
        (l.matchQuery === "" ? !navQuery : navQuery === String(l.matchQuery).toLowerCase());
      const active = l.match.includes(page) && queryOk ? " is-active" : "";
      return `<a class="nav__link${active}" href="${l.href}" data-i18n="${l.key}">${t(l.key)}</a>`;
    })
    .join("");

  const cats = CATEGORIES.map(
    (c) =>
      `<a class="mega-menu__item" href="category.html?cat=${c.id}">${categoryLabel(c)}</a>`
  ).join("");

  el.innerHTML = `
    <div class="container nav__inner">
      <div class="nav__links">${linkHtml}</div>
      <div class="nav__cats">
        <button type="button" class="cats-trigger" id="cats-trigger" aria-expanded="false" aria-haspopup="true">
          <span data-i18n="nav.categories">${t("nav.categories")}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="mega-menu" id="mega-menu" role="menu">${cats}</div>
      </div>
    </div>
  `;

  const trigger = el.querySelector("#cats-trigger");
  const menu = el.querySelector("#mega-menu");
  const wrap = el.querySelector(".nav__cats");

  function closeMega() {
    wrap.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function openMega() {
    wrap.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    wrap.addEventListener("mouseenter", openMega);
    wrap.addEventListener("mouseleave", closeMega);
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (wrap.classList.contains("is-open")) closeMega();
    else openMega();
  });

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) closeMega();
  });
}

function socialIconSvg(network) {
  const icons = {
    facebook: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M13.5 8.5h1.7V6.1c-.3 0-.9-.1-1.7-.1-1.7 0-2.9 1.1-2.9 3V11H8.5v2.6h2.1V20h2.6v-6.4h2.2l.4-2.6h-2.6V9.2c0-.7.2-1.2 1.3-1.2z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#FF0000"/><path fill="#fff" d="M10 8.5v7l6-3.5-6-3.5z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1DA1F2"/><path fill="#fff" d="M17.6 8.4c-.4.2-.8.3-1.3.4.5-.3.8-.7 1-1.2-.4.3-.9.5-1.4.6A2.1 2.1 0 0 0 12.5 10c0 .2 0 .3.1.5-1.8-.1-3.3-.9-4.4-2.2-.2.3-.3.7-.3 1.1 0 .7.4 1.4 1 1.7-.4 0-.7-.1-1-.3v.1c0 1 .7 1.9 1.7 2.1-.2.1-.4.1-.6.1-.1 0-.3 0-.4-.1.3.9 1.1 1.5 2.1 1.5A4.2 4.2 0 0 1 6.5 16a6 6 0 0 0 3.2.9c3.9 0 6-3.2 6-6v-.3c.4-.3.8-.7 1.1-1.1z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><defs><linearGradient id="ig" x1="0" y1="24" x2="24" y2="0"><stop stop-color="#feda75"/><stop offset=".5" stop-color="#d62976"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="#fff"/></svg>`,
  };
  return icons[network] || icons.facebook;
}

function countryFlagUrl(country) {
  if (country.flagUrl) return country.flagUrl;
  const code = String(country.flagCode || "bd").toLowerCase();
  return `https://flagcdn.com/w40/${code}.png`;
}

function footerEscape(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function footerLinkedCsv(text) {
  return String(text || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      const safe = footerEscape(item);
      return `<a class="footer-third__chip" href="home.html?q=${encodeURIComponent(item)}">${safe}</a>`;
    })
    .join(", ");
}

function footerPlainParagraphs(text) {
  const safe = footerEscape(text).replace(/\n+/g, "</p><p>");
  return safe ? `<p>${safe}</p>` : "";
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const year = new Date().getFullYear();
  const f = footerSettings();
  const bn = getLang() === "bn";
  const intlTitle = bn ? f.internationalTitleBn || f.internationalTitle : f.internationalTitle;
  const followTitle = bn ? f.followTitleBn || f.followTitle : f.followTitle;
  const copyrightName = f.copyrightName || siteName();
  const countries = Array.isArray(f.countries) ? f.countries : [];
  const socials = Array.isArray(f.socials) ? f.socials : [];
  const third = f.third || defaultFooterThird();
  const second = f.second || defaultFooterSecond();
  const first = f.first || defaultFooterFirst();

  const countryHtml = countries
    .map((c) => {
      const name = bn ? c.nameBn || c.name : c.name;
      const href = c.href || "#";
      const external = /^https?:\/\//i.test(href);
      return `<a class="footer-country" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <img class="footer-country__flag" src="${countryFlagUrl(c)}" alt="" width="20" height="20" loading="lazy" />
        <span>${footerEscape(name || "")}</span>
      </a>`;
    })
    .join("");

  const socialHtml = socials
    .map((s) => {
      const network = (s.network || "facebook").toLowerCase();
      const href = s.href || "#";
      const external = /^https?:\/\//i.test(href);
      return `<a class="footer-social" href="${href}" aria-label="${network}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${socialIconSvg(network)}</a>`;
    })
    .join("");

  const introTitle = bn ? third.introTitleBn || third.introTitle : third.introTitle;
  const introBody = bn ? third.introHtmlBn || third.introHtml : third.introHtml;
  const moreBody = bn ? third.moreHtmlBn || third.moreHtml : third.moreHtml;
  const trendingTitle = bn ? third.trendingTitleBn || third.trendingTitle : third.trendingTitle;
  const categoriesTitle = bn ? third.categoriesTitleBn || third.categoriesTitle : third.categoriesTitle;
  const bestsellersTitle = bn ? third.bestsellersTitleBn || third.bestsellersTitle : third.bestsellersTitle;
  const trending = Array.isArray(third.trending) ? third.trending : [];
  const categoryGroups = Array.isArray(third.categoryGroups) ? third.categoryGroups : [];

  const trendingHtml = trending
    .map((item) => {
      const label = footerEscape(item.label || "");
      const href = item.href || `home.html?q=${encodeURIComponent(item.label || "")}`;
      return `<a class="footer-third__trend" href="${href}">${label}</a>`;
    })
    .join("");

  const categoryHtml = categoryGroups
    .map((group) => {
      const title = footerEscape(group.title || "");
      return `<div class="footer-third__group">
        <h5 class="footer-third__group-title">${title}</h5>
        <p class="footer-third__group-items">${footerLinkedCsv(group.items || "")}</p>
      </div>`;
    })
    .join("");

  const paymentHtml = (Array.isArray(second.payments) ? second.payments : [])
    .map((p) => {
      if (!p.imageUrl) return "";
      return `<img class="footer-pay__logo" src="${footerEscape(p.imageUrl)}" alt="${footerEscape(p.label || "")}" loading="lazy" />`;
    })
    .join("");

  const verifiedHtml = (Array.isArray(second.verified) ? second.verified : [])
    .map((v) => {
      if (!v.imageUrl) return "";
      return `<img class="footer-verify__logo" src="${footerEscape(v.imageUrl)}" alt="${footerEscape(v.label || "")}" loading="lazy" />`;
    })
    .join("");

  const payTitle = bn ? second.paymentTitleBn || second.paymentTitle : second.paymentTitle;
  const verifiedTitle = bn ? second.verifiedTitleBn || second.verifiedTitle : second.verifiedTitle;
  const dbidTitle = second.dbidTitle || "DBID";
  const dbidLabel = bn ? second.dbidLabelBn || second.dbidLabel : second.dbidLabel;

  function footerLinkList(links) {
    return (Array.isArray(links) ? links : [])
      .map((link) => {
        const label = bn ? link.labelBn || link.label : link.label;
        const href = link.href || "#";
        return `<a class="footer-first__link" href="${footerEscape(href)}">${footerEscape(label || "")}</a>`;
      })
      .join("");
  }

  const customerTitle = bn ? first.customerTitleBn || first.customerTitle : first.customerTitle;
  const companyTitle = bn ? first.companyTitleBn || first.companyTitle : first.companyTitle;
  const happyText = bn ? first.happyTextBn || first.happyText : first.happyText;
  const downloadText = bn ? first.downloadTextBn || first.downloadText : first.downloadText;
  const appButtonsHtml = (Array.isArray(first.appButtons) ? first.appButtons : [])
    .map((btn) => {
      if (!btn.imageUrl) return "";
      const href = btn.href || "#";
      const external = /^https?:\/\//i.test(href);
      return `<a class="footer-app-btn" href="${footerEscape(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <img src="${footerEscape(btn.imageUrl)}" alt="${footerEscape(btn.label || "App")}" loading="lazy" />
      </a>`;
    })
    .join("");

  el.innerHTML = `
    <div class="footer-first">
      <div class="container lzd-footer-inner footer-first__inner">
        <div class="footer-first__col">
          <h4 class="footer-first__title">${footerEscape(customerTitle || "Customer Care")}</h4>
          <div class="footer-first__links">${footerLinkList(first.customerLinks)}</div>
        </div>
        <div class="footer-first__col">
          <h4 class="footer-first__title">${footerEscape(companyTitle || "Daraz")}</h4>
          <div class="footer-first__links footer-first__links--cols">${footerLinkList(first.companyLinks)}</div>
        </div>
        <div class="footer-first__col footer-first__col--promo">
          <div class="footer-app-promo">
            <img class="footer-app-promo__icon" src="${footerEscape(first.appIconUrl || "/assets/payments/app-icon.svg")}" alt="" width="48" height="48" loading="lazy" />
            <div>
              <p class="footer-app-promo__happy">${footerEscape(happyText || "Happy Shopping")}</p>
              <p class="footer-app-promo__download">${footerEscape(downloadText || "Download App")}</p>
            </div>
          </div>
        </div>
        <div class="footer-first__col footer-first__col--stores">
          <div class="footer-app-stores">${appButtonsHtml}</div>
        </div>
      </div>
    </div>
    <div class="footer-second">
      <div class="container footer-second__row">
        <div class="footer-second__col footer-second__col--pay">
          <h4 class="footer-second__title">${footerEscape(payTitle || "Payment Methods")}</h4>
          <div class="footer-pay__logos">${paymentHtml}</div>
        </div>
        <div class="footer-second__col footer-second__col--verify">
          <h4 class="footer-second__title">${footerEscape(verifiedTitle || "Verified by")}</h4>
          <div class="footer-verify__logos">${verifiedHtml}</div>
        </div>
        <div class="footer-second__col footer-second__col--dbid">
          <h4 class="footer-second__title">${footerEscape(dbidTitle)}</h4>
          <p class="footer-dbid__text">${footerEscape(dbidLabel || "Registration ID :")} <span>${footerEscape(second.dbidValue || "")}</span></p>
        </div>
      </div>
    </div>
    <div class="footer-third">
      <div class="container footer-third__grid">
        <div class="footer-third__col footer-third__col--intro">
          <h3 class="footer-third__heading">${footerEscape(introTitle || "")}</h3>
          <div class="footer-third__text">${footerPlainParagraphs(introBody)}</div>
        </div>
        <div class="footer-third__col footer-third__col--more">
          <div class="footer-third__text">${footerPlainParagraphs(moreBody)}</div>
          <h4 class="footer-third__subhead">${footerEscape(trendingTitle || "Trending")}</h4>
          <div class="footer-third__trending">${trendingHtml}</div>
        </div>
        <div class="footer-third__col footer-third__col--cats">
          <h4 class="footer-third__subhead">${footerEscape(categoriesTitle || "")}</h4>
          ${categoryHtml}
        </div>
        <div class="footer-third__col footer-third__col--best">
          <h4 class="footer-third__subhead footer-third__subhead--caps">${footerEscape(bestsellersTitle || "")}</h4>
          <p class="footer-third__bestsellers">${footerLinkedCsv(third.bestsellers || "")}</p>
        </div>
      </div>
    </div>
    <div class="footer-fourth">
      <div class="container footer-fourth__row">
        <div class="footer-intl">
          <h4 class="footer-fourth__title">${footerEscape(intlTitle || "")}</h4>
          <div class="footer-intl__list">${countryHtml}</div>
        </div>
        <div class="footer-follow">
          <h4 class="footer-fourth__title">${footerEscape(followTitle || "")}</h4>
          <div class="footer-follow__list">${socialHtml}</div>
        </div>
      </div>
      <div class="container footer-fourth__copy">
        <p>&copy; ${footerEscape(copyrightName)} ${year}</p>
      </div>
    </div>
  `;
}

function renderWhatsApp() {
  const el = document.getElementById("whatsapp-float");
  if (!el) return;
  el.innerHTML = `
    <a class="wa-btn" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" aria-label="${t("whatsapp.label")}">
      <span class="wa-btn__pulse" aria-hidden="true"></span>
      <svg class="wa-btn__icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path fill="currentColor" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 2.08.62 4.02 1.7 5.64L2 22l4.7-1.55a9.86 9.86 0 0 0 5.34 1.55c5.46 0 9.89-4.4 9.89-9.84C21.93 6.4 17.5 2 12.04 2zm5.74 13.95c-.24.67-1.4 1.24-1.93 1.32-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.78-4.17-4.93-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36h.55c.17 0 .4-.06.63.48.24.55.8 1.9.87 2.04.07.14.12.3.02.49-.1.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.9 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.17-.2.7-.81.88-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.32.07.12.07.67-.17 1.34z"/>
      </svg>
    </a>
  `;
}

function refreshCategoryLabels() {
  document.querySelectorAll(".mega-menu__item").forEach((a, i) => {
    if (CATEGORIES[i]) a.textContent = categoryLabel(CATEGORIES[i]);
  });
}

let layoutBooted = false;

function bootLayout(force) {
  if (layoutBooted && !force) {
    if (typeof renderSearchPage === "function" && document.getElementById("search-results")) {
      renderSearchPage();
    }
    return;
  }
  layoutBooted = true;

  renderHeader();
  renderNav();
  renderFooter();
  renderWhatsApp();
  if (typeof renderLandingIntro === "function") renderLandingIntro();
  if (typeof renderPromoBanner === "function") renderPromoBanner();
  if (typeof renderFlashSale === "function") renderFlashSale();
  if (typeof initHomeSections === "function") initHomeSections();
  if (typeof renderSearchPage === "function" && document.getElementById("search-results")) {
    renderSearchPage();
  }
  applyI18n();
  updateCartBadge();
}

function startLayout() {
  if (STORE) bootLayout();
  else document.addEventListener("storeReady", bootLayout, { once: true });
}

function initLayout() {
  startLayout();

  document.addEventListener("langchange", () => {
    renderHeader();
    renderNav();
    renderFooter();
    renderWhatsApp();
    if (typeof renderLandingIntro === "function") renderLandingIntro();
    applyI18n();
    refreshCategoryLabels();
  });

  document.addEventListener("userchange", () => {
    renderHeader();
    applyI18n();
    updateCartBadge();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLayout);
} else {
  initLayout();
}
