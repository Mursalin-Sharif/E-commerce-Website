const TOKEN_KEY = "ecom_admin_token";
let store = null;
let panel = "settings";

const els = {
  loginScreen: document.getElementById("login-screen"),
  adminApp: document.getElementById("admin-app"),
  loginForm: document.getElementById("login-form"),
  loginPassword: document.getElementById("login-password"),
  loginError: document.getElementById("login-error"),
  panelContent: document.getElementById("panel-content"),
  panelTitle: document.getElementById("panel-title"),
  saveStatus: document.getElementById("save-status"),
  saveAllBtn: document.getElementById("save-all-btn"),
  logoutBtn: document.getElementById("logout-btn"),
};

function token() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(value) {
  if (value) localStorage.setItem(TOKEN_KEY, value);
  else localStorage.removeItem(TOKEN_KEY);
}

async function apiLogin(password) {
  let res;
  try {
    res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  } catch {
    throw new Error("Server not running. Use: npm start");
  }
  if (res.status === 404) throw new Error("API missing. Stop Python server and run: npm start");
  if (!res.ok) throw new Error("Invalid password");
  const data = await res.json();
  if (!data.token) throw new Error("Login failed — no token");
  setToken(data.token);
}

async function loadStore() {
  let res;
  try {
    res = await fetch("/api/store");
  } catch {
    throw new Error("Cannot reach API. Run: npm start");
  }
  if (!res.ok) throw new Error("Failed to load store (run npm start)");
  store = await res.json();
}

async function saveStore() {
  const res = await fetch("/api/store", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(store),
  });
  if (res.status === 401) {
    setToken(null);
    showApp(false);
    throw new Error("Session expired. Login again with admin123.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Save failed (${res.status})`);
  }
  els.saveStatus.textContent = "Saved successfully!";
  els.saveStatus.style.color = "";
  setTimeout(() => { els.saveStatus.textContent = ""; }, 2500);
}

function uid(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function showApp(show) {
  els.loginScreen.hidden = show;
  els.adminApp.hidden = !show;
}

const PANELS = {
  settings: { title: "Site Settings", render: renderSettings },
  landing: { title: "Landing Page", render: renderLandingAdmin },
  header: { title: "Header (Logo & Links)", render: renderHeaderAdmin },
  footer: { title: "Footer (Payments & SEO)", render: renderFooterAdmin },
  categories: { title: "Categories", render: renderCategories },
  products: { title: "Products", render: renderProducts },
  banners: { title: "Promo Banners", render: renderBanners },
  flash: { title: "Flash Sale", render: renderFlash },
  home: { title: "Homepage Layout", render: renderHome },
  search: { title: "Search Page", render: renderSearchAdmin },
  reviews: { title: "Reviews", render: renderReviews },
};

function renderPanel() {
  const cfg = PANELS[panel];
  els.panelTitle.textContent = cfg.title;
  cfg.render();
}

function renderSettings() {
  const s = store.settings;
  els.panelContent.innerHTML = `
    <div class="form-grid">
      <label>Site name (EN)<input data-k="siteName" value="${esc(s.siteName)}" /></label>
      <label>Site name (BN)<input data-k="siteNameBn" value="${esc(s.siteNameBn)}" /></label>
      <label>WhatsApp number<input data-k="whatsapp" value="${esc(s.whatsapp)}" /></label>
      <label>Search placeholder (EN)<input data-k="searchPlaceholder" value="${esc(s.searchPlaceholder)}" /></label>
      <label>Search placeholder (BN)<input data-k="searchPlaceholderBn" value="${esc(s.searchPlaceholderBn)}" /></label>
      <label>Default location (EN)<input data-k="defaultLocation" value="${esc(s.defaultLocation || "Dhaka")}" /></label>
      <label>Default location (BN)<input data-k="defaultLocationBn" value="${esc(s.defaultLocationBn || "ঢাকা")}" /></label>
    </div>
  `;
  els.panelContent.querySelectorAll("[data-k]").forEach((input) => {
    input.addEventListener("input", () => { store.settings[input.dataset.k] = input.value; });
  });
}

function ensureLandingSettings() {
  if (!store.settings) store.settings = {};
  if (!store.settings.landing || typeof store.settings.landing !== "object") {
    store.settings.landing = {
      enabled: true,
      brand: "IOTPROGRAMMERS",
      brandBn: "IOTPROGRAMMERS",
      headline: "বাংলাদেশি ব্যবসার জন্য প্রফেশনাল MERN পোর্টফোলিও ও ডেমো ওয়েবসাইট",
      headlineEn: "Professional MERN portfolio & demo websites for Bangladeshi businesses",
      body: "ল্যান্ডিং পেজ, লাইভ ডেমো কার্ড, ক্লায়েন্ট রিভিউ, ইমেজ-ভিডিও গ্যালারি ও WhatsApp লিড বাটন—সবকিছু অ্যাডমিন ড্যাশবোর্ড থেকে কন্ট্রোল করুন।",
      bodyEn: "Landing page, live demo cards, client reviews, image-video gallery and WhatsApp lead button—control everything from the admin dashboard.",
      videoUrl: "https://www.youtube.com/watch?v=IltsOcCj1Ak",
      videoFileUrl: "",
      posterImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
      ctaText: "Shop the store",
      ctaTextBn: "স্টোরে যান",
      ctaHref: "home.html",
      gallery: [],
      demos: [],
    };
  }
  if (!Array.isArray(store.settings.landing.gallery)) store.settings.landing.gallery = [];
  if (!Array.isArray(store.settings.landing.demos)) store.settings.landing.demos = [];
  if (typeof store.settings.landing.enabled !== "boolean") store.settings.landing.enabled = true;
  if (typeof store.settings.landing.showStoreGrid !== "boolean") store.settings.landing.showStoreGrid = true;
  if (typeof store.settings.landing.showHero !== "boolean") store.settings.landing.showHero = false;
  if (!store.settings.landing.searchQuery) store.settings.landing.searchQuery = "headphone";
  if (!Array.isArray(store.landingProductIds)) store.landingProductIds = [];
  if (!store.settings.landing.demos.length) {
    store.settings.landing.demos = [
      {
        id: uid("demo-"),
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
        title: "ক্লিনিক ও হেলথকেয়ার ডেমো",
        titleEn: "Clinic & Healthcare Demo",
        videoUrl: store.settings.landing.videoUrl || "",
        adminUser: "clinic-admin",
        adminPass: "secure-demo",
        liveDemoUrl: "home.html",
        liveDemoText: "লাইভ ডেমো দেখুন",
        liveDemoTextEn: "View live demo",
        waText: "৫ মিনিট ফ্রি WhatsApp কল — এখনই কথা বলুন",
        waTextEn: "5-min free WhatsApp call — talk now",
        waMessage: "Hi, I want a free call about the Clinic demo.",
        active: true,
      },
      {
        id: uid("demo-"),
        imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80",
        title: "ই-কমার্স স্টোর ডেমো",
        titleEn: "E-commerce Store Demo",
        videoUrl: store.settings.landing.videoUrl || "",
        adminUser: "store-admin",
        adminPass: "store-pass",
        liveDemoUrl: "home.html",
        liveDemoText: "লাইভ ডেমো দেখুন",
        liveDemoTextEn: "View live demo",
        waText: "৫ মিনিট ফ্রি WhatsApp কল — এখনই কথা বলুন",
        waTextEn: "5-min free WhatsApp call — talk now",
        waMessage: "Hi, I want a free call about the Store demo.",
        active: true,
      },
    ];
  }
}

function renderLandingAdmin() {
  ensureLandingSettings();
  const L = store.settings.landing;

  els.panelContent.innerHTML = `
    <p class="header-admin__hint">Landing store grid + optional hero (<a href="/index.html" target="_blank">open landing</a>). Save store when done.</p>

    <h3 class="header-admin__title">Store grid (Daraz-style)</h3>
    <p style="margin:0 0 0.75rem;color:#757575;font-size:0.88rem">Main landing product list — click any product opens full detail page. Leave products empty to auto-search by keyword.</p>
    <label style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;font-weight:600">
      <input type="checkbox" id="landing-store-grid" ${L.showStoreGrid !== false ? "checked" : ""} /> Show product grid on landing
    </label>
    <div class="form-grid" style="margin-bottom:0.75rem">
      <label>Default search keyword<input id="landing-search-query" value="${esc(L.searchQuery || "headphone")}" placeholder="headphone" /></label>
      <label>Result title (shown when no ?q= in URL)<input id="landing-result-title" value="${esc(L.resultTitle || L.searchQuery || "headphone")}" /></label>
    </div>
    <div class="panel-toolbar">
      <span id="landing-prod-count"></span>
      <button type="button" id="landing-prod-select-all">Select all</button>
      <button type="button" id="landing-prod-clear">Clear (use keyword search)</button>
    </div>
    <div class="check-grid" id="landing-prod-checks" style="margin-bottom:1.25rem"></div>

    <hr />
    <h3 class="header-admin__title">Optional hero video</h3>
    <label style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;font-weight:600">
      <input type="checkbox" id="landing-show-hero" ${L.showHero ? "checked" : ""} /> Show hero video above products
    </label>
    <label style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;font-weight:600">
      <input type="checkbox" id="landing-enabled" ${L.enabled !== false ? "checked" : ""} /> Hero section enabled
    </label>
    <div class="form-grid" style="margin-bottom:1rem">
      <label>Brand eyebrow (EN)<input data-lk="brand" value="${esc(L.brand || "")}" /></label>
      <label>Brand eyebrow (BN)<input data-lk="brandBn" value="${esc(L.brandBn || "")}" /></label>
      <label>Headline (BN)<textarea data-lk="headline" rows="3">${esc(L.headline || "")}</textarea></label>
      <label>Headline (EN)<textarea data-lk="headlineEn" rows="3">${esc(L.headlineEn || "")}</textarea></label>
      <label>Body (BN)<textarea data-lk="body" rows="4">${esc(L.body || "")}</textarea></label>
      <label>Body (EN)<textarea data-lk="bodyEn" rows="4">${esc(L.bodyEn || "")}</textarea></label>
      <label>YouTube URL (hero)<input data-lk="videoUrl" value="${esc(L.videoUrl || "")}" placeholder="https://www.youtube.com/watch?v=..." /></label>
      <label>CTA text (EN)<input data-lk="ctaText" value="${esc(L.ctaText || "")}" /></label>
      <label>CTA text (BN)<input data-lk="ctaTextBn" value="${esc(L.ctaTextBn || "")}" /></label>
      <label>CTA link<input data-lk="ctaHref" value="${esc(L.ctaHref || "home.html")}" /></label>
    </div>

    <h3 class="header-admin__title">Hero video file (optional)</h3>
    <div class="logo-admin-item" style="margin-bottom:1.25rem">
      <div class="logo-admin-item__preview" style="min-height:72px">
        ${L.videoFileUrl ? `<span style="font-size:0.8rem;word-break:break-all;padding:0.35rem">${esc(L.videoFileUrl)}</span>` : `<span>No uploaded video</span>`}
      </div>
      <div class="logo-admin-item__fields">
        <div class="logo-upload__actions">
          <label class="btn-file">
            Upload video
            <input type="file" id="landing-video-file" accept="video/mp4,video/webm,video/*" hidden />
          </label>
          <button type="button" class="danger" id="landing-video-delete" ${L.videoFileUrl ? "" : "disabled"}>Delete video</button>
        </div>
      </div>
    </div>

    <h3 class="header-admin__title">Poster image</h3>
    <div class="logo-admin-item" style="margin-bottom:1.25rem">
      <div class="logo-admin-item__preview">
        ${L.posterImage ? `<img src="${esc(L.posterImage)}" alt="" />` : `<span>No poster</span>`}
      </div>
      <div class="logo-admin-item__fields">
        <div class="logo-upload__actions">
          <label class="btn-file">
            Upload poster
            <input type="file" id="landing-poster-file" accept="image/*" hidden />
          </label>
          <button type="button" class="danger" id="landing-poster-delete" ${L.posterImage ? "" : "disabled"}>Delete poster</button>
        </div>
      </div>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Demo showcase cards</h3>
      <button type="button" id="add-landing-demo">+ Add demo</button>
    </div>
    <div id="landing-demo-list"></div>

    <div class="panel-toolbar" style="margin-top:1.25rem">
      <h3 class="header-admin__title" style="margin:0">Gallery images</h3>
      <button type="button" id="add-landing-gallery">+ Add image</button>
    </div>
    <div id="landing-gallery-list" class="logo-admin-list"></div>
  `;

  document.getElementById("landing-enabled").addEventListener("change", (e) => {
    store.settings.landing.enabled = e.target.checked;
  });
  document.getElementById("landing-show-hero").addEventListener("change", (e) => {
    store.settings.landing.showHero = e.target.checked;
  });
  document.getElementById("landing-store-grid").addEventListener("change", (e) => {
    store.settings.landing.showStoreGrid = e.target.checked;
  });
  document.getElementById("landing-search-query").addEventListener("input", (e) => {
    store.settings.landing.searchQuery = e.target.value;
  });
  document.getElementById("landing-result-title").addEventListener("input", (e) => {
    store.settings.landing.resultTitle = e.target.value;
  });

  const landingCount = document.getElementById("landing-prod-count");
  function refreshLandingCount() {
    if (landingCount) landingCount.textContent = `${store.landingProductIds.length} landing products`;
  }
  document.getElementById("landing-prod-checks").innerHTML = store.products
    .filter((p) => p.active !== false)
    .map(
      (p) =>
        `<label><input type="checkbox" value="${esc(p.id)}" ${store.landingProductIds.includes(p.id) ? "checked" : ""} /> ${esc(p.name)}</label>`
    )
    .join("");
  document.getElementById("landing-prod-checks").querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        if (!store.landingProductIds.includes(input.value)) store.landingProductIds.push(input.value);
      } else {
        store.landingProductIds = store.landingProductIds.filter((id) => id !== input.value);
      }
      refreshLandingCount();
    });
  });
  refreshLandingCount();
  document.getElementById("landing-prod-select-all").addEventListener("click", () => {
    store.landingProductIds = store.products.filter((p) => p.active !== false).map((p) => p.id);
    renderLandingAdmin();
  });
  document.getElementById("landing-prod-clear").addEventListener("click", () => {
    store.landingProductIds = [];
    renderLandingAdmin();
  });
  els.panelContent.querySelectorAll("[data-lk]").forEach((input) => {
    input.addEventListener("input", () => {
      store.settings.landing[input.dataset.lk] = input.value;
    });
  });

  document.getElementById("landing-video-file").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const oldUrl = store.settings.landing.videoFileUrl;
      const url = await uploadLogoFile(file);
      store.settings.landing.videoFileUrl = url;
      await saveStore();
      if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
      renderLandingAdmin();
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  });
  document.getElementById("landing-video-delete").addEventListener("click", async () => {
    const oldUrl = store.settings.landing.videoFileUrl;
    store.settings.landing.videoFileUrl = "";
    try {
      await saveStore();
      if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
      renderLandingAdmin();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  });

  document.getElementById("landing-poster-file").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const oldUrl = store.settings.landing.posterImage;
      const url = await uploadLogoFile(file);
      store.settings.landing.posterImage = url;
      await saveStore();
      if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
      renderLandingAdmin();
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  });
  document.getElementById("landing-poster-delete").addEventListener("click", async () => {
    const oldUrl = store.settings.landing.posterImage;
    store.settings.landing.posterImage = "";
    try {
      await saveStore();
      if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
      renderLandingAdmin();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  });

  const demoList = document.getElementById("landing-demo-list");
  function drawDemos() {
    demoList.innerHTML = store.settings.landing.demos
      .map(
        (d, i) => `
      <div class="form-grid" style="margin-bottom:0.85rem;padding:0.85rem;border:1px solid #e8e8e8;border-radius:8px">
        <label style="display:flex;align-items:center;gap:0.4rem;grid-column:1/-1">
          <input type="checkbox" data-di="${i}" data-df="active" ${d.active !== false ? "checked" : ""} /> Active
        </label>
        <label>Title BN<input data-di="${i}" data-df="title" value="${esc(d.title || "")}" /></label>
        <label>Title EN<input data-di="${i}" data-df="titleEn" value="${esc(d.titleEn || "")}" /></label>
        <label>Admin user<input data-di="${i}" data-df="adminUser" value="${esc(d.adminUser || "")}" /></label>
        <label>Admin password<input data-di="${i}" data-df="adminPass" value="${esc(d.adminPass || "")}" /></label>
        <label>YouTube / video URL<input data-di="${i}" data-df="videoUrl" value="${esc(d.videoUrl || "")}" /></label>
        <label>Live demo URL<input data-di="${i}" data-df="liveDemoUrl" value="${esc(d.liveDemoUrl || "")}" /></label>
        <label>Live button BN<input data-di="${i}" data-df="liveDemoText" value="${esc(d.liveDemoText || "")}" /></label>
        <label>Live button EN<input data-di="${i}" data-df="liveDemoTextEn" value="${esc(d.liveDemoTextEn || "")}" /></label>
        <label>WhatsApp button BN<input data-di="${i}" data-df="waText" value="${esc(d.waText || "")}" /></label>
        <label>WhatsApp button EN<input data-di="${i}" data-df="waTextEn" value="${esc(d.waTextEn || "")}" /></label>
        <label style="grid-column:1/-1">WhatsApp message<textarea data-di="${i}" data-df="waMessage" rows="2">${esc(d.waMessage || "")}</textarea></label>
        <label style="grid-column:1/-1">Image URL<input data-di="${i}" data-df="imageUrl" value="${esc(d.imageUrl || "")}" /></label>
        <div class="logo-admin-item" style="grid-column:1/-1">
          <div class="logo-admin-item__preview">${d.imageUrl ? `<img src="${esc(d.imageUrl)}" alt="" />` : `<span>No image</span>`}</div>
          <div class="logo-admin-item__fields">
            <div class="logo-upload__actions">
              <label class="btn-file">Upload image<input type="file" accept="image/*" data-demo-upload="${i}" hidden /></label>
              <button type="button" class="danger" data-demo-del="${i}">Delete demo</button>
            </div>
          </div>
        </div>
      </div>`
      )
      .join("");

    demoList.querySelectorAll("input[data-df], textarea[data-df]").forEach((el) => {
      const apply = () => {
        const i = Number(el.dataset.di);
        const f = el.dataset.df;
        store.settings.landing.demos[i][f] = el.type === "checkbox" ? el.checked : el.value;
      };
      el.addEventListener("input", apply);
      el.addEventListener("change", apply);
    });
    demoList.querySelectorAll("[data-demo-upload]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const idx = Number(input.dataset.demoUpload);
        try {
          const oldUrl = store.settings.landing.demos[idx].imageUrl;
          const url = await uploadLogoFile(file);
          store.settings.landing.demos[idx].imageUrl = url;
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
          drawDemos();
        } catch (err) {
          alert(err.message || "Upload failed");
        } finally {
          input.value = "";
        }
      });
    });
    demoList.querySelectorAll("[data-demo-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.demoDel);
        const oldUrl = store.settings.landing.demos[idx].imageUrl;
        store.settings.landing.demos.splice(idx, 1);
        drawDemos();
        try {
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
        } catch (err) {
          alert(err.message || "Delete failed");
        }
      });
    });
  }
  drawDemos();
  document.getElementById("add-landing-demo").addEventListener("click", () => {
    store.settings.landing.demos.push({
      id: uid("demo-"),
      imageUrl: "",
      title: "নতুন ডেমো",
      titleEn: "New demo",
      videoUrl: "",
      adminUser: "demo-admin",
      adminPass: "demo-pass",
      liveDemoUrl: "home.html",
      liveDemoText: "লাইভ ডেমো দেখুন",
      liveDemoTextEn: "View live demo",
      waText: "৫ মিনিট ফ্রি WhatsApp কল — এখনই কথা বলুন",
      waTextEn: "5-min free WhatsApp call — talk now",
      waMessage: "Hi, I want a demo call.",
      active: true,
    });
    drawDemos();
  });

  const gal = document.getElementById("landing-gallery-list");
  function drawGallery() {
    gal.innerHTML = store.settings.landing.gallery.map((item, i) => `
      <div class="logo-admin-item">
        <div class="logo-admin-item__preview">
          ${item.imageUrl ? `<img src="${esc(item.imageUrl)}" alt="" />` : `<span>No image</span>`}
        </div>
        <div class="logo-admin-item__fields">
          <input value="${esc(item.caption || "")}" data-i="${i}" data-f="caption" placeholder="Caption (optional)" />
          <div class="logo-upload__actions">
            <label class="btn-file">
              Upload
              <input type="file" accept="image/*" data-upload="${i}" hidden />
            </label>
            <button type="button" class="danger" data-del="${i}">Delete</button>
          </div>
        </div>
      </div>`).join("");

    gal.querySelectorAll("input[data-f]").forEach((input) => {
      input.addEventListener("input", () => {
        store.settings.landing.gallery[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    gal.querySelectorAll("input[data-upload]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const idx = Number(input.dataset.upload);
        try {
          const oldUrl = store.settings.landing.gallery[idx].imageUrl;
          const url = await uploadLogoFile(file);
          store.settings.landing.gallery[idx].imageUrl = url;
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
          drawGallery();
        } catch (err) {
          alert(err.message || "Upload failed");
        } finally {
          input.value = "";
        }
      });
    });
    gal.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.del);
        const oldUrl = store.settings.landing.gallery[idx].imageUrl;
        store.settings.landing.gallery.splice(idx, 1);
        drawGallery();
        try {
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
        } catch (err) {
          alert(err.message || "Delete failed");
        }
      });
    });
  }
  drawGallery();
  document.getElementById("add-landing-gallery").addEventListener("click", () => {
    store.settings.landing.gallery.push({ id: uid("lg-"), imageUrl: "", caption: "" });
    drawGallery();
  });
}

function ensureHeaderSettings() {
  if (!store.settings) store.settings = {};
  if (!Array.isArray(store.settings.headerLinks)) {
    store.settings.headerLinks = [
      { id: "save-app", label: "SAVE MORE ON APP", labelBn: "অ্যাপে আরও সাশ্রয়", href: "help.html" },
      { id: "seller", label: "BECOME A SELLER", labelBn: "সেলার হোন", href: "services.html" },
      { id: "help", label: "HELP & SUPPORT", labelBn: "হেল্প ও সাপোর্ট", href: "help.html" },
    ];
  }
  if (typeof store.settings.logoUrl !== "string") store.settings.logoUrl = "";
}

async function uploadLogoFile(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify({ data: dataUrl, filename: file.name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }
  return (await res.json()).url;
}

async function deleteUploadedFile(url) {
  if (!url || !url.startsWith("/uploads/")) return;
  await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify({ url }),
  });
}

function renderHeaderAdmin() {
  ensureHeaderSettings();
  const s = store.settings;
  const logo = s.logoUrl || "";

  els.panelContent.innerHTML = `
    <section class="header-admin">
      <h3 class="header-admin__title">Logo</h3>
      <p class="header-admin__hint">Upload a logo for the orange header (PNG / JPG / WebP / SVG). Delete to show the text brand mark again.</p>
      <div class="logo-upload">
        <div class="logo-upload__preview" id="logo-preview">
          ${logo
            ? `<img src="${esc(logo)}" alt="Logo preview" />`
            : `<div class="logo-upload__empty">No logo — text brand will show</div>`}
        </div>
        <div class="logo-upload__actions">
          <label class="btn-file">
            Upload logo
            <input type="file" id="logo-file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" hidden />
          </label>
          <button type="button" class="danger" id="logo-delete" ${logo ? "" : "disabled"}>Delete logo</button>
        </div>
        <p class="header-admin__status" id="logo-status"></p>
      </div>
    </section>

    <section class="header-admin" style="margin-top:1.5rem">
      <div class="panel-toolbar">
        <h3 class="header-admin__title" style="margin:0">Top bar links</h3>
        <button type="button" id="add-header-link">+ Add link</button>
      </div>
      <p class="header-admin__hint">These appear as SAVE MORE ON APP / BECOME A SELLER style links (right side). LOGIN / SIGN UP stay automatic.</p>
      <div class="table-wrap">
        <table class="admin-table">
          <thead>
            <tr><th>Label EN</th><th>Label BN</th><th>Link URL</th><th></th></tr>
          </thead>
          <tbody id="header-link-rows"></tbody>
        </table>
      </div>
    </section>
  `;

  const statusEl = document.getElementById("logo-status");
  const fileInput = document.getElementById("logo-file");
  const deleteBtn = document.getElementById("logo-delete");

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    statusEl.textContent = "Uploading…";
    statusEl.style.color = "#757575";
    try {
      const oldUrl = store.settings.logoUrl;
      const url = await uploadLogoFile(file);
      store.settings.logoUrl = url;
      await saveStore();
      if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) {
        await deleteUploadedFile(oldUrl);
      }
      statusEl.textContent = "Logo uploaded & saved.";
      statusEl.style.color = "#2e7d32";
      renderHeaderAdmin();
    } catch (err) {
      statusEl.textContent = err.message || "Upload failed";
      statusEl.style.color = "#c62828";
    } finally {
      fileInput.value = "";
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const oldUrl = store.settings.logoUrl;
    if (!oldUrl) return;
    statusEl.textContent = "Deleting…";
    try {
      store.settings.logoUrl = "";
      await saveStore();
      await deleteUploadedFile(oldUrl);
      statusEl.textContent = "Logo deleted.";
      statusEl.style.color = "#2e7d32";
      renderHeaderAdmin();
    } catch (err) {
      statusEl.textContent = err.message || "Delete failed";
      statusEl.style.color = "#c62828";
    }
  });

  const tbody = document.getElementById("header-link-rows");
  function drawLinks() {
    tbody.innerHTML = store.settings.headerLinks.map((link, i) => `
      <tr>
        <td><input value="${esc(link.label)}" data-i="${i}" data-f="label" /></td>
        <td><input value="${esc(link.labelBn || "")}" data-i="${i}" data-f="labelBn" /></td>
        <td><input value="${esc(link.href || "")}" data-i="${i}" data-f="href" placeholder="help.html" /></td>
        <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
      </tr>`).join("");

    tbody.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        store.settings.headerLinks[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    tbody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.settings.headerLinks.splice(Number(btn.dataset.del), 1);
        drawLinks();
      });
    });
  }
  drawLinks();

  document.getElementById("add-header-link").addEventListener("click", () => {
    store.settings.headerLinks.push({
      id: uid("link-"),
      label: "NEW LINK",
      labelBn: "নতুন লিংক",
      href: "#",
    });
    drawLinks();
  });
}

function ensureFooterSettings() {
  if (!store.settings) store.settings = {};
  const defaults = {
    internationalTitle: "Daraz International",
    internationalTitleBn: "দারাজ আন্তর্জাতিক",
    followTitle: "Follow Us",
    followTitleBn: "ফলো করুন",
    copyrightName: "Daraz",
    countries: [
      { id: "pk", name: "Pakistan", nameBn: "পাকিস্তান", flagCode: "pk", href: "https://www.daraz.pk" },
      { id: "bd", name: "Bangladesh", nameBn: "বাংলাদেশ", flagCode: "bd", href: "https://www.daraz.com.bd" },
      { id: "lk", name: "Sri Lanka", nameBn: "শ্রীলঙ্কা", flagCode: "lk", href: "https://www.daraz.lk" },
      { id: "mm", name: "Myanmar", nameBn: "মিয়ানমার", flagCode: "mm", href: "https://www.shop.com.mm" },
      { id: "np", name: "Nepal", nameBn: "নেপাল", flagCode: "np", href: "https://www.daraz.com.np" },
    ],
    socials: [
      { id: "facebook", network: "facebook", href: "https://www.facebook.com/" },
      { id: "youtube", network: "youtube", href: "https://www.youtube.com/" },
      { id: "twitter", network: "twitter", href: "https://twitter.com/" },
      { id: "instagram", network: "instagram", href: "https://www.instagram.com/" },
    ],
    third: null,
  };
  if (!store.settings.footer || typeof store.settings.footer !== "object") {
    store.settings.footer = {
      internationalTitle: defaults.internationalTitle,
      internationalTitleBn: defaults.internationalTitleBn,
      followTitle: defaults.followTitle,
      followTitleBn: defaults.followTitleBn,
      copyrightName: defaults.copyrightName,
      countries: defaults.countries,
      socials: defaults.socials,
      third: null,
    };
  }
  const f = store.settings.footer;
  Object.keys(defaults).forEach((k) => {
    if (k === "third") return;
    if (f[k] === undefined) f[k] = defaults[k];
  });
  if (!Array.isArray(f.countries)) f.countries = defaults.countries;
  if (!Array.isArray(f.socials)) f.socials = defaults.socials;
  if (!f.third || typeof f.third !== "object") {
    f.third = {
      introTitle: "Experience Personalized Online Shopping in Bangladesh with Daraz.com.bd",
      introTitleBn: "বাংলাদেশে দারাজ.কম.বিডি দিয়ে ব্যক্তিগতকৃত অনলাইন শপিংয়ের অভিজ্ঞতা নিন",
      introHtml: "Online shopping BD has never been easier. Daraz.com.bd is best online shopping store in Bangladesh that features 10+ million products at affordable prices.",
      introHtmlBn: "বাংলাদেশে অনলাইন শপিং এখন আরও সহজ।",
      moreHtml: "Download Daraz app for Android & IOS and enjoy cash on delivery across Bangladesh.",
      moreHtmlBn: "Daraz অ্যাপ ডাউনলোড করুন।",
      trendingTitle: "Trending",
      trendingTitleBn: "ট্রেন্ডিং",
      trending: [
        { label: "Valentine's Day Sale", href: "home.html?q=valentine" },
        { label: "Daraz Flash Sale", href: "home.html?q=flash" },
      ],
      categoriesTitle: "Top Categories & Brands",
      categoriesTitleBn: "টপ ক্যাটাগরি ও ব্র্যান্ড",
      categoryGroups: [
        { title: "MOBILE PHONES", items: "Xiaomi Mobile, Samsung Mobile, Oppo Mobile, Realme Mobile" },
        { title: "LAPTOPS", items: "HP Laptop, Dell Laptop, Asus Laptop, Lenovo Laptop" },
      ],
      bestsellersTitle: "BEST-SELLING PRODUCTS",
      bestsellersTitleBn: "বেস্ট সেলিং প্রোডাক্ট",
      bestsellers: "Samsung Galaxy A04s, Oppo F17, realme 7i, Infinix Hot 30",
    };
  }
  if (!Array.isArray(f.third.trending)) f.third.trending = [];
  if (!Array.isArray(f.third.categoryGroups)) f.third.categoryGroups = [];
  if (!f.second || typeof f.second !== "object") {
    f.second = {
      paymentTitle: "Payment Methods",
      paymentTitleBn: "পেমেন্ট মেথড",
      payments: [
        { id: "cod", label: "Cash on Delivery", imageUrl: "/assets/payments/cod.svg" },
        { id: "visa", label: "Visa", imageUrl: "/assets/payments/visa.svg" },
        { id: "mastercard", label: "Mastercard", imageUrl: "/assets/payments/mastercard.svg" },
        { id: "amex", label: "American Express", imageUrl: "/assets/payments/amex.svg" },
        { id: "emi", label: "Easy Monthly Installments", imageUrl: "/assets/payments/emi.svg" },
        { id: "bkash", label: "bKash", imageUrl: "/assets/payments/bkash.svg" },
        { id: "nagad", label: "Nagad", imageUrl: "/assets/payments/nagad.svg" },
        { id: "nexus", label: "Nexus", imageUrl: "/assets/payments/nexus.svg" },
        { id: "rocket", label: "Rocket", imageUrl: "/assets/payments/rocket.svg" },
      ],
      verifiedTitle: "Verified by",
      verifiedTitleBn: "ভেরিফাইড বাই",
      verified: [{ id: "pci", label: "PCI DSS Compliant", imageUrl: "/assets/payments/pci.svg" }],
      dbidTitle: "DBID",
      dbidLabel: "Registration ID :",
      dbidLabelBn: "রেজিস্ট্রেশন আইডি :",
      dbidValue: "304903094",
    };
  }
  if (!Array.isArray(f.second.payments)) f.second.payments = [];
  if (!Array.isArray(f.second.verified)) f.second.verified = [];
  if (!f.first || typeof f.first !== "object") {
    f.first = {
      customerTitle: "Customer Care",
      customerTitleBn: "কাস্টমার কেয়ার",
      customerLinks: [
        { label: "Help Center", labelBn: "হেল্প সেন্টার", href: "help.html" },
        { label: "How to Buy", labelBn: "কীভাবে কিনবেন", href: "help.html" },
        { label: "Returns & Refunds", labelBn: "রিটার্ন ও রিফান্ড", href: "help.html" },
        { label: "Contact Us", labelBn: "যোগাযোগ", href: "contact.html" },
        { label: "Terms & Conditions", labelBn: "শর্তাবলি", href: "privacy.html" },
        { label: "CCMS - Central Complain Management System", labelBn: "CCMS", href: "help.html" },
      ],
      companyTitle: "Daraz",
      companyTitleBn: "দারাজ",
      companyLinks: [
        { label: "About Daraz", labelBn: "দারাজ সম্পর্কে", href: "services.html" },
        { label: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", href: "privacy.html" },
        { label: "Sell on Daraz", labelBn: "দারাজে বিক্রি করুন", href: "services.html" },
      ],
      appIconUrl: "/assets/payments/app-icon.svg",
      happyText: "Happy Shopping",
      happyTextBn: "হ্যাপি শপিং",
      downloadText: "Download App",
      downloadTextBn: "অ্যাপ ডাউনলোড",
      appButtons: [
        { id: "ios", label: "App Store", imageUrl: "/assets/payments/appstore.svg", href: "#" },
        { id: "android", label: "Google Play", imageUrl: "/assets/payments/playstore.svg", href: "#" },
        { id: "huawei", label: "AppGallery", imageUrl: "/assets/payments/appgallery.svg", href: "#" },
      ],
    };
  }
  if (!Array.isArray(f.first.customerLinks)) f.first.customerLinks = [];
  if (!Array.isArray(f.first.companyLinks)) f.first.companyLinks = [];
  if (!Array.isArray(f.first.appButtons)) f.first.appButtons = [];
}

function renderFooterAdmin() {
  ensureFooterSettings();
  const f = store.settings.footer;
  const t3 = f.third;
  const s2 = f.second;
  const s1 = f.first;

  els.panelContent.innerHTML = `
    <h3 class="header-admin__title">Top links &amp; app (footer-first)</h3>
    <p class="header-admin__hint">Customer Care, company links, Happy Shopping text, and app store buttons.</p>
    <div class="form-grid" style="margin-bottom:1rem">
      <label>Customer title (EN)<input data-s1="customerTitle" value="${esc(s1.customerTitle || "")}" /></label>
      <label>Customer title (BN)<input data-s1="customerTitleBn" value="${esc(s1.customerTitleBn || "")}" /></label>
      <label>Company title (EN)<input data-s1="companyTitle" value="${esc(s1.companyTitle || "")}" /></label>
      <label>Company title (BN)<input data-s1="companyTitleBn" value="${esc(s1.companyTitleBn || "")}" /></label>
      <label>Happy text (EN)<input data-s1="happyText" value="${esc(s1.happyText || "")}" /></label>
      <label>Happy text (BN)<input data-s1="happyTextBn" value="${esc(s1.happyTextBn || "")}" /></label>
      <label>Download text (EN)<input data-s1="downloadText" value="${esc(s1.downloadText || "")}" /></label>
      <label>Download text (BN)<input data-s1="downloadTextBn" value="${esc(s1.downloadTextBn || "")}" /></label>
    </div>
    <div class="logo-admin-item" style="margin-bottom:1.25rem">
      <div class="logo-admin-item__preview">
        ${s1.appIconUrl ? `<img src="${esc(s1.appIconUrl)}" alt="" />` : `<span>No icon</span>`}
      </div>
      <div class="logo-admin-item__fields">
        <strong>App promo icon</strong>
        <div class="logo-upload__actions">
          <label class="btn-file">
            Upload icon
            <input type="file" id="app-icon-file" accept="image/*,.svg" hidden />
          </label>
          <button type="button" class="danger" id="app-icon-delete" ${s1.appIconUrl ? "" : "disabled"}>Delete icon</button>
        </div>
      </div>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Customer Care links</h3>
      <button type="button" id="add-customer-link">+ Add link</button>
    </div>
    <div class="table-wrap" style="margin-bottom:1.25rem">
      <table class="admin-table">
        <thead><tr><th>Label EN</th><th>Label BN</th><th>URL</th><th></th></tr></thead>
        <tbody id="customer-link-rows"></tbody>
      </table>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Company links</h3>
      <button type="button" id="add-company-link">+ Add link</button>
    </div>
    <div class="table-wrap" style="margin-bottom:1.25rem">
      <table class="admin-table">
        <thead><tr><th>Label EN</th><th>Label BN</th><th>URL</th><th></th></tr></thead>
        <tbody id="company-link-rows"></tbody>
      </table>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">App store buttons</h3>
      <button type="button" id="add-app-btn">+ Add button</button>
    </div>
    <div id="app-btn-list" class="logo-admin-list" style="margin-bottom:1.75rem"></div>

    <hr style="border:0;border-top:1px solid #e8e8e8;margin:0 0 1.25rem" />
    <h3 class="header-admin__title">Payment &amp; trust (footer-second)</h3>
    <p class="header-admin__hint">Upload / delete payment and verified logos. Built-in SVGs live in /assets/payments/ — uploaded files go to /uploads/.</p>
    <div class="form-grid" style="margin-bottom:1rem">
      <label>Payment title (EN)<input data-s2="paymentTitle" value="${esc(s2.paymentTitle || "")}" /></label>
      <label>Payment title (BN)<input data-s2="paymentTitleBn" value="${esc(s2.paymentTitleBn || "")}" /></label>
      <label>Verified title (EN)<input data-s2="verifiedTitle" value="${esc(s2.verifiedTitle || "")}" /></label>
      <label>Verified title (BN)<input data-s2="verifiedTitleBn" value="${esc(s2.verifiedTitleBn || "")}" /></label>
      <label>DBID title<input data-s2="dbidTitle" value="${esc(s2.dbidTitle || "")}" /></label>
      <label>DBID label (EN)<input data-s2="dbidLabel" value="${esc(s2.dbidLabel || "")}" /></label>
      <label>DBID label (BN)<input data-s2="dbidLabelBn" value="${esc(s2.dbidLabelBn || "")}" /></label>
      <label>Registration ID<input data-s2="dbidValue" value="${esc(s2.dbidValue || "")}" /></label>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Payment logos</h3>
      <button type="button" id="add-pay-logo">+ Add payment logo</button>
    </div>
    <div id="pay-logo-list" class="logo-admin-list" style="margin-bottom:1.5rem"></div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Verified logos</h3>
      <button type="button" id="add-verify-logo">+ Add verified logo</button>
    </div>
    <div id="verify-logo-list" class="logo-admin-list" style="margin-bottom:1.75rem"></div>

    <hr style="border:0;border-top:1px solid #e8e8e8;margin:0 0 1.25rem" />
    <h3 class="header-admin__title">SEO content (footer-third)</h3>
    <p class="header-admin__hint">Daraz-style long footer: intro, trending, top categories &amp; brands, bestsellers. Save changes when done.</p>
    <div class="form-grid" style="margin-bottom:1rem">
      <label>Intro title (EN)<input data-t3="introTitle" value="${esc(t3.introTitle)}" /></label>
      <label>Intro title (BN)<input data-t3="introTitleBn" value="${esc(t3.introTitleBn || "")}" /></label>
    </div>
    <div class="form-grid" style="grid-template-columns:1fr 1fr;margin-bottom:1rem">
      <label>Intro text (EN)<textarea data-t3="introHtml" rows="6">${esc(t3.introHtml || "")}</textarea></label>
      <label>Intro text (BN)<textarea data-t3="introHtmlBn" rows="6">${esc(t3.introHtmlBn || "")}</textarea></label>
      <label>More text / COD &amp; app (EN)<textarea data-t3="moreHtml" rows="6">${esc(t3.moreHtml || "")}</textarea></label>
      <label>More text (BN)<textarea data-t3="moreHtmlBn" rows="6">${esc(t3.moreHtmlBn || "")}</textarea></label>
    </div>
    <div class="form-grid" style="margin-bottom:1rem">
      <label>Trending title (EN)<input data-t3="trendingTitle" value="${esc(t3.trendingTitle || "")}" /></label>
      <label>Trending title (BN)<input data-t3="trendingTitleBn" value="${esc(t3.trendingTitleBn || "")}" /></label>
      <label>Categories title (EN)<input data-t3="categoriesTitle" value="${esc(t3.categoriesTitle || "")}" /></label>
      <label>Categories title (BN)<input data-t3="categoriesTitleBn" value="${esc(t3.categoriesTitleBn || "")}" /></label>
      <label>Bestsellers title (EN)<input data-t3="bestsellersTitle" value="${esc(t3.bestsellersTitle || "")}" /></label>
      <label>Bestsellers title (BN)<input data-t3="bestsellersTitleBn" value="${esc(t3.bestsellersTitleBn || "")}" /></label>
    </div>
    <label style="display:grid;gap:0.35rem;font-size:0.85rem;font-weight:600;margin-bottom:1.25rem">
      Bestsellers (comma-separated)
      <textarea data-t3="bestsellers" rows="4">${esc(t3.bestsellers || "")}</textarea>
    </label>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Trending links</h3>
      <button type="button" id="add-footer-trend">+ Add trending</button>
    </div>
    <div class="table-wrap" style="margin-bottom:1.5rem">
      <table class="admin-table">
        <thead><tr><th>Label</th><th>Link</th><th></th></tr></thead>
        <tbody id="footer-trend-rows"></tbody>
      </table>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Category / brand groups</h3>
      <button type="button" id="add-footer-catgroup">+ Add group</button>
    </div>
    <p class="header-admin__hint">Title like MOBILE PHONES; items are comma-separated brand names.</p>
    <div class="table-wrap" style="margin-bottom:1.75rem">
      <table class="admin-table">
        <thead><tr><th>Group title</th><th>Items (comma-separated)</th><th></th></tr></thead>
        <tbody id="footer-catgroup-rows"></tbody>
      </table>
    </div>

    <hr style="border:0;border-top:1px solid #e8e8e8;margin:0 0 1.25rem" />
    <h3 class="header-admin__title">International &amp; social (footer-fourth)</h3>
    <div class="form-grid" style="margin-bottom:1.25rem">
      <label>International title (EN)<input data-fk="internationalTitle" value="${esc(f.internationalTitle)}" /></label>
      <label>International title (BN)<input data-fk="internationalTitleBn" value="${esc(f.internationalTitleBn)}" /></label>
      <label>Follow title (EN)<input data-fk="followTitle" value="${esc(f.followTitle)}" /></label>
      <label>Follow title (BN)<input data-fk="followTitleBn" value="${esc(f.followTitleBn)}" /></label>
      <label>Copyright name<input data-fk="copyrightName" value="${esc(f.copyrightName)}" placeholder="Daraz" /></label>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Countries</h3>
      <button type="button" id="add-footer-country">+ Add country</button>
    </div>
    <p class="header-admin__hint">Flag code = ISO 2-letter (pk, bd, lk, mm, np). Optional custom flag image URL overrides the code.</p>
    <div class="table-wrap" style="margin-bottom:1.5rem">
      <table class="admin-table">
        <thead><tr><th>Name EN</th><th>Name BN</th><th>Flag code</th><th>Flag image URL</th><th>Link</th><th></th></tr></thead>
        <tbody id="footer-country-rows"></tbody>
      </table>
    </div>

    <div class="panel-toolbar">
      <h3 class="header-admin__title" style="margin:0">Social links</h3>
      <button type="button" id="add-footer-social">+ Add social</button>
    </div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>Network</th><th>URL</th><th></th></tr></thead>
        <tbody id="footer-social-rows"></tbody>
      </table>
    </div>
  `;

  els.panelContent.querySelectorAll("[data-fk]").forEach((input) => {
    input.addEventListener("input", () => {
      store.settings.footer[input.dataset.fk] = input.value;
    });
  });
  els.panelContent.querySelectorAll("[data-t3]").forEach((input) => {
    input.addEventListener("input", () => {
      store.settings.footer.third[input.dataset.t3] = input.value;
    });
  });
  els.panelContent.querySelectorAll("[data-s2]").forEach((input) => {
    input.addEventListener("input", () => {
      store.settings.footer.second[input.dataset.s2] = input.value;
    });
  });
  els.panelContent.querySelectorAll("[data-s1]").forEach((input) => {
    input.addEventListener("input", () => {
      store.settings.footer.first[input.dataset.s1] = input.value;
    });
  });

  document.getElementById("app-icon-file").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const oldUrl = store.settings.footer.first.appIconUrl;
      const url = await uploadLogoFile(file);
      store.settings.footer.first.appIconUrl = url;
      await saveStore();
      if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
      renderFooterAdmin();
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  });
  document.getElementById("app-icon-delete").addEventListener("click", async () => {
    const oldUrl = store.settings.footer.first.appIconUrl;
    store.settings.footer.first.appIconUrl = "";
    try {
      await saveStore();
      if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
      renderFooterAdmin();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  });

  function bindSimpleLinks(tbodyId, key, addBtnId) {
    const tbody = document.getElementById(tbodyId);
    function draw() {
      tbody.innerHTML = store.settings.footer.first[key].map((link, i) => `
        <tr>
          <td><input value="${esc(link.label || "")}" data-i="${i}" data-f="label" /></td>
          <td><input value="${esc(link.labelBn || "")}" data-i="${i}" data-f="labelBn" /></td>
          <td><input value="${esc(link.href || "")}" data-i="${i}" data-f="href" /></td>
          <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
        </tr>`).join("");
      tbody.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
          store.settings.footer.first[key][input.dataset.i][input.dataset.f] = input.value;
        });
      });
      tbody.querySelectorAll("[data-del]").forEach((btn) => {
        btn.addEventListener("click", () => {
          store.settings.footer.first[key].splice(Number(btn.dataset.del), 1);
          draw();
        });
      });
    }
    draw();
    document.getElementById(addBtnId).addEventListener("click", () => {
      store.settings.footer.first[key].push({ label: "New link", labelBn: "নতুন লিংক", href: "#" });
      draw();
    });
  }
  bindSimpleLinks("customer-link-rows", "customerLinks", "add-customer-link");
  bindSimpleLinks("company-link-rows", "companyLinks", "add-company-link");

  const appBtnList = document.getElementById("app-btn-list");
  function drawAppButtons() {
    appBtnList.innerHTML = store.settings.footer.first.appButtons.map((btn, i) => `
      <div class="logo-admin-item">
        <div class="logo-admin-item__preview">
          ${btn.imageUrl ? `<img src="${esc(btn.imageUrl)}" alt="" />` : `<span>No image</span>`}
        </div>
        <div class="logo-admin-item__fields">
          <input value="${esc(btn.label || "")}" data-i="${i}" data-f="label" placeholder="Label" />
          <input value="${esc(btn.href || "")}" data-i="${i}" data-f="href" placeholder="https://..." />
          <div class="logo-upload__actions">
            <label class="btn-file">
              Upload
              <input type="file" accept="image/*,.svg" data-upload="${i}" hidden />
            </label>
            <button type="button" class="danger" data-del="${i}">Delete</button>
          </div>
        </div>
      </div>`).join("");
    appBtnList.querySelectorAll("input[data-f]").forEach((input) => {
      input.addEventListener("input", () => {
        store.settings.footer.first.appButtons[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    appBtnList.querySelectorAll("input[data-upload]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const idx = Number(input.dataset.upload);
        try {
          const oldUrl = store.settings.footer.first.appButtons[idx].imageUrl;
          const url = await uploadLogoFile(file);
          store.settings.footer.first.appButtons[idx].imageUrl = url;
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
          drawAppButtons();
        } catch (err) {
          alert(err.message || "Upload failed");
        } finally {
          input.value = "";
        }
      });
    });
    appBtnList.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.del);
        const oldUrl = store.settings.footer.first.appButtons[idx].imageUrl;
        store.settings.footer.first.appButtons.splice(idx, 1);
        drawAppButtons();
        try {
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
        } catch (err) {
          alert(err.message || "Delete failed");
        }
      });
    });
  }
  drawAppButtons();
  document.getElementById("add-app-btn").addEventListener("click", () => {
    store.settings.footer.first.appButtons.push({
      id: uid("app-"),
      label: "App Store",
      imageUrl: "",
      href: "#",
    });
    drawAppButtons();
  });

  function bindLogoList(listId, key, addBtnId, defaultLabel) {
    const list = document.getElementById(listId);
    function draw() {
      list.innerHTML = store.settings.footer.second[key].map((item, i) => `
        <div class="logo-admin-item">
          <div class="logo-admin-item__preview">
            ${item.imageUrl ? `<img src="${esc(item.imageUrl)}" alt="" />` : `<span>No image</span>`}
          </div>
          <div class="logo-admin-item__fields">
            <input value="${esc(item.label || "")}" data-i="${i}" data-f="label" placeholder="Label" />
            <div class="logo-upload__actions">
              <label class="btn-file">
                Upload
                <input type="file" accept="image/*,.svg" data-upload="${i}" hidden />
              </label>
              <button type="button" class="danger" data-del="${i}">Delete</button>
            </div>
          </div>
        </div>`).join("");

      list.querySelectorAll("input[data-f]").forEach((input) => {
        input.addEventListener("input", () => {
          store.settings.footer.second[key][input.dataset.i][input.dataset.f] = input.value;
        });
      });
      list.querySelectorAll("input[data-upload]").forEach((input) => {
        input.addEventListener("change", async () => {
          const file = input.files && input.files[0];
          if (!file) return;
          const idx = Number(input.dataset.upload);
          try {
            const oldUrl = store.settings.footer.second[key][idx].imageUrl;
            const url = await uploadLogoFile(file);
            store.settings.footer.second[key][idx].imageUrl = url;
            await saveStore();
            if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) {
              await deleteUploadedFile(oldUrl);
            }
            draw();
          } catch (err) {
            alert(err.message || "Upload failed");
          } finally {
            input.value = "";
          }
        });
      });
      list.querySelectorAll("[data-del]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const idx = Number(btn.dataset.del);
          const oldUrl = store.settings.footer.second[key][idx].imageUrl;
          store.settings.footer.second[key].splice(idx, 1);
          draw();
          try {
            await saveStore();
            if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
          } catch (err) {
            alert(err.message || "Delete failed");
          }
        });
      });
    }
    draw();
    document.getElementById(addBtnId).addEventListener("click", () => {
      store.settings.footer.second[key].push({
        id: uid("pay-"),
        label: defaultLabel,
        imageUrl: "",
      });
      draw();
    });
  }

  bindLogoList("pay-logo-list", "payments", "add-pay-logo", "New payment");
  bindLogoList("verify-logo-list", "verified", "add-verify-logo", "Verified badge");

  const trendBody = document.getElementById("footer-trend-rows");
  function drawTrends() {
    trendBody.innerHTML = store.settings.footer.third.trending.map((item, i) => `
      <tr>
        <td><input value="${esc(item.label || "")}" data-i="${i}" data-f="label" /></td>
        <td><input value="${esc(item.href || "")}" data-i="${i}" data-f="href" /></td>
        <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
      </tr>`).join("");
    trendBody.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        store.settings.footer.third.trending[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    trendBody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.settings.footer.third.trending.splice(Number(btn.dataset.del), 1);
        drawTrends();
      });
    });
  }
  drawTrends();
  document.getElementById("add-footer-trend").addEventListener("click", () => {
    store.settings.footer.third.trending.push({ label: "New trend", href: "home.html?q=sale" });
    drawTrends();
  });

  const catBody = document.getElementById("footer-catgroup-rows");
  function drawCatGroups() {
    catBody.innerHTML = store.settings.footer.third.categoryGroups.map((g, i) => `
      <tr>
        <td><input value="${esc(g.title || "")}" data-i="${i}" data-f="title" /></td>
        <td><textarea data-i="${i}" data-f="items" rows="2">${esc(g.items || "")}</textarea></td>
        <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
      </tr>`).join("");
    catBody.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        store.settings.footer.third.categoryGroups[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    catBody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.settings.footer.third.categoryGroups.splice(Number(btn.dataset.del), 1);
        drawCatGroups();
      });
    });
  }
  drawCatGroups();
  document.getElementById("add-footer-catgroup").addEventListener("click", () => {
    store.settings.footer.third.categoryGroups.push({ title: "NEW GROUP", items: "Brand A, Brand B" });
    drawCatGroups();
  });

  const countryBody = document.getElementById("footer-country-rows");
  function drawCountries() {
    countryBody.innerHTML = store.settings.footer.countries.map((c, i) => `
      <tr>
        <td><input value="${esc(c.name)}" data-i="${i}" data-f="name" /></td>
        <td><input value="${esc(c.nameBn || "")}" data-i="${i}" data-f="nameBn" /></td>
        <td><input value="${esc(c.flagCode || "")}" data-i="${i}" data-f="flagCode" placeholder="bd" style="width:4rem" /></td>
        <td><input value="${esc(c.flagUrl || "")}" data-i="${i}" data-f="flagUrl" placeholder="optional /uploads/..." /></td>
        <td><input value="${esc(c.href || "")}" data-i="${i}" data-f="href" /></td>
        <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
      </tr>`).join("");

    countryBody.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        store.settings.footer.countries[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    countryBody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.settings.footer.countries.splice(Number(btn.dataset.del), 1);
        drawCountries();
      });
    });
  }
  drawCountries();

  document.getElementById("add-footer-country").addEventListener("click", () => {
    store.settings.footer.countries.push({
      id: uid("co-"),
      name: "New Country",
      nameBn: "নতুন দেশ",
      flagCode: "bd",
      flagUrl: "",
      href: "#",
    });
    drawCountries();
  });

  const socialBody = document.getElementById("footer-social-rows");
  function drawSocials() {
    socialBody.innerHTML = store.settings.footer.socials.map((s, i) => `
      <tr>
        <td>
          <select data-i="${i}" data-f="network">
            ${["facebook", "youtube", "twitter", "instagram"].map((n) =>
              `<option value="${n}"${(s.network || "") === n ? " selected" : ""}>${n}</option>`
            ).join("")}
          </select>
        </td>
        <td><input value="${esc(s.href || "")}" data-i="${i}" data-f="href" /></td>
        <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
      </tr>`).join("");

    socialBody.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("input", () => {
        store.settings.footer.socials[input.dataset.i][input.dataset.f] = input.value;
      });
      input.addEventListener("change", () => {
        store.settings.footer.socials[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    socialBody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.settings.footer.socials.splice(Number(btn.dataset.del), 1);
        drawSocials();
      });
    });
  }
  drawSocials();

  document.getElementById("add-footer-social").addEventListener("click", () => {
    store.settings.footer.socials.push({
      id: uid("soc-"),
      network: "facebook",
      href: "https://www.facebook.com/",
    });
    drawSocials();
  });
}

function renderCategories() {
  els.panelContent.innerHTML = `
    <div class="panel-toolbar">
      <span>${store.categories.length} categories</span>
      <button type="button" id="add-category">+ Add category</button>
    </div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>ID</th><th>Name EN</th><th>Name BN</th><th></th></tr></thead>
        <tbody id="cat-rows"></tbody>
      </table>
    </div>
  `;

  const tbody = document.getElementById("cat-rows");
  function draw() {
    tbody.innerHTML = store.categories.map((c, i) => `
      <tr>
        <td><input value="${esc(c.id)}" data-i="${i}" data-f="id" /></td>
        <td><input value="${esc(c.name)}" data-i="${i}" data-f="name" /></td>
        <td><input value="${esc(c.nameBn)}" data-i="${i}" data-f="nameBn" /></td>
        <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
      </tr>`).join("");

    tbody.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        store.categories[input.dataset.i][input.dataset.f] = input.value;
      });
    });
    tbody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.categories.splice(Number(btn.dataset.del), 1);
        draw();
      });
    });
  }
  draw();

  document.getElementById("add-category").addEventListener("click", () => {
    store.categories.push({ id: uid("cat-"), name: "New Category", nameBn: "নতুন ক্যাটাগরি" });
    draw();
  });
}

function renderProducts() {
  if (!store.trendingSearches) store.trendingSearches = [];
  if (!store.brands) store.brands = [];
  const catOptions = store.categories.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("");
  els.panelContent.innerHTML = `
    <div class="panel-toolbar">
      <span>${store.products.length} products</span>
      <button type="button" id="add-product">+ Add product</button>
    </div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>ID</th><th>Name EN</th><th>Name BN</th><th>Description EN</th><th>Description BN</th><th>Highlights EN (one per line)</th><th>Highlights BN</th><th>Box contents EN</th><th>Box contents BN</th><th>Specs (Label|Value; one per line)</th><th>Warranty EN</th><th>Warranty BN</th><th>Price</th><th>Sale</th><th>Original</th><th>% Off</th><th>Category</th><th>Brand</th><th>Badge</th><th>Tag</th><th>Banner Strip</th><th>Location</th><th>Sold</th><th>★</th><th>Reviews</th><th>Coins</th><th>Mall</th><th>Color Label</th><th>Colors (label|url;)</th><th>Storage Options</th><th>Instalment Months</th><th>Stock Note</th><th>Flash Hours</th><th>Flash Days</th><th>Promo Text</th><th>Promo Meta</th><th>Image URL</th><th>Gallery URLs</th><th>On</th><th></th></tr></thead>
        <tbody id="prod-rows"></tbody>
      </table>
    </div>
    <p class="hint" style="margin-top:0.75rem;color:#757575;font-size:0.85rem">Cards on homepage/category open the product page. Fill <strong>Description</strong> for full PDP details. Colors like <code>Sky Cyan|https://img1; Sunlike Orange|https://img2</code>.</p>
  `;

  const tbody = document.getElementById("prod-rows");
  function draw() {
    tbody.innerHTML = store.products.map((p, i) => `
      <tr>
        <td><input value="${esc(p.id)}" data-i="${i}" data-f="id" style="width:60px" /></td>
        <td><input value="${esc(p.name)}" data-i="${i}" data-f="name" /></td>
        <td><input value="${esc(p.nameBn || "")}" data-i="${i}" data-f="nameBn" /></td>
        <td><textarea data-i="${i}" data-f="description" rows="3" style="min-width:200px">${esc(p.description || "")}</textarea></td>
        <td><textarea data-i="${i}" data-f="descriptionBn" rows="3" style="min-width:200px">${esc(p.descriptionBn || "")}</textarea></td>
        <td><textarea data-i="${i}" data-f="highlights" rows="3" style="min-width:160px">${esc((p.highlights || []).join("\n"))}</textarea></td>
        <td><textarea data-i="${i}" data-f="highlightsBn" rows="3" style="min-width:160px">${esc((p.highlightsBn || []).join("\n"))}</textarea></td>
        <td><textarea data-i="${i}" data-f="boxContents" rows="2" style="min-width:140px">${esc((p.boxContents || []).join("\n"))}</textarea></td>
        <td><textarea data-i="${i}" data-f="boxContentsBn" rows="2" style="min-width:140px">${esc((p.boxContentsBn || []).join("\n"))}</textarea></td>
        <td><textarea data-i="${i}" data-f="specs" rows="3" style="min-width:180px">${esc(formatSpecs(p.specs))}</textarea></td>
        <td><input value="${esc(p.warranty || "")}" data-i="${i}" data-f="warranty" style="width:140px" /></td>
        <td><input value="${esc(p.warrantyBn || "")}" data-i="${i}" data-f="warrantyBn" style="width:140px" /></td>
        <td><input type="number" step="0.01" value="${esc(p.price)}" data-i="${i}" data-f="price" style="width:70px" /></td>
        <td><input type="number" step="0.01" value="${esc(p.salePrice != null ? p.salePrice : "")}" data-i="${i}" data-f="salePrice" placeholder="auto" style="width:60px" /></td>
        <td><input type="number" step="0.01" value="${esc(p.originalPrice != null ? p.originalPrice : "")}" data-i="${i}" data-f="originalPrice" placeholder="auto" style="width:65px" /></td>
        <td><input type="number" value="${esc(p.discount != null ? p.discount : "")}" data-i="${i}" data-f="discount" placeholder="auto" style="width:55px" /></td>
        <td><select data-i="${i}" data-f="category">${catOptions.replace(`value="${p.category}"`, `value="${p.category}" selected`)}</select></td>
        <td><input value="${esc(p.brand || "")}" data-i="${i}" data-f="brand" style="width:90px" /></td>
        <td><input value="${esc(p.badge || "")}" data-i="${i}" data-f="badge" placeholder="FLASH SALE" style="width:100px" /></td>
        <td><input value="${esc(p.tag || "")}" data-i="${i}" data-f="tag" placeholder="Mall" style="width:55px" /></td>
        <td><input value="${esc(p.bannerStrip || "")}" data-i="${i}" data-f="bannerStrip" placeholder="Official · Authentic · 0% EMI" style="width:160px" /></td>
        <td><input value="${esc(p.location || "")}" data-i="${i}" data-f="location" placeholder="Dhaka" style="width:80px" /></td>
        <td><input type="number" value="${esc(p.sold != null ? p.sold : 0)}" data-i="${i}" data-f="sold" style="width:55px" /></td>
        <td><input type="number" step="0.1" min="0" max="5" value="${esc(p.rating != null ? p.rating : "")}" data-i="${i}" data-f="rating" placeholder="5" style="width:50px" /></td>
        <td><input type="number" value="${esc(p.reviews != null ? p.reviews : "")}" data-i="${i}" data-f="reviews" placeholder="12" style="width:50px" /></td>
        <td><input type="number" value="${esc(p.coinsSave != null ? p.coinsSave : "")}" data-i="${i}" data-f="coinsSave" placeholder="5" style="width:45px" /></td>
        <td><input type="checkbox" data-i="${i}" data-f="mall" ${p.mall ? "checked" : ""} /></td>
        <td><input value="${esc(p.colorLabel || "")}" data-i="${i}" data-f="colorLabel" placeholder="Sunlike Orange" style="width:90px" /></td>
        <td><input value="${esc(formatColors(p.colors))}" data-i="${i}" data-f="colors" placeholder="Blue|url; Orange|url" style="width:180px" /></td>
        <td><input value="${esc((p.storageOptions || (p.storage ? [p.storage] : [])).join(", "))}" data-i="${i}" data-f="storageOptions" placeholder="64GB,128GB" style="width:110px" /></td>
        <td><input type="number" value="${esc(p.instalmentMonths != null ? p.instalmentMonths : "")}" data-i="${i}" data-f="instalmentMonths" placeholder="6" style="width:55px" /></td>
        <td><input value="${esc(p.stockNote || "")}" data-i="${i}" data-f="stockNote" placeholder="Almost sold out, buy now!" style="width:140px" /></td>
        <td><input type="number" value="${esc(p.flashHours != null ? p.flashHours : "")}" data-i="${i}" data-f="flashHours" placeholder="8" style="width:50px" /></td>
        <td><input type="number" value="${esc(p.flashDays != null ? p.flashDays : "")}" data-i="${i}" data-f="flashDays" placeholder="0" style="width:50px" /></td>
        <td><input value="${esc(p.detailPromoText || "")}" data-i="${i}" data-f="detailPromoText" placeholder="SHOP NOW!" style="width:90px" /></td>
        <td><input value="${esc(p.detailPromoMeta || "")}" data-i="${i}" data-f="detailPromoMeta" placeholder="PAYDAY SALE" style="width:110px" /></td>
        <td><input value="${esc(p.imageUrl || "")}" data-i="${i}" data-f="imageUrl" placeholder="https://..." /></td>
        <td><input value="${esc((p.imageGallery || []).join(", "))}" data-i="${i}" data-f="imageGallery" placeholder="url1, url2" /></td>
        <td><input type="checkbox" data-i="${i}" data-f="active" ${p.active !== false ? "checked" : ""} /></td>
        <td class="row-actions"><button type="button" class="danger" data-del="${i}">Delete</button></td>
      </tr>`).join("");

    tbody.querySelectorAll("input[data-f], select[data-f], textarea[data-f]").forEach((input) => {
      input.addEventListener("input", () => updateProduct(input));
      input.addEventListener("change", () => updateProduct(input));
    });
    tbody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.products.splice(Number(btn.dataset.del), 1);
        draw();
      });
    });
  }

  function formatColors(colors) {
    if (!Array.isArray(colors)) return "";
    return colors
      .map((c) => (typeof c === "string" ? c : `${c.label || ""}${c.image ? "|" + c.image : ""}`))
      .join("; ");
  }

  function formatSpecs(specs) {
    if (!Array.isArray(specs)) return "";
    return specs
      .map((s) => `${s.label || ""}${s.labelBn ? "/" + s.labelBn : ""}|${s.value || ""}`)
      .join("\n");
  }

  function parseSpecs(value) {
    return String(value || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [left, ...rest] = line.split("|");
        const valuePart = rest.join("|").trim();
        const [label, labelBn] = String(left || "")
          .split("/")
          .map((v) => v.trim());
        return { label, labelBn: labelBn || "", value: valuePart };
      });
  }

  function parseLines(value) {
    return String(value || "")
      .split(/\n+/)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  function parseColors(value) {
    return String(value || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [label, image] = part.split("|").map((v) => v.trim());
        return image ? { label, image } : { label };
      });
  }

  function updateProduct(input) {
    const p = store.products[input.dataset.i];
    const field = input.dataset.f;
    if (field === "active" || field === "mall") p[field] = input.checked;
    else if (field === "price" || field === "salePrice" || field === "originalPrice" || field === "sold" || field === "discount" || field === "coinsSave" || field === "rating" || field === "reviews" || field === "flashDays" || field === "flashHours" || field === "instalmentMonths") {
      const n = Number(input.value);
      p[field] = input.value === "" || Number.isNaN(n) ? (field === "price" || field === "sold" ? 0 : undefined) : n;
      if (["salePrice", "originalPrice", "discount", "coinsSave", "rating", "reviews", "flashDays", "flashHours", "instalmentMonths"].includes(field)) {
        if (p[field] === undefined) delete p[field];
      }
    } else if (field === "imageGallery" || field === "storageOptions") {
      p[field] = input.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (!p[field].length) delete p[field];
    } else if (field === "highlights" || field === "highlightsBn" || field === "boxContents" || field === "boxContentsBn") {
      p[field] = parseLines(input.value);
      if (!p[field].length) delete p[field];
    } else if (field === "specs") {
      p.specs = parseSpecs(input.value);
      if (!p.specs.length) delete p.specs;
    } else if (field === "colors") {
      p.colors = parseColors(input.value);
      if (!p.colors.length) delete p.colors;
    } else p[field] = input.value;
  }

  draw();

  document.getElementById("add-product").addEventListener("click", () => {
    store.products.push({
      id: uid("p"),
      name: "New Product",
      nameBn: "নতুন পণ্য",
      description: "Full product description for the detail page. Mention features, materials, warranty, and delivery notes.",
      descriptionBn: "পণ্যের বিস্তারিত বিবরণ — ফিচার, ম্যাটেরিয়াল, ওয়ারেন্টি ও ডেলিভারি নোট লিখুন।",
      highlights: ["Authentic quality", "Cash on delivery", "Fast delivery across Bangladesh"],
      highlightsBn: ["অথেন্টিক কোয়ালিটি", "ক্যাশ অন ডেলিভারি", "সারা দেশে দ্রুত ডেলিভারি"],
      boxContents: ["1 × Product", "User guide", "Packaging"],
      boxContentsBn: ["১ × পণ্য", "ইউজার গাইড", "প্যাকেজিং"],
      specs: [
        { label: "Brand", labelBn: "ব্র্যান্ড", value: "No Brand" },
        { label: "Category", labelBn: "ক্যাটাগরি", value: "General" },
      ],
      warranty: "Seller warranty / brand policy",
      warrantyBn: "সেলার ওয়ারেন্টি / ব্র্যান্ড পলিসি",
      price: 9.99,
      salePrice: 7.49,
      originalPrice: 9.99,
      discount: 30,
      category: store.categories[0]?.id || "apparel",
      brand: store.brands[0]?.name || "No Brand",
      badge: "FLASH SALE",
      tag: "Mall",
      bannerStrip: "",
      location: store.settings.defaultLocation || "Dhaka",
      locationBn: store.settings.defaultLocationBn || "ঢাকা",
      sold: 0,
      rating: 5,
      reviews: 12,
      coinsSave: 5,
      mall: false,
      colorLabel: "Default",
      colors: [],
      storageOptions: [],
      instalmentMonths: 6,
      stockNote: "Almost sold out, buy now!",
      flashHours: 8,
      flashDays: 0,
      detailPromoText: "",
      detailPromoMeta: "",
      color: "#2a6f6f",
      imageUrl: "",
      imageGallery: [],
      active: true,
    });
    draw();
  });
}

function renderBanners() {
  els.panelContent.innerHTML = `
    <div class="panel-toolbar">
      <span>${store.banners.length} banners</span>
      <button type="button" id="add-banner">+ Add banner</button>
    </div>
    <p class="header-admin__hint">Upload a full banner image (Daraz-style). Slides auto-rotate on the homepage. Optional title/CTA overlay on the image.</p>
    <div id="banner-list"></div>
  `;

  const list = document.getElementById("banner-list");
  function draw() {
    list.innerHTML = store.banners.map((b, i) => `
      <details open style="margin-bottom:1rem;border:1px solid #e8e8e8;border-radius:8px;padding:0.75rem">
        <summary style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
          ${b.imageUrl ? `<img src="${esc(b.imageUrl)}" alt="" style="height:40px;width:auto;border-radius:4px;object-fit:cover" />` : ""}
          <strong>${esc(b.title || "Banner")}</strong>
          <button type="button" class="danger" data-del="${i}">Delete</button>
        </summary>
        <div class="logo-admin-item" style="margin-top:0.75rem;grid-template-columns:160px 1fr">
          <div class="logo-admin-item__preview" style="min-height:72px;background:#f5f5f5">
            ${b.imageUrl ? `<img src="${esc(b.imageUrl)}" alt="" />` : `<span>No image</span>`}
          </div>
          <div class="logo-admin-item__fields">
            <div class="logo-upload__actions">
              <label class="btn-file">
                Upload banner image
                <input type="file" accept="image/*" data-upload="${i}" hidden />
              </label>
              <button type="button" class="danger" data-clear-img="${i}" ${b.imageUrl ? "" : "disabled"}>Remove image</button>
            </div>
            <p style="margin:0.35rem 0 0;font-size:0.8rem;color:#757575">Recommended ~1976×688px. With image = photo slide. Without = theme art slide.</p>
          </div>
        </div>
        <div class="form-grid" style="margin-top:0.75rem">
          <label>Title EN<input data-i="${i}" data-f="title" value="${esc(b.title)}" /></label>
          <label>Title BN<input data-i="${i}" data-f="titleBn" value="${esc(b.titleBn || "")}" /></label>
          <label>Subtitle EN<input data-i="${i}" data-f="subtitle" value="${esc(b.subtitle || "")}" /></label>
          <label>Subtitle BN<input data-i="${i}" data-f="subtitleBn" value="${esc(b.subtitleBn || "")}" /></label>
          <label>Badge / offer<input data-i="${i}" data-f="badge" value="${esc(b.badge || "")}" placeholder="UP TO 45% OFF" /></label>
          <label>CTA EN<input data-i="${i}" data-f="cta" value="${esc(b.cta || "Shop Now")}" /></label>
          <label>CTA BN<input data-i="${i}" data-f="ctaBn" value="${esc(b.ctaBn || "")}" /></label>
          <label>Link href<input data-i="${i}" data-f="href" value="${esc(b.href || "home.html")}" /></label>
          <label>Image URL<input data-i="${i}" data-f="imageUrl" value="${esc(b.imageUrl || "")}" placeholder="/uploads/... or https://..." /></label>
          <label>Theme (no image)<select data-i="${i}" data-f="theme">
            ${["delivery", "sale", "fashion", "home"].map((t) => `<option value="${t}" ${b.theme === t ? "selected" : ""}>${t}</option>`).join("")}
          </select></label>
          <label>Stats (comma)<input data-i="${i}" data-f="stats" value="${esc((b.stats || []).join(", "))}" /></label>
          <label>Active<input type="checkbox" data-i="${i}" data-f="active" ${b.active !== false ? "checked" : ""} /></label>
        </div>
      </details>`).join("");

    list.querySelectorAll("input[data-f], select[data-f]").forEach((input) => {
      input.addEventListener("input", () => updateBanner(input));
      input.addEventListener("change", () => updateBanner(input));
    });
    list.querySelectorAll("input[data-upload]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const idx = Number(input.dataset.upload);
        try {
          const oldUrl = store.banners[idx].imageUrl;
          const url = await uploadLogoFile(file);
          store.banners[idx].imageUrl = url;
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
          draw();
        } catch (err) {
          alert(err.message || "Upload failed");
        } finally {
          input.value = "";
        }
      });
    });
    list.querySelectorAll("[data-clear-img]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const idx = Number(btn.dataset.clearImg);
        const oldUrl = store.banners[idx].imageUrl;
        store.banners[idx].imageUrl = "";
        draw();
        try {
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
        } catch (err) {
          alert(err.message || "Failed");
        }
      });
    });
    list.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const idx = Number(btn.dataset.del);
        const oldUrl = store.banners[idx].imageUrl;
        store.banners.splice(idx, 1);
        draw();
        try {
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
        } catch (err) {
          alert(err.message || "Delete failed");
        }
      });
    });
  }

  function updateBanner(input) {
    const b = store.banners[input.dataset.i];
    const field = input.dataset.f;
    if (field === "active") b.active = input.checked;
    else if (field === "stats") b.stats = input.value.split(",").map((s) => s.trim()).filter(Boolean);
    else b[field] = input.value;
  }

  draw();
  document.getElementById("add-banner").addEventListener("click", () => {
    store.banners.push({
      id: uid("b"),
      title: "COOK SMART, DINE IN SHINE",
      titleBn: "স্মার্ট রান্না, সুন্দর ডাইনিং",
      badge: "UP TO 45% OFF",
      subtitle: "Premium Picks Perfect Value",
      subtitleBn: "প্রিমিয়াম পিক্স পারফেক্ট ভ্যালু",
      cta: "Shop Now",
      ctaBn: "এখনই কিনুন",
      href: "home.html",
      imageUrl: "",
      theme: "sale",
      stats: [],
      active: true,
    });
    draw();
  });
}

function renderFlash() {
  els.panelContent.innerHTML = `
    <p>Select products for Flash Sale section:</p>
    <div class="check-grid" id="flash-checks"></div>
  `;
  const box = document.getElementById("flash-checks");
  box.innerHTML = store.products.map((p) => `
    <label>
      <input type="checkbox" value="${esc(p.id)}" ${store.flashSaleIds.includes(p.id) ? "checked" : ""} />
      ${esc(p.name)} (${esc(p.id)})
    </label>`).join("");

  box.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        if (!store.flashSaleIds.includes(input.value)) store.flashSaleIds.push(input.value);
      } else {
        store.flashSaleIds = store.flashSaleIds.filter((id) => id !== input.value);
      }
    });
  });
}

function renderHome() {
  if (!store.homeCategories || typeof store.homeCategories !== "object") {
    store.homeCategories = { title: "Categories", titleBn: "ক্যাটাগরি", items: [] };
  }
  if (!Array.isArray(store.homeCategories.items)) store.homeCategories.items = [];
  if (!store.settings.tshirt || typeof store.settings.tshirt !== "object") {
    store.settings.tshirt = { searchQuery: "t shirt", resultTitle: "t shirt" };
  }
  if (!Array.isArray(store.tshirtProductIds)) store.tshirtProductIds = [];

  const catOptions = store.categories.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("");
  const prodOptions = store.products
    .map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`)
    .join("");

  els.panelContent.innerHTML = `
    <h3 class="header-admin__title">Categories grid (homepage)</h3>
    <p class="header-admin__hint">Daraz-style Categories block. Each tile can open a <strong>product</strong> detail page or a <strong>category</strong> listing. Upload images and Save changes.</p>
    <div class="form-grid" style="margin-bottom:1rem">
      <label>Section title (EN)<input id="hcat-title" value="${esc(store.homeCategories.title || "Categories")}" /></label>
      <label>Section title (BN)<input id="hcat-title-bn" value="${esc(store.homeCategories.titleBn || "")}" /></label>
    </div>
    <div class="panel-toolbar">
      <span id="hcat-count"></span>
      <button type="button" id="add-hcat">+ Add category tile</button>
    </div>
    <div id="hcat-list" class="logo-admin-list" style="margin-bottom:1.5rem"></div>

    <hr style="border:0;border-top:1px solid #e8e8e8;margin:0 0 1.25rem" />
    <h3>Category icon strip (emoji row)</h3>
    <div class="panel-toolbar"><span></span><button type="button" id="add-icon">+ Add icon</button></div>
    <div id="icon-list"></div>
    <hr />
    <h3>Sidebar categories (Home / Search)</h3>
    <p style="margin:0 0 0.75rem;color:#757575;font-size:0.88rem">Daraz-style left filter list on <a href="/home.html" target="_blank">Home</a> and search pages. Order = top to bottom.</p>
    <div class="panel-toolbar">
      <span id="sidebar-cat-count"></span>
      <button type="button" id="sidebar-cat-reset">Reset defaults</button>
    </div>
    <div class="check-grid" id="sidebar-cat-checks" style="margin-bottom:1.25rem"></div>
    <hr />
    <h3>Featured categories</h3>
    <div class="check-grid" id="featured-checks"></div>
    <hr />
    <h3>T-Shirt page products</h3>
    <p style="margin:0 0 0.75rem;color:#757575;font-size:0.88rem">Daraz-style grid on <a href="/tshirt.html" target="_blank">T-Shirt page</a>. Click any product → full detail page. Edit text/images in <strong>Products</strong> panel.</p>
    <div class="form-grid" style="margin-bottom:0.75rem">
      <label>Search keyword<input id="tshirt-search-query" value="${esc((store.settings.tshirt && store.settings.tshirt.searchQuery) || "t shirt")}" /></label>
      <label>Page title<input id="tshirt-result-title" value="${esc((store.settings.tshirt && store.settings.tshirt.resultTitle) || "t shirt")}" /></label>
    </div>
    <div class="panel-toolbar">
      <span id="tshirt-prod-count"></span>
      <button type="button" id="tshirt-prod-select-all">Select all</button>
      <button type="button" id="tshirt-prod-clear">Clear (use keyword)</button>
    </div>
    <div class="check-grid" id="tshirt-prod-checks" style="margin-bottom:1.25rem"></div>
    <hr />
    <h3>Just For You / Home products</h3>
    <p style="margin:0 0 0.75rem;color:#757575;font-size:0.88rem">These products appear on the <strong>Home page</strong> product grid (<a href="/home.html" target="_blank">/home.html</a> and <a href="/" target="_blank">/</a>). Leave empty to show all active products. Full product details (price, images, description, specs…) are edited in the <strong>Products</strong> panel.</p>
    <div class="form-grid" style="margin-bottom:0.75rem">
      <label>Home title (EN)<input id="home-page-title" value="${esc((store.settings && store.settings.homePageTitle) || "Just For You")}" /></label>
      <label>Home title (BN)<input id="home-page-title-bn" value="${esc((store.settings && store.settings.homePageTitleBn) || "হোম")}" /></label>
    </div>
    <div class="panel-toolbar">
      <span id="jfy-count"></span>
      <button type="button" id="jfy-select-all">Select all</button>
      <button type="button" id="jfy-clear-all">Clear</button>
    </div>
    <div class="check-grid" id="home-prod-checks"></div>
  `;

  document.getElementById("hcat-title").addEventListener("input", (e) => {
    store.homeCategories.title = e.target.value;
  });
  document.getElementById("hcat-title-bn").addEventListener("input", (e) => {
    store.homeCategories.titleBn = e.target.value;
  });

  const hcatList = document.getElementById("hcat-list");
  const hcatCount = document.getElementById("hcat-count");
  function drawHcats() {
    hcatCount.textContent = `${store.homeCategories.items.length} tiles`;
    hcatList.innerHTML = store.homeCategories.items.map((item, i) => {
      const linkType = item.linkType === "category" ? "category" : "product";
      return `
      <div class="logo-admin-item" style="grid-template-columns:90px 1fr">
        <div class="logo-admin-item__preview">
          ${item.imageUrl ? `<img src="${esc(item.imageUrl)}" alt="" />` : `<span>No img</span>`}
        </div>
        <div class="logo-admin-item__fields">
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:0.5rem">
            <label>Label EN<input data-i="${i}" data-f="label" value="${esc(item.label || "")}" /></label>
            <label>Label BN<input data-i="${i}" data-f="labelBn" value="${esc(item.labelBn || "")}" /></label>
            <label>Link type
              <select data-i="${i}" data-f="linkType">
                <option value="product"${linkType === "product" ? " selected" : ""}>Product detail</option>
                <option value="category"${linkType === "category" ? " selected" : ""}>Category page</option>
              </select>
            </label>
            <label>Product
              <select data-i="${i}" data-f="productId">
                <option value="">—</option>
                ${prodOptions.replace(`value="${item.productId}"`, `value="${item.productId}" selected`)}
              </select>
            </label>
            <label>Category
              <select data-i="${i}" data-f="categoryId">
                <option value="">—</option>
                ${catOptions.replace(`value="${item.categoryId}"`, `value="${item.categoryId}" selected`)}
              </select>
            </label>
          </div>
          <div class="logo-upload__actions" style="margin-top:0.4rem">
            <label class="btn-file">
              Upload image
              <input type="file" accept="image/*,.svg" data-upload="${i}" hidden />
            </label>
            <button type="button" class="danger" data-del="${i}">Delete</button>
          </div>
        </div>
      </div>`;
    }).join("");

    hcatList.querySelectorAll("input[data-f], select[data-f]").forEach((el) => {
      const sync = () => {
        store.homeCategories.items[el.dataset.i][el.dataset.f] = el.value;
        if (el.dataset.f === "productId" && el.value) {
          const p = store.products.find((x) => x.id === el.value);
          if (p && !store.homeCategories.items[el.dataset.i].imageUrl && p.imageUrl) {
            store.homeCategories.items[el.dataset.i].imageUrl = p.imageUrl;
            drawHcats();
          }
        }
      };
      el.addEventListener("input", sync);
      el.addEventListener("change", sync);
    });
    hcatList.querySelectorAll("input[data-upload]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const idx = Number(input.dataset.upload);
        try {
          const oldUrl = store.homeCategories.items[idx].imageUrl;
          const url = await uploadLogoFile(file);
          store.homeCategories.items[idx].imageUrl = url;
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) await deleteUploadedFile(oldUrl);
          drawHcats();
        } catch (err) {
          alert(err.message || "Upload failed");
        } finally {
          input.value = "";
        }
      });
    });
    hcatList.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.del);
        const oldUrl = store.homeCategories.items[idx].imageUrl;
        store.homeCategories.items.splice(idx, 1);
        drawHcats();
        try {
          await saveStore();
          if (oldUrl && oldUrl.startsWith("/uploads/")) await deleteUploadedFile(oldUrl);
        } catch (err) {
          alert(err.message || "Delete failed");
        }
      });
    });
  }
  drawHcats();
  document.getElementById("add-hcat").addEventListener("click", () => {
    const p = store.products[0];
    store.homeCategories.items.push({
      id: uid("hcat"),
      label: "New Category",
      labelBn: "নতুন ক্যাটাগরি",
      imageUrl: p?.imageUrl || "",
      linkType: "product",
      productId: p?.id || "",
      categoryId: p?.category || store.categories[0]?.id || "",
    });
    drawHcats();
  });

  const iconList = document.getElementById("icon-list");
  function drawIcons() {
    iconList.innerHTML = store.homeCategoryIcons.map((icon, i) => `
      <div class="form-grid" style="margin-bottom:0.75rem;padding:0.75rem;border:1px solid #e8e8e8;border-radius:8px">
        <label>Icon emoji<input data-i="${i}" data-f="icon" value="${esc(icon.icon)}" /></label>
        <label>Label EN<input data-i="${i}" data-f="label" value="${esc(icon.label)}" /></label>
        <label>Label BN<input data-i="${i}" data-f="labelBn" value="${esc(icon.labelBn || "")}" /></label>
        <label>Category<select data-i="${i}" data-f="categoryId">${catOptions.replace(`value="${icon.categoryId}"`, `value="${icon.categoryId}" selected`)}</select></label>
        <label>&nbsp;<button type="button" class="danger" data-del="${i}">Remove</button></label>
      </div>`).join("");

    iconList.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", () => { store.homeCategoryIcons[el.dataset.i][el.dataset.f] = el.value; });
      el.addEventListener("change", () => { store.homeCategoryIcons[el.dataset.i][el.dataset.f] = el.value; });
    });
    iconList.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.homeCategoryIcons.splice(Number(btn.dataset.del), 1);
        drawIcons();
      });
    });
  }
  drawIcons();
  document.getElementById("add-icon").addEventListener("click", () => {
    store.homeCategoryIcons.push({
      id: uid("hci"),
      categoryId: store.categories[0]?.id || "",
      icon: "🛍️",
      label: "New",
      labelBn: "নতুন",
    });
    drawIcons();
  });

  document.getElementById("featured-checks").innerHTML = store.categories.map((c) => `
    <label><input type="checkbox" value="${esc(c.id)}" ${store.featuredCategoryIds.includes(c.id) ? "checked" : ""} /> ${esc(c.name)}</label>`).join("");
  document.getElementById("featured-checks").querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) store.featuredCategoryIds.push(input.value);
      else store.featuredCategoryIds = store.featuredCategoryIds.filter((id) => id !== input.value);
    });
  });

  if (!store.sidebarCategoryIds) store.sidebarCategoryIds = [];
  const sidebarDefaults = [
    "smartwatch-straps", "smartwatch-docks", "smartwatch-protectors", "smartwatch-cases",
    "smartwatches", "phone-cases", "phone-protectors", "fitness-trackers",
    "wall-chargers", "phone-cables", "smartphone", "watch-accessories", "tablet-cases", "camera-protectors",
  ];
  const sidebarCount = document.getElementById("sidebar-cat-count");
  function refreshSidebarCount() {
    if (sidebarCount) sidebarCount.textContent = `${store.sidebarCategoryIds.length} in sidebar`;
  }
  document.getElementById("sidebar-cat-checks").innerHTML = store.categories.map((c) => `
    <label><input type="checkbox" value="${esc(c.id)}" ${store.sidebarCategoryIds.includes(c.id) ? "checked" : ""} /> ${esc(c.name)}</label>`).join("");
  document.getElementById("sidebar-cat-checks").querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        if (!store.sidebarCategoryIds.includes(input.value)) store.sidebarCategoryIds.push(input.value);
      } else {
        store.sidebarCategoryIds = store.sidebarCategoryIds.filter((id) => id !== input.value);
      }
      refreshSidebarCount();
    });
  });
  refreshSidebarCount();
  document.getElementById("sidebar-cat-reset").addEventListener("click", () => {
    store.sidebarCategoryIds = sidebarDefaults.filter((id) => store.categories.some((c) => c.id === id));
    renderHome();
  });

  if (!store.homeProductIds) store.homeProductIds = [];
  if (!store.settings) store.settings = {};

  const homeTitle = document.getElementById("home-page-title");
  const homeTitleBn = document.getElementById("home-page-title-bn");
  if (homeTitle) {
    homeTitle.addEventListener("input", () => {
      store.settings.homePageTitle = homeTitle.value;
    });
  }
  if (homeTitleBn) {
    homeTitleBn.addEventListener("input", () => {
      store.settings.homePageTitleBn = homeTitleBn.value;
    });
  }

  document.getElementById("tshirt-search-query").addEventListener("input", (e) => {
    store.settings.tshirt.searchQuery = e.target.value;
  });
  document.getElementById("tshirt-result-title").addEventListener("input", (e) => {
    store.settings.tshirt.resultTitle = e.target.value;
  });

  const tshirtCount = document.getElementById("tshirt-prod-count");
  function refreshTshirtCount() {
    if (tshirtCount) tshirtCount.textContent = `${store.tshirtProductIds.length} t-shirt products`;
  }
  document.getElementById("tshirt-prod-checks").innerHTML = store.products
    .filter((p) => p.active !== false)
    .map(
      (p) =>
        `<label><input type="checkbox" value="${esc(p.id)}" ${store.tshirtProductIds.includes(p.id) ? "checked" : ""} /> ${esc(p.name)}</label>`
    )
    .join("");
  document.getElementById("tshirt-prod-checks").querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        if (!store.tshirtProductIds.includes(input.value)) store.tshirtProductIds.push(input.value);
      } else {
        store.tshirtProductIds = store.tshirtProductIds.filter((id) => id !== input.value);
      }
      refreshTshirtCount();
    });
  });
  refreshTshirtCount();
  document.getElementById("tshirt-prod-select-all").addEventListener("click", () => {
    store.tshirtProductIds = store.products.filter((p) => p.active !== false).map((p) => p.id);
    renderHome();
  });
  document.getElementById("tshirt-prod-clear").addEventListener("click", () => {
    store.tshirtProductIds = [];
    renderHome();
  });

  const jfyCount = document.getElementById("jfy-count");
  function refreshJfyCount() {
    if (jfyCount) jfyCount.textContent = `${store.homeProductIds.length} selected`;
  }

  document.getElementById("home-prod-checks").innerHTML = store.products.map((p) => `
    <label><input type="checkbox" value="${esc(p.id)}" ${store.homeProductIds.includes(p.id) ? "checked" : ""} /> ${esc(p.name)}</label>`).join("");
  document.getElementById("home-prod-checks").querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        if (!store.homeProductIds.includes(input.value)) store.homeProductIds.push(input.value);
      } else {
        store.homeProductIds = store.homeProductIds.filter((id) => id !== input.value);
      }
      refreshJfyCount();
    });
  });
  refreshJfyCount();

  document.getElementById("jfy-select-all").addEventListener("click", () => {
    store.homeProductIds = store.products.map((p) => p.id);
    renderHome();
  });
  document.getElementById("jfy-clear-all").addEventListener("click", () => {
    store.homeProductIds = [];
    renderHome();
  });
}

function renderSearchAdmin() {
  if (!store.trendingSearches) store.trendingSearches = [];
  if (!store.brands) store.brands = [];

  els.panelContent.innerHTML = `
    <h3>Trending searches (under search bar)</h3>
    <div class="panel-toolbar"><span></span><button type="button" id="add-trend">+ Add trend</button></div>
    <div id="trend-list"></div>
    <hr />
    <h3>Brands (search sidebar filter)</h3>
    <div class="panel-toolbar"><span></span><button type="button" id="add-brand">+ Add brand</button></div>
    <div id="brand-list"></div>
    <p style="margin-top:1rem;color:#757575;font-size:0.9rem">Preview: <a href="/home.html?q=headphone" target="_blank">/home.html?q=headphone</a></p>
  `;

  const trendList = document.getElementById("trend-list");
  function drawTrends() {
    trendList.innerHTML = store.trendingSearches.map((item, i) => `
      <div class="form-grid" style="margin-bottom:0.5rem;padding:0.65rem;border:1px solid #e8e8e8;border-radius:8px">
        <label>Label EN<input data-i="${i}" data-f="label" value="${esc(item.label)}" /></label>
        <label>Label BN<input data-i="${i}" data-f="labelBn" value="${esc(item.labelBn || "")}" /></label>
        <label>Items found count<input type="number" data-i="${i}" data-f="resultCount" value="${esc(item.resultCount != null ? item.resultCount : "")}" placeholder="e.g. 20133" /></label>
        <label>&nbsp;<button type="button" class="danger" data-del="${i}">Remove</button></label>
      </div>`).join("");
    trendList.querySelectorAll("input").forEach((el) => {
      el.addEventListener("input", () => {
        const row = store.trendingSearches[el.dataset.i];
        if (el.dataset.f === "resultCount") {
          const n = Number(el.value);
          if (el.value === "" || Number.isNaN(n)) delete row.resultCount;
          else row.resultCount = n;
        } else {
          row[el.dataset.f] = el.value;
        }
      });
    });
    trendList.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.trendingSearches.splice(Number(btn.dataset.del), 1);
        drawTrends();
      });
    });
  }
  drawTrends();
  document.getElementById("add-trend").addEventListener("click", () => {
    store.trendingSearches.push({ id: uid("t"), label: "new search", labelBn: "নতুন সার্চ" });
    drawTrends();
  });

  const brandList = document.getElementById("brand-list");
  function drawBrands() {
    brandList.innerHTML = store.brands.map((b, i) => `
      <div class="form-grid" style="margin-bottom:0.5rem;padding:0.65rem;border:1px solid #e8e8e8;border-radius:8px">
        <label>Brand name<input data-i="${i}" data-f="name" value="${esc(b.name)}" /></label>
        <label>&nbsp;<button type="button" class="danger" data-del="${i}">Remove</button></label>
      </div>`).join("");
    brandList.querySelectorAll("input").forEach((el) => {
      el.addEventListener("input", () => { store.brands[el.dataset.i][el.dataset.f] = el.value; });
    });
    brandList.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.brands.splice(Number(btn.dataset.del), 1);
        drawBrands();
      });
    });
  }
  drawBrands();
  document.getElementById("add-brand").addEventListener("click", () => {
    store.brands.push({ id: uid("br"), name: "New Brand" });
    drawBrands();
  });
}

function renderReviews() {
  if (!store.settings.reviewsPage) {
    store.settings.reviewsPage = {
      eyebrow: "IN THEIR OWN WORDS",
      eyebrowBn: "তাদের নিজের ভাষায়",
      title: "Stories from our customers.",
      titleBn: "আমাদের কাস্টমারদের গল্প।",
    };
  }
  const rp = store.settings.reviewsPage;
  els.panelContent.innerHTML = `
    <p style="margin:0 0 0.75rem;color:#757575;font-size:0.88rem">Dark stories layout like IoT Programmers. Group reviews by <strong>Category</strong>. Preview: <a href="/review.html" target="_blank">/review.html</a></p>
    <div class="form-grid" style="margin-bottom:1rem;padding:0.75rem;border:1px solid #e8e8e8;border-radius:8px">
      <label>Page eyebrow EN<input data-rp="eyebrow" value="${esc(rp.eyebrow || "")}" /></label>
      <label>Page eyebrow BN<input data-rp="eyebrowBn" value="${esc(rp.eyebrowBn || "")}" /></label>
      <label>Page title EN<input data-rp="title" value="${esc(rp.title || "")}" /></label>
      <label>Page title BN<input data-rp="titleBn" value="${esc(rp.titleBn || "")}" /></label>
    </div>
    <div class="panel-toolbar"><span>${store.reviews.length} reviews</span><button type="button" id="add-review">+ Add review</button></div>
    <div id="review-list"></div>
  `;
  els.panelContent.querySelectorAll("[data-rp]").forEach((el) => {
    el.addEventListener("input", () => {
      store.settings.reviewsPage[el.dataset.rp] = el.value;
    });
  });
  const list = document.getElementById("review-list");
  function draw() {
    list.innerHTML = store.reviews.map((r, i) => `
      <div class="form-grid" style="margin-bottom:0.75rem;padding:0.75rem;border:1px solid #e8e8e8;border-radius:8px">
        <label>Name<input data-i="${i}" data-f="name" value="${esc(r.name)}" /></label>
        <label>Rating<input type="number" min="1" max="5" data-i="${i}" data-f="rating" value="${esc(r.rating)}" /></label>
        <label>Category EN<input data-i="${i}" data-f="category" value="${esc(r.category || "")}" placeholder="Custom MERN Apps" /></label>
        <label>Category BN<input data-i="${i}" data-f="categoryBn" value="${esc(r.categoryBn || "")}" placeholder="কাস্টম MERN অ্যাপ" /></label>
        <label>Text EN<textarea data-i="${i}" data-f="text">${esc(r.text)}</textarea></label>
        <label>Text BN<textarea data-i="${i}" data-f="textBn">${esc(r.textBn || "")}</textarea></label>
        <label>&nbsp;<button type="button" class="danger" data-del="${i}">Delete</button></label>
      </div>`).join("");

    list.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("input", () => {
        const field = el.dataset.f;
        store.reviews[el.dataset.i][field] = field === "rating" ? Number(el.value) : el.value;
      });
    });
    list.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        store.reviews.splice(Number(btn.dataset.del), 1);
        draw();
      });
    });
  }
  draw();
  document.getElementById("add-review").addEventListener("click", () => {
    store.reviews.push({
      name: "Customer",
      rating: 5,
      category: "Customer Stories",
      categoryBn: "কাস্টমার স্টোরিজ",
      text: "Great shop!",
      textBn: "দারুণ!",
    });
    draw();
  });
}

async function bootAdmin() {
  await loadStore();
  showApp(true);
  renderPanel();
}

els.loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.loginError.hidden = true;
  try {
    await apiLogin(els.loginPassword.value);
    await bootAdmin();
  } catch (err) {
    els.loginError.textContent = err.message;
    els.loginError.hidden = false;
  }
});

els.saveAllBtn.addEventListener("click", async () => {
  try {
    await saveStore();
  } catch (err) {
    els.saveStatus.textContent = err.message || "Save failed. Please login again.";
    els.saveStatus.style.color = "#c62828";
  }
});

els.logoutBtn.addEventListener("click", () => {
  setToken(null);
  showApp(false);
});

document.getElementById("admin-nav").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-panel]");
  if (!btn) return;
  panel = btn.dataset.panel;
  document.querySelectorAll(".admin-nav button").forEach((b) => b.classList.toggle("is-active", b === btn));
  renderPanel();
});

if (token()) {
  bootAdmin().catch(() => {
    setToken(null);
    showApp(false);
  });
} else {
  showApp(false);
}
