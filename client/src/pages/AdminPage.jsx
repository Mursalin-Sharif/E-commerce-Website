import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { DEFAULT_CONTACT, mergeContactSettings } from "../utils/contactDefaults";

const ADMIN_SECTIONS = [
  { id: "contact", label: "Shop & Contact" },
  { id: "topbar", label: "Top bar" },
  { id: "sidebar-categories", label: "Sidebar" },
  { id: "seller", label: "Seller" },
  { id: "cart", label: "Cart" },
  { id: "home", label: "Home" },
  { id: "headphone", label: "Headphone" },
  { id: "tshirt", label: "T-Shirt" },
  { id: "watch", label: "Watch" },
  { id: "smartwatch", label: "Smart Watch" },
  { id: "bra", label: "Bra" },
  { id: "jerseys", label: "Jerseys" },
  { id: "catalog", label: "Shoes & stickers" },
];

function sectionFromHash() {
  const hash = (window.location.hash || "").replace(/^#/, "");
  if (!hash.startsWith("admin-")) return "contact";
  const id = hash.slice("admin-".length);
  const aliases = {
    contact: "contact",
    topbar: "topbar",
    seller: "seller",
    "sidebar-categories": "sidebar-categories",
    cart: "cart",
    home: "home",
    headphone: "headphone",
    tshirt: "tshirt",
    watch: "watch",
    smartwatch: "smartwatch",
    bra: "bra",
    jerseys: "jerseys",
    "bike-stickers": "catalog",
    catalog: "catalog",
  };
  return aliases[id] || (ADMIN_SECTIONS.some((s) => s.id === id) ? id : "contact");
}

function setAdminHash(sectionId) {
  window.history.replaceState(null, "", `#admin-${sectionId}`);
}

export default function AdminPage() {
  const { store, loading, error, reloadStore } = useStore();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [msg, setMsg] = useState("");
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(() => sectionFromHash());

  useEffect(() => {
    const syncHash = () => setActiveSection(sectionFromHash());
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  function goSection(sectionId) {
    setActiveSection(sectionId);
    setAdminHash(sectionId);
  }

  function setupWatchPage() {
    const products = (draft || store)?.products || [];
    const defaults = products.filter((p) => /^wm\d+$/i.test(p.id)).map((p) => p.id);
    setDraft({ ...(draft || store), watchProductIds: defaults.length ? defaults : (draft || store)?.watchProductIds || [] });
    setMsg("Watch products loaded — এখন Save store click করুন।");
    goSection("watch");
  }

  async function login(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setMsg(data.error || "Login failed");
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setMsg("Logged in");
      if (!store) reloadStore();
    } catch {
      setMsg("API connect hoy nai. Terminal e npm run dev chaliye 8080 + 5173 check korun.");
    }
  }

  async function save() {
    const payload = draft || store;
    if (!payload) return setMsg("Store load hoy nai. Page refresh korun.");
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        setToken("");
        setDraft(null);
        setMsg("Session expired. Password diye abar login korun: admin123");
        return;
      }
      if (!res.ok) return setMsg(data.error || `Save failed (${res.status})`);
      setDraft(null);
      await reloadStore();
      setMsg("Saved to MongoDB");
    } catch {
      setMsg("Save fail — API/server check korun.");
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <div className="admin-panel admin-panel--login">
        <div className="admin-panel__login-card">
          <h1>Admin Panel</h1>
          <p className="admin-panel__lead">MongoDB store control — contact page, products, seller, cart.</p>
          <form onSubmit={login}>
            <label className="admin-panel__field">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="btn btn--primary admin-panel__login-btn">
              Login
            </button>
          </form>
          <p className="admin-panel__hint">Default password: <code>admin123</code></p>
          <p className="admin-panel__hint">
            URL: <a href="/admin">/admin</a> · Legacy: <a href="/admin/index.html">/admin/index.html</a>
          </p>
          {msg && <p className="admin-panel__msg">{msg}</p>}
          {loading && <p className="admin-panel__hint">Store loading…</p>}
          {!loading && error && (
            <p className="admin-panel__msg" style={{ color: "#c62828" }}>
              Store error: {error}. MongoDB + npm run dev check korun.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading && !store && !draft) {
    return (
      <div className="admin-panel admin-panel--login">
        <div className="admin-panel__login-card">
          <h1>Admin Panel</h1>
          <p className="admin-panel__lead">Store load hocche…</p>
          {error ? (
            <>
              <p className="admin-panel__msg" style={{ color: "#c62828" }}>{error}</p>
              <button type="button" className="btn btn--primary admin-panel__login-btn" onClick={reloadStore}>
                Retry
              </button>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  if (!store && !draft) {
    return (
      <div className="admin-panel admin-panel--login">
        <div className="admin-panel__login-card">
          <h1>Admin Panel</h1>
          <p className="admin-panel__msg" style={{ color: "#c62828" }}>
            Store load hoy nai. {error || "MongoDB connect korun, tarpor npm run seed"}
          </p>
          <button type="button" className="btn btn--primary admin-panel__login-btn" onClick={reloadStore}>
            Retry load store
          </button>
          <button
            type="button"
            className="admin-panel__ghost-btn"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => {
              localStorage.removeItem("adminToken");
              setToken("");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const s = draft || store;
  const contactMerged = mergeContactSettings(s.settings || {});

  function loadContactDefaults() {
    setDraft({
      ...s,
      settings: {
        ...s.settings,
        contact: { ...DEFAULT_CONTACT },
      },
    });
    setMsg("Contact defaults loaded — click Save store to write MongoDB.");
  }

  function updateShopEasy({ siteName, siteNameBn, phone, whatsapp, email } = {}) {
    const contactBase = { ...mergeContactSettings(s.settings), ...(s.settings?.contact || {}) };
    const en = siteName !== undefined ? String(siteName).trim() : s.settings?.siteName || contactBase.brandName || "";
    const bn = siteNameBn !== undefined ? String(siteNameBn).trim() || en : s.settings?.siteNameBn || contactBase.brandNameBn || en;
    const phoneVal = phone !== undefined ? String(phone).trim() : contactBase.phone || s.settings?.whatsapp || "";
    const whatsappVal = whatsapp !== undefined ? String(whatsapp).trim() : contactBase.whatsapp || s.settings?.whatsapp || phoneVal;
    const emailVal = email !== undefined ? String(email).trim() : contactBase.email || "";
    setDraft({
      ...s,
      settings: {
        ...s.settings,
        siteName: en,
        siteNameBn: bn,
        whatsapp: whatsappVal,
        contact: {
          ...contactBase,
          ...s.settings?.contact,
          brandName: en,
          brandNameBn: bn,
          headline: en,
          headlineBn: bn,
          copyrightName: en,
          phone: phoneVal,
          whatsapp: whatsappVal,
          email: emailVal,
        },
      },
    });
  }

  function updateProduct(id, patch) {
    setDraft({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  }

  const headphoneProducts = (s.landingProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const tshirtProducts = (s.tshirtProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const watchProducts = (s.watchProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const smartwatchProducts = (s.smartwatchProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const brazilJerseyProducts = (s.brazilJerseyProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const argentinaJerseyProducts = (s.argentinaJerseyProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const portugalJerseyProducts = (s.portugalJerseyProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const spinJerseyProducts = (s.spinJerseyProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const bikeStickerProducts = (s.bikeStickerProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const bikeStickerPaperProducts = (s.bikeStickerPaperFullBodyBlackProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const shoesForMenProducts = (s.shoesForMenProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const shoesForMenHighQualityProducts = (s.shoesForMenHighQualityProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const shoesForGirlsProducts = (s.shoesForGirlsProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const shoesForGirlsSneakersProducts = (s.shoesForGirlsSneakersProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const shoesForGirlsSneakersBlackProducts = (s.shoesForGirlsSneakersBlackProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const shoesForGirlsSneakersBlackAndWhiteProducts = (s.shoesForGirlsSneakersBlackAndWhiteProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  const braProducts = (s.braProductIds || [])
    .map((id) => s.products?.find((p) => p.id === id))
    .filter(Boolean);

  function ProductImageEditor({ products, title }) {
    if (!products.length) return null;
    return (
      <>
        <h4 style={{ marginTop: "1rem" }}>{title}</h4>
        <p style={{ color: "#757575", fontSize: "0.88rem" }}>Image URL পরিবর্তন করুন → <strong>Save store</strong>. Checkbox দিয়ে page-এ show/hide।</p>
        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          {products.map((p) => (
            <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <img
                src={p.imageUrl || ""}
                alt=""
                width={64}
                height={64}
                style={{ objectFit: "cover", borderRadius: 6, background: "#f5f5f5", flexShrink: 0 }}
                onError={(e) => { e.target.style.opacity = "0.35"; }}
              />
              <label style={{ flex: 1, fontSize: "0.88rem" }}>
                <strong>{p.id}</strong> — {p.name.slice(0, 60)}{p.name.length > 60 ? "…" : ""}
                <input
                  type="url"
                  value={p.imageUrl || ""}
                  placeholder="https://… image URL"
                  onChange={(e) => {
                    const url = e.target.value;
                    updateProduct(p.id, { imageUrl: url, imageGallery: url ? [url] : [] });
                  }}
                  style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
                />
              </label>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel__header">
        <div>
          <h1>Admin Panel</h1>
          <p>Contact page, seller, cart, catalog products — save to MongoDB.</p>
        </div>
        <div className="admin-panel__header-actions">
          <a href="/contact" target="_blank" rel="noreferrer" className="admin-panel__preview-link">
            Contact preview
          </a>
          <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save store"}
          </button>
          <button type="button" className="admin-panel__ghost-btn" onClick={() => setDraft(JSON.parse(JSON.stringify(store)))}>
            Reset draft
          </button>
          <button
            type="button"
            className="admin-panel__ghost-btn"
            onClick={() => {
              localStorage.removeItem("adminToken");
              setToken("");
              setDraft(null);
              setMsg("Logged out");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {msg && <p className="admin-panel__msg admin-panel__msg--bar">{msg}</p>}

      <nav className="admin-panel__nav" aria-label="Admin sections">
        {ADMIN_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`admin-panel__nav-btn${activeSection === section.id ? " is-active" : ""}`}
            onClick={() => goSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className={`admin-panel__body admin-panel__body--${activeSection}`}>
      <div className="admin-panel__quick">
        <strong>Quick (easy)</strong>
        <div className="admin-panel__quick-actions">
          {activeSection !== "contact" ? (
            <button type="button" className="admin-panel__ghost-btn" onClick={() => goSection("contact")}>
              Shop name / phone
            </button>
          ) : null}
          <button type="button" className="admin-panel__ghost-btn" onClick={setupWatchPage}>
            Setup Watch page
          </button>
          <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save store"}
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="admin-panel__preview-link">Site</a>
          <a href="/watch" target="_blank" rel="noreferrer" className="admin-panel__preview-link">Watch</a>
          <a href="/contact" target="_blank" rel="noreferrer" className="admin-panel__preview-link">Contact</a>
        </div>
      </div>
      {activeSection !== "contact" ? (
        <p className="admin-panel__note">
          Full legacy admin: <code>/admin/index.html</code> · Tab change korle shudhu oi section dekhabe.
        </p>
      ) : null}

      <div data-admin-tab="topbar">
      <h3 id="admin-topbar" style={{ marginTop: "1.5rem" }}>Top bar — Daraz header links</h3>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginTop: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={s.settings?.topBar?.enabled !== false}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  topBar: { ...s.settings?.topBar, enabled: e.target.checked },
                },
              })
            }
          />
          Show top bar
        </label>
        <label>
          <input
            type="checkbox"
            checked={s.settings?.topBar?.showLanguage !== false}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  topBar: { ...s.settings?.topBar, showLanguage: e.target.checked },
                },
              })
            }
          />
          Show language switch (EN / বাং)
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Language label (EN)
          <input
            type="text"
            value={s.settings?.topBar?.languageLabel || "Change Language"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  topBar: { ...s.settings?.topBar, languageLabel: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Language label (BN)
          <input
            type="text"
            value={s.settings?.topBar?.languageLabelBn || "ভাষা"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  topBar: { ...s.settings?.topBar, languageLabelBn: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>

      <h4 style={{ marginTop: "1rem" }}>Top links ({(s.settings?.headerLinks || []).length})</h4>
      {(s.settings?.headerLinks || []).map((link, i) => (
        <div key={link.id || i} style={{ display: "grid", gap: 6, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
          <label>
            <input
              type="checkbox"
              checked={link.active !== false}
              onChange={(e) => {
                const headerLinks = [...(s.settings?.headerLinks || [])];
                headerLinks[i] = { ...link, active: e.target.checked };
                setDraft({ ...s, settings: { ...s.settings, headerLinks } });
              }}
            />
            Show link
          </label>
          <input
            type="text"
            value={link.label || ""}
            placeholder="Label EN"
            onChange={(e) => {
              const headerLinks = [...(s.settings?.headerLinks || [])];
              headerLinks[i] = { ...link, label: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, headerLinks } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={link.labelBn || ""}
            placeholder="Label BN"
            onChange={(e) => {
              const headerLinks = [...(s.settings?.headerLinks || [])];
              headerLinks[i] = { ...link, labelBn: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, headerLinks } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={link.href || ""}
            placeholder="Link (/help, /services…)"
            onChange={(e) => {
              const headerLinks = [...(s.settings?.headerLinks || [])];
              headerLinks[i] = { ...link, href: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, headerLinks } });
            }}
            style={{ padding: "6px 8px" }}
          />
        </div>
      ))}

      <h4 style={{ marginTop: "1rem" }}>Catalog links page ({(s.settings?.headerHotSearchLinks || []).length}) — <a href="/catalog-links" target="_blank" rel="noreferrer">preview</a></h4>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        <strong>/catalog-links</strong> page-এ Daraz-style catalog shortcut links দেখায় — label, URL, show/hide এখান থেকে control করুন।
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Page title (EN)
          <input
            type="text"
            value={s.settings?.catalogLinksPageTitle || "Catalog Pages"}
            onChange={(e) => setDraft({ ...s, settings: { ...s.settings, catalogLinksPageTitle: e.target.value } })}
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title (BN)
          <input
            type="text"
            value={s.settings?.catalogLinksPageTitleBn || "ক্যাটালগ পেজ"}
            onChange={(e) => setDraft({ ...s, settings: { ...s.settings, catalogLinksPageTitleBn: e.target.value } })}
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page intro (EN)
          <input
            type="text"
            value={s.settings?.catalogLinksPageIntro || "Daraz-style catalog shortcuts — click any link to open its catalog page."}
            onChange={(e) => setDraft({ ...s, settings: { ...s.settings, catalogLinksPageIntro: e.target.value } })}
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page intro (BN)
          <input
            type="text"
            value={s.settings?.catalogLinksPageIntroBn || "Daraz-style catalog shortcuts — যেকোনো link-এ ক্লিক করে catalog page-এ যান।"}
            onChange={(e) => setDraft({ ...s, settings: { ...s.settings, catalogLinksPageIntroBn: e.target.value } })}
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      {(s.settings?.headerHotSearchLinks || []).map((link, i) => (
        <div key={link.id || i} style={{ display: "grid", gap: 6, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
          <label>
            <input
              type="checkbox"
              checked={link.active !== false}
              onChange={(e) => {
                const headerHotSearchLinks = [...(s.settings?.headerHotSearchLinks || [])];
                headerHotSearchLinks[i] = { ...link, active: e.target.checked };
                setDraft({ ...s, settings: { ...s.settings, headerHotSearchLinks } });
              }}
            />
            Show link
          </label>
          <input
            type="text"
            value={link.label || ""}
            placeholder="Label EN"
            onChange={(e) => {
              const headerHotSearchLinks = [...(s.settings?.headerHotSearchLinks || [])];
              headerHotSearchLinks[i] = { ...link, label: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, headerHotSearchLinks } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={link.labelBn || ""}
            placeholder="Label BN"
            onChange={(e) => {
              const headerHotSearchLinks = [...(s.settings?.headerHotSearchLinks || [])];
              headerHotSearchLinks[i] = { ...link, labelBn: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, headerHotSearchLinks } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={link.to || ""}
            placeholder="Link (/tshirt, /catalog?q=shoes%20for%20girls…)"
            onChange={(e) => {
              const headerHotSearchLinks = [...(s.settings?.headerHotSearchLinks || [])];
              headerHotSearchLinks[i] = { ...link, to: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, headerHotSearchLinks } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <button
            type="button"
            className="admin-panel__ghost-btn"
            style={{ justifySelf: "start" }}
            onClick={() => {
              const headerHotSearchLinks = (s.settings?.headerHotSearchLinks || []).filter((_, idx) => idx !== i);
              setDraft({ ...s, settings: { ...s.settings, headerHotSearchLinks } });
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn--primary"
        style={{ marginTop: 8 }}
        onClick={() => {
          const headerHotSearchLinks = [...(s.settings?.headerHotSearchLinks || [])];
          headerHotSearchLinks.push({
            id: `hhs-${Date.now()}`,
            label: "new catalog link",
            labelBn: "নতুন লিংক",
            to: "/catalog?q=",
            active: true,
          });
          setDraft({ ...s, settings: { ...s.settings, headerHotSearchLinks } });
        }}
      >
        + Add catalog link
      </button>

      <h4 style={{ marginTop: "0.5rem" }}>Auth links (LOGIN / SIGN UP)</h4>
      {(s.settings?.topBar?.authLinks || []).map((link, i) => (
        <div key={link.id || i} style={{ display: "grid", gap: 6, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
          <label>
            <input
              type="checkbox"
              checked={link.active !== false}
              onChange={(e) => {
                const authLinks = [...(s.settings?.topBar?.authLinks || [])];
                authLinks[i] = { ...link, active: e.target.checked };
                setDraft({
                  ...s,
                  settings: { ...s.settings, topBar: { ...s.settings?.topBar, authLinks } },
                });
              }}
            />
            Show link
          </label>
          <input
            type="text"
            value={link.label || ""}
            placeholder="Label EN"
            onChange={(e) => {
              const authLinks = [...(s.settings?.topBar?.authLinks || [])];
              authLinks[i] = { ...link, label: e.target.value };
              setDraft({
                ...s,
                settings: { ...s.settings, topBar: { ...s.settings?.topBar, authLinks } },
              });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={link.href || ""}
            placeholder="Link (/login, /signup…)"
            onChange={(e) => {
              const authLinks = [...(s.settings?.topBar?.authLinks || [])];
              authLinks[i] = { ...link, href: e.target.value };
              setDraft({
                ...s,
                settings: { ...s.settings, topBar: { ...s.settings?.topBar, authLinks } },
              });
            }}
            style={{ padding: "6px 8px" }}
          />
        </div>
      ))}

      <h4 style={{ marginTop: "0.5rem" }}>SAVE MORE ON APP — Download popup</h4>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Hover/click on <strong>SAVE MORE ON APP</strong> shows QR code + App Store / Google Play buttons.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720 }}>
        <label>
          <input
            type="checkbox"
            checked={s.settings?.topBar?.appDownload?.enabled !== false}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  topBar: {
                    ...s.settings?.topBar,
                    appDownload: { ...s.settings?.topBar?.appDownload, enabled: e.target.checked },
                  },
                },
              })
            }
          />
          Show download popup on SAVE MORE ON APP
        </label>
        {[
          ["title", "Popup title (EN)", "Download the App"],
          ["titleBn", "Popup title (BN)", "অ্যাপ ডাউনলোড করুন"],
          ["qrCodeUrl", "QR code image URL (empty = auto from download URL)", ""],
          ["downloadUrl", "App download URL (for QR code)", "https://play.google.com/store/apps/details?id=com.daraz.android"],
          ["appStoreHref", "App Store link", "https://apps.apple.com/"],
          ["appStoreImage", "App Store badge image", "/assets/payments/appstore.svg"],
          ["playStoreHref", "Google Play link", "https://play.google.com/store/apps/details?id=com.daraz.android"],
          ["playStoreImage", "Google Play badge image", "/assets/payments/playstore.svg"],
        ].map(([key, label, fallback]) => (
          <label key={key} style={{ fontSize: "0.88rem" }}>
            {label}
            <input
              type="text"
              value={s.settings?.topBar?.appDownload?.[key] ?? fallback}
              onChange={(e) =>
                setDraft({
                  ...s,
                  settings: {
                    ...s.settings,
                    topBar: {
                      ...s.settings?.topBar,
                      appDownload: { ...s.settings?.topBar?.appDownload, [key]: e.target.value },
                    },
                  },
                })
              }
              style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
            />
          </label>
        ))}
      </div>
      </div>

      <div data-admin-tab="seller">
      <h3 id="admin-seller" style={{ marginTop: "1.5rem" }}>Become a Seller page — <a href="/seller" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Grey Daraz Seller Center header + seller landing. Top link <strong>BECOME A SELLER</strong> should point to <code>/seller</code>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginTop: 8 }}>
        {[
          ["brandName", "Brand name (EN)", "Daraz Seller Center"],
          ["brandNameBn", "Brand name (BN)", "Daraz Seller Center"],
          ["logoUrl", "Logo URL (optional)", ""],
          ["heroTitle", "Hero title (EN)", "Start Selling on Daraz"],
          ["heroTitleBn", "Hero title (BN)", "Daraz-এ বিক্রি শুরু করুন"],
          ["heroSubtitle", "Hero subtitle (EN)", ""],
          ["heroSubtitleBn", "Hero subtitle (BN)", ""],
          ["heroImageUrl", "Hero image URL", ""],
          ["ctaText", "CTA button (EN)", "Register Now"],
          ["ctaTextBn", "CTA button (BN)", "এখনই রেজিস্টার করুন"],
          ["ctaHref", "CTA link", "#seller-register"],
          ["featuresTitle", "Features section title (EN)", "Why sell on Daraz"],
          ["featuresTitleBn", "Features section title (BN)", ""],
          ["stepsTitle", "Steps section title (EN)", "How to get started"],
          ["stepsTitleBn", "Steps section title (BN)", ""],
          ["formTitle", "Form title (EN)", "Seller registration"],
          ["formTitleBn", "Form title (BN)", "সেলার রেজিস্ট্রেশন"],
        ].map(([key, label, fallback]) => (
          <label key={key} style={{ fontSize: "0.88rem" }}>
            {label}
            <input
              type="text"
              value={s.settings?.seller?.[key] ?? fallback}
              onChange={(e) =>
                setDraft({
                  ...s,
                  settings: {
                    ...s.settings,
                    seller: { ...s.settings?.seller, [key]: e.target.value },
                  },
                })
              }
              style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
            />
          </label>
        ))}
        <label style={{ fontSize: "0.88rem" }}>
          Default country ID
          <input
            type="text"
            value={s.settings?.seller?.defaultCountry || "bd"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  seller: { ...s.settings?.seller, defaultCountry: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        {[
          ["features", "Features (EN) — one per line"],
          ["featuresBn", "Features (BN) — one per line"],
          ["steps", "Steps (EN) — one per line"],
          ["stepsBn", "Steps (BN) — one per line"],
        ].map(([key, label]) => (
          <label key={key} style={{ fontSize: "0.88rem" }}>
            {label}
            <textarea
              rows={4}
              value={(s.settings?.seller?.[key] || []).join("\n")}
              onChange={(e) =>
                setDraft({
                  ...s,
                  settings: {
                    ...s.settings,
                    seller: {
                      ...s.settings?.seller,
                      [key]: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
                    },
                  },
                })
              }
              style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px", fontFamily: "inherit" }}
            />
          </label>
        ))}
      </div>
      <h4 style={{ marginTop: "1rem" }}>Countries ({(s.settings?.seller?.countries || []).length})</h4>
      {(s.settings?.seller?.countries || []).map((c, i) => (
        <div key={c.id || i} style={{ display: "grid", gap: 6, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #eee", maxWidth: 720 }}>
          <input
            type="text"
            value={c.id || ""}
            placeholder="ID (bd, pk…)"
            onChange={(e) => {
              const countries = [...(s.settings?.seller?.countries || [])];
              countries[i] = { ...c, id: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, seller: { ...s.settings?.seller, countries } } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={c.name || ""}
            placeholder="Name EN"
            onChange={(e) => {
              const countries = [...(s.settings?.seller?.countries || [])];
              countries[i] = { ...c, name: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, seller: { ...s.settings?.seller, countries } } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={c.nameBn || ""}
            placeholder="Name BN"
            onChange={(e) => {
              const countries = [...(s.settings?.seller?.countries || [])];
              countries[i] = { ...c, nameBn: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, seller: { ...s.settings?.seller, countries } } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={c.flagCode || ""}
            placeholder="Flag code (bd, pk…)"
            onChange={(e) => {
              const countries = [...(s.settings?.seller?.countries || [])];
              countries[i] = { ...c, flagCode: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, seller: { ...s.settings?.seller, countries } } });
            }}
            style={{ padding: "6px 8px" }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setDraft({
            ...s,
            settings: {
              ...s.settings,
              seller: {
                ...s.settings?.seller,
                countries: [...(s.settings?.seller?.countries || []), { id: "new", name: "Country", nameBn: "", flagCode: "bd" }],
              },
            },
          })
        }
      >
        Add country
      </button>

      <h4 style={{ marginTop: "1rem" }}>Languages ({(s.settings?.seller?.languages || []).length})</h4>
      {(s.settings?.seller?.languages || []).map((l, i) => (
        <div key={l.id || i} style={{ display: "grid", gap: 6, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #eee", maxWidth: 720 }}>
          <input
            type="text"
            value={l.id || ""}
            placeholder="ID (en, bn…)"
            onChange={(e) => {
              const languages = [...(s.settings?.seller?.languages || [])];
              languages[i] = { ...l, id: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, seller: { ...s.settings?.seller, languages } } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={l.label || ""}
            placeholder="Label EN"
            onChange={(e) => {
              const languages = [...(s.settings?.seller?.languages || [])];
              languages[i] = { ...l, label: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, seller: { ...s.settings?.seller, languages } } });
            }}
            style={{ padding: "6px 8px" }}
          />
          <input
            type="text"
            value={l.labelBn || ""}
            placeholder="Label BN"
            onChange={(e) => {
              const languages = [...(s.settings?.seller?.languages || [])];
              languages[i] = { ...l, labelBn: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, seller: { ...s.settings?.seller, languages } } });
            }}
            style={{ padding: "6px 8px" }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setDraft({
            ...s,
            settings: {
              ...s.settings,
              seller: {
                ...s.settings?.seller,
                languages: [...(s.settings?.seller?.languages || []), { id: "en", label: "English" }],
              },
            },
          })
        }
      >
        Add language
      </button>
      </div>

      <div data-admin-tab="sidebar-categories">
      <h3 id="admin-sidebar-categories" style={{ marginTop: "1.5rem" }}>Search sidebar categories ({s.sidebarCategoryIds?.length || 0})</h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Catalog/search page-এর বাম sidebar <strong>Category</strong> list — checkbox দিয়ে show/hide। Order = উপর থেকে নিচে।
      </p>
      <div className="check-grid" style={{ maxWidth: 960 }}>
        {s.categories?.map((cat) => (
          <label key={`sidebar-cat-${cat.id}`}>
            <input
              type="checkbox"
              checked={s.sidebarCategoryIds?.includes(cat.id)}
              onChange={(e) => {
                const ids = new Set(s.sidebarCategoryIds || []);
                e.target.checked ? ids.add(cat.id) : ids.delete(cat.id);
                setDraft({ ...s, sidebarCategoryIds: [...ids] });
              }}
            />
            {cat.name}
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        <button
          type="button"
          className="admin-panel__ghost-btn"
          onClick={() =>
            setDraft({
              ...s,
              sidebarCategoryIds: [
                "shoes",
                "apparel",
                "sportswear",
                "sports",
                "smartwatches",
                "smartwatch-straps",
                "smartwatch-docks",
                "smartwatch-protectors",
                "smartwatch-cases",
                "phone-cases",
                "phone-protectors",
                "fitness-trackers",
                "wall-chargers",
                "phone-cables",
                "smartphone",
                "watch-accessories",
                "tablet-cases",
                "camera-protectors",
                "electronics",
                "eyewear",
                "jewelry",
                "beauty",
                "personal-care",
                "health",
                "kids",
                "luggage",
                "home-garden",
                "furniture",
                "lighting",
                "appliances",
                "auto-supplies",
                "vehicle-parts",
                "tools",
                "safety",
                "food",
                "pets",
                "office",
                "gifts",
                "ent-care",
                "hoses-pipes",
                "water-systems",
                "coolers",
                "packaging",
                "industrial",
                "agriculture",
              ].filter((id) => s.categories?.some((c) => c.id === id)),
            })
          }
        >
          Load all default sidebar categories
        </button>
        <button type="button" className="admin-panel__ghost-btn" onClick={() => setDraft({ ...s, sidebarCategoryIds: [] })}>
          Clear sidebar categories
        </button>
      </div>
      </div>

      <div data-admin-tab="contact">
      <h3 id="admin-contact" style={{ marginTop: "0.5rem" }}>Shop settings (easy)</h3>
      <p className="admin-panel__easy-steps">
        ① নিচে ৫টা box পূরণ করুন → ② <strong>Save store</strong> → ③ <a href="/contact" target="_blank" rel="noreferrer">Contact page</a> check করুন
      </p>
      <div className="admin-panel__easy-box">
        <label style={{ fontSize: "0.88rem" }}>
          Shop name (English)
          <input type="text" value={s.settings?.siteName || ""} placeholder="E-commerce Website" onChange={(e) => updateShopEasy({ siteName: e.target.value, siteNameBn: s.settings?.siteNameBn })} style={{ display: "block", width: "100%", marginTop: 4, padding: "8px 10px" }} />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Shop name (Bangla)
          <input type="text" value={s.settings?.siteNameBn || ""} placeholder="ই-কমার্স ওয়েবসাইট" onChange={(e) => updateShopEasy({ siteName: s.settings?.siteName, siteNameBn: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "8px 10px" }} />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Phone
          <input type="text" value={s.settings?.contact?.phone ?? contactMerged.phone ?? s.settings?.whatsapp ?? ""} placeholder="01343787983" onChange={(e) => updateShopEasy({ phone: e.target.value, whatsapp: s.settings?.contact?.whatsapp ?? contactMerged.whatsapp ?? e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "8px 10px" }} />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          WhatsApp number
          <input type="text" value={s.settings?.contact?.whatsapp ?? contactMerged.whatsapp ?? s.settings?.whatsapp ?? ""} placeholder="01343787983" onChange={(e) => updateShopEasy({ whatsapp: e.target.value, phone: s.settings?.contact?.phone ?? contactMerged.phone ?? e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "8px 10px" }} />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Email
          <input type="email" value={s.settings?.contact?.email ?? contactMerged.email ?? ""} placeholder="support@ecommerce-demo.com" onChange={(e) => updateShopEasy({ email: e.target.value })} style={{ display: "block", width: "100%", marginTop: 4, padding: "8px 10px" }} />
        </label>
        <div className="admin-panel__easy-actions">
          <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save store"}</button>
          <a href="/contact" target="_blank" rel="noreferrer" className="admin-panel__preview-link">Contact preview</a>
          <a href="/" target="_blank" rel="noreferrer" className="admin-panel__preview-link">Site</a>
        </div>
      </div>

      <details className="admin-panel__more">
        <summary>Advanced contact options (optional)</summary>
      <h3 id="admin-contact-more" style={{ marginTop: "1rem" }}>Contact page — <a href="/contact" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Extra contact text, map, footer links — উপরে <strong>Shop settings (easy)</strong> দিয়ে name/phone/WhatsApp/email already set থাকে।
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <button type="button" className="admin-panel__ghost-btn" onClick={loadContactDefaults}>
          Load contact defaults
        </button>
      </div>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginTop: 8 }}>
        {[
          ["brandName", "Brand name (EN)", "IoT Programmers"],
          ["brandNameBn", "Brand name (BN)", "IoT Programmers"],
          ["eyebrow", "Eyebrow (EN)", "CONTACT"],
          ["eyebrowBn", "Eyebrow (BN)", "যোগাযোগ"],
          ["headline", "Headline (EN)", "IoT Programmers"],
          ["headlineBn", "Headline (BN)", "IoT Programmers"],
          ["subtitle", "Subtitle (EN)", "Get in touch. We respond fast."],
          ["subtitleBn", "Subtitle (BN)", ""],
          ["intro", "Intro paragraph (EN)", ""],
          ["introBn", "Intro paragraph (BN)", ""],
          ["whatsappButton", "WhatsApp button (EN)", "WhatsApp Us"],
          ["whatsappButtonBn", "WhatsApp button (BN)", "WhatsApp করুন"],
          ["callButton", "Call button prefix (EN)", "Call"],
          ["callButtonBn", "Call button prefix (BN)", "কল করুন"],
          ["phone", "Phone (Call button)", "01302003306"],
          ["whatsapp", "WhatsApp number", "01302003306"],
          ["whatsappMessage", "WhatsApp pre-filled message (EN)", ""],
          ["whatsappMessageBn", "WhatsApp pre-filled message (BN)", ""],
          ["email", "Email", "iotprogrammers@gmail.com"],
          ["addressLine1", "Address line 1 (EN)", "Gopalganj, Bangladesh"],
          ["addressLine1Bn", "Address line 1 (BN)", "গোপালগঞ্জ, বাংলাদেশ"],
          ["addressLine2", "Address line 2 (EN)", "Dhaka Division"],
          ["addressLine2Bn", "Address line 2 (BN)", "ঢাকা বিভাগ"],
          ["addressLine3", "Address line 3 (EN)", ""],
          ["addressLine3Bn", "Address line 3 (BN)", ""],
          ["tagline", "Footer tagline (EN)", "MERN Portfolio · Demo Websites · WhatsApp Leads"],
          ["taglineBn", "Footer tagline (BN)", ""],
          ["description", "Footer description (EN)", ""],
          ["descriptionBn", "Footer description (BN)", ""],
          ["copyrightName", "Copyright name", "IoTProgrammers"],
          ["linksTitle", "Links column title (EN)", "Links"],
          ["linksTitleBn", "Links column title (BN)", "লিংক"],
          ["contactTitle", "Contact column title (EN)", "Contact"],
          ["contactTitleBn", "Contact column title (BN)", "যোগাযোগ"],
          ["whatsappNowLabel", "WhatsApp Now label (EN)", "WhatsApp Now"],
          ["whatsappNowLabelBn", "WhatsApp Now label (BN)", "এখনই WhatsApp"],
          ["legalTitle", "Legal column title (EN)", "Legal"],
          ["legalTitleBn", "Legal column title (BN)", "আইনি"],
          ["servicesTitle", "Services column title (EN)", "Services"],
          ["servicesTitleBn", "Services column title (BN)", "সেবা"],
          ["facebookLabel", "Facebook link label (EN)", "Facebook Page"],
          ["facebookLabelBn", "Facebook link label (BN)", "Facebook পেজ"],
          ["facebookHref", "Facebook URL", "https://www.facebook.com/"],
          ["productGridTitle", "Product grid title (EN)", "Just For You"],
          ["productGridTitleBn", "Product grid title (BN)", "আপনার জন্য"],
          ["loadMore", "Load more button (EN)", "LOAD MORE"],
          ["loadMoreBn", "Load more button (BN)", "আরও দেখুন"],
          ["mapQuery", "Google Map location query", "Natore Sadar Bangladesh"],
          ["mapZoom", "Google Map zoom (1–20)", "12"],
          ["mapTitle", "Map iframe title (EN)", "map"],
          ["mapTitleBn", "Map iframe title (BN)", "মানচিত্র"],
        ].map(([key, label, fallback]) => (
          <label key={key} style={{ fontSize: "0.88rem" }}>
            {label}
            <input
              type="text"
              value={(s.settings?.contact?.[key] ?? contactMerged[key] ?? fallback) || ""}
              onChange={(e) =>
                setDraft({
                  ...s,
                  settings: {
                    ...s.settings,
                    contact: { ...contactMerged, ...s.settings?.contact, [key]: e.target.value },
                  },
                })
              }
              style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
            />
          </label>
        ))}
        {[
          ["services", "Services (EN) — one per line"],
          ["servicesBn", "Services (BN) — one per line"],
        ].map(([key, label]) => (
          <label key={key} style={{ fontSize: "0.88rem" }}>
            {label}
            <textarea
              rows={4}
              value={((s.settings?.contact?.[key]?.length ? s.settings.contact[key] : contactMerged[key]) || []).join("\n")}
              onChange={(e) =>
                setDraft({
                  ...s,
                  settings: {
                    ...s.settings,
                    contact: {
                      ...contactMerged,
                      ...s.settings?.contact,
                      [key]: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
                    },
                  },
                })
              }
              style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px", fontFamily: "inherit" }}
            />
          </label>
        ))}
        <label style={{ fontSize: "0.88rem" }}>
          <input
            type="checkbox"
            checked={(s.settings?.contact?.showMap ?? contactMerged.showMap) !== false}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  contact: { ...contactMerged, ...s.settings?.contact, showMap: e.target.checked },
                },
              })
            }
          />
          Show Google Map on contact page
        </label>
        {(s.settings?.contact?.showMap ?? contactMerged.showMap) !== false ? (
          <p style={{ color: "#757575", fontSize: "0.82rem", margin: 0 }}>
            Preview embed:{" "}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.settings?.contact?.mapQuery || contactMerged.mapQuery || "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </p>
        ) : null}
      </div>

      <h4 style={{ marginTop: "1rem" }}>Nav links ({(s.settings?.contact?.links?.length ? s.settings.contact.links : contactMerged.links).length})</h4>
      {(s.settings?.contact?.links?.length ? s.settings.contact.links : contactMerged.links).map((item, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginBottom: 8, maxWidth: 720 }}>
          <input
            placeholder="Label EN"
            value={item.label || ""}
            onChange={(e) => {
              const links = [...(s.settings?.contact?.links || [])];
              links[i] = { ...links[i], label: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, links } } });
            }}
          />
          <input
            placeholder="Label BN"
            value={item.labelBn || ""}
            onChange={(e) => {
              const links = [...(s.settings?.contact?.links || [])];
              links[i] = { ...links[i], labelBn: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, links } } });
            }}
          />
          <input
            placeholder="Href"
            value={item.href || ""}
            onChange={(e) => {
              const links = [...(s.settings?.contact?.links || [])];
              links[i] = { ...links[i], href: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, links } } });
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={item.active !== false}
              onChange={(e) => {
                const links = [...(s.settings?.contact?.links || [])];
                links[i] = { ...links[i], active: e.target.checked };
                setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, links } } });
              }}
            />
            On
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setDraft({
            ...s,
            settings: {
              ...s.settings,
              contact: {
                ...s.settings?.contact,
                links: [...(s.settings?.contact?.links || []), { label: "New link", labelBn: "", href: "/", active: true }],
              },
            },
          })
        }
      >
        Add link
      </button>

      <h4 style={{ marginTop: "1rem" }}>Legal links ({(s.settings?.contact?.legalLinks?.length ? s.settings.contact.legalLinks : contactMerged.legalLinks).length})</h4>
      {(s.settings?.contact?.legalLinks?.length ? s.settings.contact.legalLinks : contactMerged.legalLinks).map((item, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginBottom: 8, maxWidth: 720 }}>
          <input
            placeholder="Label EN"
            value={item.label || ""}
            onChange={(e) => {
              const legalLinks = [...(s.settings?.contact?.legalLinks || [])];
              legalLinks[i] = { ...legalLinks[i], label: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, legalLinks } } });
            }}
          />
          <input
            placeholder="Label BN"
            value={item.labelBn || ""}
            onChange={(e) => {
              const legalLinks = [...(s.settings?.contact?.legalLinks || [])];
              legalLinks[i] = { ...legalLinks[i], labelBn: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, legalLinks } } });
            }}
          />
          <input
            placeholder="Href"
            value={item.href || ""}
            onChange={(e) => {
              const legalLinks = [...(s.settings?.contact?.legalLinks || [])];
              legalLinks[i] = { ...legalLinks[i], href: e.target.value };
              setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, legalLinks } } });
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={item.active !== false}
              onChange={(e) => {
                const legalLinks = [...(s.settings?.contact?.legalLinks || [])];
                legalLinks[i] = { ...legalLinks[i], active: e.target.checked };
                setDraft({ ...s, settings: { ...s.settings, contact: { ...s.settings?.contact, legalLinks } } });
              }}
            />
            On
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setDraft({
            ...s,
            settings: {
              ...s.settings,
              contact: {
                ...s.settings?.contact,
                legalLinks: [...(s.settings?.contact?.legalLinks || []), { label: "New policy", labelBn: "", href: "/privacy", active: true }],
              },
            },
          })
        }
      >
        Add legal link
      </button>

      <h4 style={{ marginTop: "1.25rem" }}>Contact page — Just For You grid ({s.contactProductIds?.length || 0})</h4>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style product cards on <strong>/contact</strong> (hero + footer er majhe). Empty hole home products fallback hobe.
      </p>
      <label style={{ display: "block", marginTop: 8, fontSize: "0.88rem" }}>
        <input
          type="checkbox"
          checked={(s.settings?.contact?.showProductGrid ?? contactMerged.showProductGrid) !== false}
          onChange={(e) =>
            setDraft({
              ...s,
              settings: {
                ...s.settings,
                contact: { ...contactMerged, ...s.settings?.contact, showProductGrid: e.target.checked },
              },
            })
          }
        />
        Show product grid on contact page
      </label>
      <div className="check-grid" style={{ marginTop: 8 }}>
        {s.products?.filter((p) => p.active !== false).slice(0, 120).map((p) => (
          <label key={`contact-${p.id}`}>
            <input
              type="checkbox"
              checked={s.contactProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.contactProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, contactProductIds: [...ids] });
              }}
            />
            {p.name.slice(0, 48)}{p.name.length > 48 ? "…" : ""}
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <button
          type="button"
          className="admin-panel__ghost-btn"
          onClick={() => setDraft({ ...s, contactProductIds: [...(s.homeProductIds || [])] })}
        >
          Copy from Home products
        </button>
        <button type="button" className="admin-panel__ghost-btn" onClick={() => setDraft({ ...s, contactProductIds: [] })}>
          Clear contact products
        </button>
      </div>
      </details>
      </div>

      <div data-admin-tab="cart">
      <h3 id="admin-cart" style={{ marginTop: "1.5rem" }}>Cart — header icon &amp; cart page</h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style cart icon in header. Preview: <a href="/cart" target="_blank" rel="noreferrer">/cart</a>
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 640, marginTop: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={s.settings?.cart?.enabled !== false}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  cart: { ...s.settings?.cart, enabled: e.target.checked },
                },
              })
            }
          />
          Show cart icon in header
        </label>
        <label>
          <input
            type="checkbox"
            checked={s.settings?.cart?.showBadge !== false}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  cart: { ...s.settings?.cart, showBadge: e.target.checked },
                },
              })
            }
          />
          Show item count badge
        </label>
        <label>
          <input
            type="checkbox"
            checked={s.settings?.cart?.checkoutEnabled !== false}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  cart: { ...s.settings?.cart, checkoutEnabled: e.target.checked },
                },
              })
            }
          />
          Show checkout button on cart page
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Cart link path
          <input
            type="text"
            value={s.settings?.cart?.linkPath || "/cart"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  cart: { ...s.settings?.cart, linkPath: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Continue shopping path
          <input
            type="text"
            value={s.settings?.cart?.continueShoppingPath || "/"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  cart: { ...s.settings?.cart, continueShoppingPath: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Empty cart message (EN)
          <input
            type="text"
            value={s.settings?.cart?.emptyMessage || "Your cart is empty."}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  cart: { ...s.settings?.cart, emptyMessage: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Empty cart message (BN)
          <input
            type="text"
            value={s.settings?.cart?.emptyMessageBn || "আপনার কার্ট খালি।"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  cart: { ...s.settings?.cart, emptyMessageBn: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      </div>

      <div data-admin-tab="home">
      <h3 id="admin-home" style={{ marginTop: "1.5rem" }}>Home page — <a href="/" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>Daraz-style banners, flash sale, category strip &amp; Just For You grid.</p>
      <div style={{ display: "grid", gap: 8, maxWidth: 640, marginTop: 8 }}>
        {[
          ["showBanner", "Hero banner carousel"],
          ["showFlashSale", "Flash Sale section"],
          ["showCategoryStrip", "Category icon strip"],
          ["showCategoriesGrid", "Categories image grid"],
          ["showJustForYou", "Just For You product grid"],
        ].map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={s.settings?.home?.[key] !== false}
              onChange={(e) =>
                setDraft({
                  ...s,
                  settings: {
                    ...s.settings,
                    home: { ...s.settings?.home, [key]: e.target.checked },
                  },
                })
              }
            />
            {label}
          </label>
        ))}
        <label style={{ fontSize: "0.88rem" }}>
          Promo banner image URL (secondary strip)
          <input
            type="url"
            value={s.settings?.home?.promoBanner?.imageUrl || ""}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  home: {
                    ...s.settings?.home,
                    promoBanner: { ...s.settings?.home?.promoBanner, enabled: true, imageUrl: e.target.value },
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Promo banner link
          <input
            type="text"
            value={s.settings?.home?.promoBanner?.href || "/"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  home: {
                    ...s.settings?.home,
                    promoBanner: { ...s.settings?.home?.promoBanner, href: e.target.value },
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>

      <h4 style={{ marginTop: "1rem" }}>Hero banners ({(s.banners || []).length})</h4>
      <div style={{ display: "grid", gap: 10 }}>
        {(s.banners || []).map((b, i) => (
          <div key={b.id || i} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={b.active !== false}
                onChange={(e) => {
                  const banners = [...(s.banners || [])];
                  banners[i] = { ...b, active: e.target.checked };
                  setDraft({ ...s, banners });
                }}
              />
              <strong>{b.id}</strong> — {b.title || b.theme || "Banner"}
            </label>
            <input
              type="url"
              value={b.imageUrl || ""}
              placeholder="Image URL (empty = theme art slide)"
              onChange={(e) => {
                const banners = [...(s.banners || [])];
                banners[i] = { ...b, imageUrl: e.target.value };
                setDraft({ ...s, banners });
              }}
              style={{ width: "100%", padding: "6px 8px", marginBottom: 4 }}
            />
            <input
              type="text"
              value={b.href || "/"}
              placeholder="Link href"
              onChange={(e) => {
                const banners = [...(s.banners || [])];
                banners[i] = { ...b, href: e.target.value };
                setDraft({ ...s, banners });
              }}
              style={{ width: "100%", padding: "6px 8px" }}
            />
          </div>
        ))}
      </div>

      <h4 style={{ marginTop: "1rem" }}>Flash Sale products ({s.flashSaleIds?.length || 0})</h4>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`flash-${p.id}`}>
            <input
              type="checkbox"
              checked={s.flashSaleIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.flashSaleIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, flashSaleIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <h4 style={{ marginTop: "1rem" }}>Home products — Just For You ({s.homeProductIds?.length || 0})</h4>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>প্রতিটি product একবারই দেখাবে — duplicate ID auto skip। Leave empty = all products.</p>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`home-${p.id}`}>
            <input
              type="checkbox"
              checked={s.homeProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.homeProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, homeProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>
      </div>

      <div data-admin-tab="headphone">
      <h3 id="admin-headphone" style={{ marginTop: "1.5rem" }}>Headphone page ({s.landingProductIds?.length || 0}) — <a href="/headphone" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>Products on <strong>/headphone</strong> (also <strong>/landing</strong>). Search &quot;headphone&quot; opens this page. Click product → full detail page.</p>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={p.id}>
            <input
              type="checkbox"
              checked={s.landingProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.landingProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, landingProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={headphoneProducts} title="Headphone images — প্রতিটি product আলাদা ছবি" />
      </div>

      <div data-admin-tab="tshirt">
      <h3 id="admin-tshirt" style={{ marginTop: "1.5rem" }}>T-Shirt page ({s.tshirtProductIds?.length || 0}) — <a href="/tshirt" target="_blank" rel="noreferrer">preview</a></h3>
    <p style={{ color: "#757575", fontSize: "0.88rem" }}>Products on <strong>/tshirt</strong>. Search &quot;t shirt&quot; also opens this page. Click product → full detail page.</p>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={p.id}>
            <input
              type="checkbox"
              checked={s.tshirtProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.tshirtProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, tshirtProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={tshirtProducts} title="T-Shirt images — প্রতিটি product আলাদা ছবি" />
      </div>

      <div data-admin-tab="watch">
      <h3 id="admin-watch" style={{ marginTop: "1.5rem" }}>Watch for Man ({s.watchProductIds?.length || 0}) — <a href="/watch" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>Products on <strong>/watch</strong>. Search &quot;watch for man&quot; also opens this page. Click product → full detail page.</p>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`watch-${p.id}`}>
            <input
              type="checkbox"
              checked={s.watchProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.watchProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, watchProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={watchProducts} title="Watch for Man images — প্রতিটি product আলাদা ছবি" />
      </div>

      <div data-admin-tab="smartwatch">
      <h3 id="admin-smartwatch" style={{ marginTop: "1.5rem" }}>Smart Watch ({s.smartwatchProductIds?.length || 0}) — <a href="/smartwatch" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>Products on <strong>/smartwatch</strong>. Search &quot;smart watch&quot; also opens this page. Click product → full detail page.</p>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sw-${p.id}`}>
            <input
              type="checkbox"
              checked={s.smartwatchProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.smartwatchProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, smartwatchProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={smartwatchProducts} title="Smart Watch images — প্রতিটি product আলাদা ছবি" />
      </div>

      <div data-admin-tab="bra">
      <h3 id="admin-bra" style={{ marginTop: "1.5rem" }}>Bra for Girls ({s.braProductIds?.length || 0}) — <a href="/bra" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>Products on <strong>/bra</strong>. Search &quot;bra for girls&quot; also opens this page. Click product → full detail page.</p>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`bra-${p.id}`}>
            <input
              type="checkbox"
              checked={s.braProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.braProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, braProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={braProducts} title="Bra for Girls images — প্রতিটি product আলাদা ছবি" />
      </div>

      <div data-admin-tab="jerseys">
      <h3 id="admin-jerseys" style={{ marginTop: "1.5rem" }}>Brazil Jersey ({s.brazilJerseyProductIds?.length || 0}) — <a href="/brazil-jersey" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Products on <strong>/brazil-jersey</strong>. Search &quot;brazil jersey 2026 world cup&quot; also opens this page.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.brazilJersey?.searchQuery || "brazil jersey 2026 world cup"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  brazilJersey: { ...s.settings?.brazilJersey, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.brazilJersey?.resultTitle || "brazil jersey 2026 world cup"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  brazilJersey: { ...s.settings?.brazilJersey, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["brazil jersey 2026 world cup"] ?? 2894}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.brazilJersey?.searchQuery || "brazil jersey 2026 world cup"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`bj-${p.id}`}>
            <input
              type="checkbox"
              checked={s.brazilJerseyProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.brazilJerseyProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, brazilJerseyProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={brazilJerseyProducts} title="Brazil Jersey images — প্রতিটি product আলাদা ছবি" />

      <h3 style={{ marginTop: "1.5rem" }}>Argentina Jersey ({s.argentinaJerseyProductIds?.length || 0}) — <a href="/argentina-jersey" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Products on <strong>/argentina-jersey</strong>. Search &quot;jersey 2026 world cup argentina&quot; also opens this page.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.argentinaJersey?.searchQuery || "jersey 2026 world cup argentina"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  argentinaJersey: { ...s.settings?.argentinaJersey, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.argentinaJersey?.resultTitle || "jersey 2026 world cup argentina"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  argentinaJersey: { ...s.settings?.argentinaJersey, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["jersey 2026 world cup argentina"] ?? 600}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.argentinaJersey?.searchQuery || "jersey 2026 world cup argentina"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`aj-${p.id}`}>
            <input
              type="checkbox"
              checked={s.argentinaJerseyProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.argentinaJerseyProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, argentinaJerseyProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={argentinaJerseyProducts} title="Argentina Jersey images — প্রতিটি product আলাদা ছবি" />

      <h3 style={{ marginTop: "1.5rem" }}>Portugal Jersey ({s.portugalJerseyProductIds?.length || 0}) — <a href="/portugal-jersey" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Products on <strong>/portugal-jersey</strong>. Search &quot;protugal jersey&quot; also opens this page.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.portugalJersey?.searchQuery || "protugal jersey"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  portugalJersey: { ...s.settings?.portugalJersey, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.portugalJersey?.resultTitle || "protugal jersey"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  portugalJersey: { ...s.settings?.portugalJersey, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["protugal jersey"] ?? 522}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.portugalJersey?.searchQuery || "protugal jersey"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`pj-${p.id}`}>
            <input
              type="checkbox"
              checked={s.portugalJerseyProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.portugalJerseyProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, portugalJerseyProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={portugalJerseyProducts} title="Portugal Jersey images — প্রতিটি product আলাদা ছবি" />

      <h3 style={{ marginTop: "1.5rem" }}>Spin Jersey ({s.spinJerseyProductIds?.length || 0}) — <a href="/spin-jersey" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Products on <strong>/spin-jersey</strong>. Search &quot;spin jersey 2026 world cup 2 star&quot; also opens this page.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.spinJersey?.searchQuery || "spin jersey 2026 world cup 2 star"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  spinJersey: { ...s.settings?.spinJersey, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.spinJersey?.resultTitle || "spin jersey 2026 world cup 2 star"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  spinJersey: { ...s.settings?.spinJersey, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["spin jersey 2026 world cup 2 star"] ?? 1280}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.spinJersey?.searchQuery || "spin jersey 2026 world cup 2 star"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sj-${p.id}`}>
            <input
              type="checkbox"
              checked={s.spinJerseyProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.spinJerseyProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, spinJerseyProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={spinJerseyProducts} title="Spin Jersey images — প্রতিটি product আলাদা ছবি" />
      </div>

      <div data-admin-tab="catalog">
      <h3 id="admin-bike-stickers" style={{ marginTop: "1.5rem" }}>Bike Stickers ({s.bikeStickerProductIds?.length || 0}) — <a href="/catalog?q=bike%20stickers" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=bike stickers</strong> and <strong>/bike-stickers</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.bikeStickers?.searchQuery || "bike stickers"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  bikeStickers: { ...s.settings?.bikeStickers, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.bikeStickers?.resultTitle || "bike stickers"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  bikeStickers: { ...s.settings?.bikeStickers, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["bike stickers"] ?? 4826}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.bikeStickers?.searchQuery || "bike stickers"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`bs-${p.id}`}>
            <input
              type="checkbox"
              checked={s.bikeStickerProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.bikeStickerProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, bikeStickerProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={bikeStickerProducts} title="Bike Stickers images — প্রতিটি product আলাদা ছবি" />

      <h3 id="admin-bike-sticker-paper" style={{ marginTop: "1.5rem" }}>Bike Stickers Paper Full Body Black ({s.bikeStickerPaperFullBodyBlackProductIds?.length || 0}) — <a href="/catalog?q=bike%20stickers%20paper%20full%20body%20black" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=bike stickers paper full body black</strong> and <strong>/bike-sticker-paper-full-body-black</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.bikeStickerPaperFullBodyBlack?.searchQuery || "bike stickers paper full body black"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  bikeStickerPaperFullBodyBlack: { ...s.settings?.bikeStickerPaperFullBodyBlack, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.bikeStickerPaperFullBodyBlack?.resultTitle || "bike stickers paper full body black"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  bikeStickerPaperFullBodyBlack: { ...s.settings?.bikeStickerPaperFullBodyBlack, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["bike stickers paper full body black"] ?? 2148}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.bikeStickerPaperFullBodyBlack?.searchQuery || "bike stickers paper full body black"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`bsp-${p.id}`}>
            <input
              type="checkbox"
              checked={s.bikeStickerPaperFullBodyBlackProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.bikeStickerPaperFullBodyBlackProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, bikeStickerPaperFullBodyBlackProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={bikeStickerPaperProducts} title="Bike Stickers Paper Full Body Black images — প্রতিটি product আলাদা ছবি" />

      <h3 id="admin-shoes-for-men" style={{ marginTop: "1.5rem" }}>Shoes for Men ({s.shoesForMenProductIds?.length || 0}) — <a href="/catalog?q=shoes%20for%20men" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=shoes for men</strong> and <strong>/shoes-for-men</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.shoesForMen?.searchQuery || "shoes for men"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForMen: { ...s.settings?.shoesForMen, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.shoesForMen?.resultTitle || "shoes for men"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForMen: { ...s.settings?.shoesForMen, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["shoes for men"] ?? 54321}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.shoesForMen?.searchQuery || "shoes for men"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sfm-${p.id}`}>
            <input
              type="checkbox"
              checked={s.shoesForMenProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.shoesForMenProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, shoesForMenProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={shoesForMenProducts} title="Shoes for Men images — প্রতিটি product আলাদা ছবি" />

      <h3 id="admin-shoes-for-men-hq" style={{ marginTop: "1.5rem" }}>Shoes for Men High Quality ({s.shoesForMenHighQualityProductIds?.length || 0}) — <a href="/catalog?q=shoes%20for%20men%20high%20quality" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=shoes for men high quality</strong> and <strong>/shoes-for-men-high-quality</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.shoesForMenHighQuality?.searchQuery || "shoes for men high quality"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForMenHighQuality: { ...s.settings?.shoesForMenHighQuality, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.shoesForMenHighQuality?.resultTitle || "shoes for men high quality"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForMenHighQuality: { ...s.settings?.shoesForMenHighQuality, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["shoes for men high quality"] ?? 1037}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.shoesForMenHighQuality?.searchQuery || "shoes for men high quality"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sfhq-${p.id}`}>
            <input
              type="checkbox"
              checked={s.shoesForMenHighQualityProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.shoesForMenHighQualityProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, shoesForMenHighQualityProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={shoesForMenHighQualityProducts} title="Shoes for Men High Quality images — প্রতিটি product আলাদা ছবি" />

      <h3 id="admin-shoes-for-girls" style={{ marginTop: "1.5rem" }}>Shoes for Girls ({s.shoesForGirlsProductIds?.length || 0}) — <a href="/catalog?q=shoes%20for%20girls" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=shoes for girls</strong> and <strong>/shoes-for-girls</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.shoesForGirls?.searchQuery || "shoes for girls"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirls: { ...s.settings?.shoesForGirls, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.shoesForGirls?.resultTitle || "shoes for girls"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirls: { ...s.settings?.shoesForGirls, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["shoes for girls"] ?? 14100}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.shoesForGirls?.searchQuery || "shoes for girls"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sfg-${p.id}`}>
            <input
              type="checkbox"
              checked={s.shoesForGirlsProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.shoesForGirlsProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, shoesForGirlsProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={shoesForGirlsProducts} title="Shoes for Girls images — প্রতিটি product আলাদা ছবি" />

      <h3 id="admin-shoes-for-girls-sneakers" style={{ marginTop: "1.5rem" }}>Shoes for Girls Sneakers ({s.shoesForGirlsSneakersProductIds?.length || 0}) — <a href="/catalog?q=shoes%20for%20girls%20sneakers" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=shoes for girls sneakers</strong> and <strong>/shoes-for-girls-sneakers</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.shoesForGirlsSneakers?.searchQuery || "shoes for girls sneakers"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirlsSneakers: { ...s.settings?.shoesForGirlsSneakers, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.shoesForGirlsSneakers?.resultTitle || "shoes for girls sneakers"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirlsSneakers: { ...s.settings?.shoesForGirlsSneakers, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["shoes for girls sneakers"] ?? 1017}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.shoesForGirlsSneakers?.searchQuery || "shoes for girls sneakers"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sfgs-${p.id}`}>
            <input
              type="checkbox"
              checked={s.shoesForGirlsSneakersProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.shoesForGirlsSneakersProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, shoesForGirlsSneakersProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={shoesForGirlsSneakersProducts} title="Shoes for Girls Sneakers images — প্রতিটি product আলাদা ছবি" />

      <h3 id="admin-shoes-for-girls-sneakers-black" style={{ marginTop: "1.5rem" }}>Shoes for Girls Sneakers Black ({s.shoesForGirlsSneakersBlackProductIds?.length || 0}) — <a href="/catalog?q=shoes%20for%20girls%20sneakers%20black" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=shoes for girls sneakers black</strong> and <strong>/shoes-for-girls-sneakers-black</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.shoesForGirlsSneakersBlack?.searchQuery || "shoes for girls sneakers black"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirlsSneakersBlack: { ...s.settings?.shoesForGirlsSneakersBlack, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.shoesForGirlsSneakersBlack?.resultTitle || "shoes for girls sneakers black"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirlsSneakersBlack: { ...s.settings?.shoesForGirlsSneakersBlack, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["shoes for girls sneakers black"] ?? 54}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.shoesForGirlsSneakersBlack?.searchQuery || "shoes for girls sneakers black"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sfgsb-${p.id}`}>
            <input
              type="checkbox"
              checked={s.shoesForGirlsSneakersBlackProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.shoesForGirlsSneakersBlackProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, shoesForGirlsSneakersBlackProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={shoesForGirlsSneakersBlackProducts} title="Shoes for Girls Sneakers Black images — প্রতিটি product আলাদা ছবি" />

      <h3 id="admin-shoes-for-girls-sneakers-black-white" style={{ marginTop: "1.5rem" }}>Shoes for Girls Sneakers Black and White ({s.shoesForGirlsSneakersBlackAndWhiteProductIds?.length || 0}) — <a href="/catalog?q=shoes%20for%20girls%20sneakers%20black%20and%20white" target="_blank" rel="noreferrer">preview</a></h3>
      <p style={{ color: "#757575", fontSize: "0.88rem" }}>
        Daraz-style catalog on <strong>/catalog?q=shoes for girls sneakers black and white</strong> and <strong>/shoes-for-girls-sneakers-black-and-white</strong>.
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 720, marginBottom: 12 }}>
        <label style={{ fontSize: "0.88rem" }}>
          Search query
          <input
            type="text"
            value={s.settings?.shoesForGirlsSneakersBlackAndWhite?.searchQuery || "shoes for girls sneakers black and white"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirlsSneakersBlackAndWhite: { ...s.settings?.shoesForGirlsSneakersBlackAndWhite, searchQuery: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Page title / result heading
          <input
            type="text"
            value={s.settings?.shoesForGirlsSneakersBlackAndWhite?.resultTitle || "shoes for girls sneakers black and white"}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  shoesForGirlsSneakersBlackAndWhite: { ...s.settings?.shoesForGirlsSneakersBlackAndWhite, resultTitle: e.target.value },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
        <label style={{ fontSize: "0.88rem" }}>
          Items found count (display)
          <input
            type="number"
            value={s.settings?.searchResultCounts?.["shoes for girls sneakers black and white"] ?? 15}
            onChange={(e) =>
              setDraft({
                ...s,
                settings: {
                  ...s.settings,
                  searchResultCounts: {
                    ...s.settings?.searchResultCounts,
                    [s.settings?.shoesForGirlsSneakersBlackAndWhite?.searchQuery || "shoes for girls sneakers black and white"]: Number(e.target.value) || 0,
                  },
                },
              })
            }
            style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
          />
        </label>
      </div>
      <div className="check-grid">
        {s.products?.filter((p) => p.active !== false).map((p) => (
          <label key={`sfgsbw-${p.id}`}>
            <input
              type="checkbox"
              checked={s.shoesForGirlsSneakersBlackAndWhiteProductIds?.includes(p.id)}
              onChange={(e) => {
                const ids = new Set(s.shoesForGirlsSneakersBlackAndWhiteProductIds || []);
                e.target.checked ? ids.add(p.id) : ids.delete(p.id);
                setDraft({ ...s, shoesForGirlsSneakersBlackAndWhiteProductIds: [...ids] });
              }}
            />
            {p.name}
          </label>
        ))}
      </div>

      <ProductImageEditor products={shoesForGirlsSneakersBlackAndWhiteProducts} title="Shoes for Girls Sneakers Black and White images — প্রতিটি product আলাদা ছবি" />
      </div>
      </div>
    </div>
  );
}
