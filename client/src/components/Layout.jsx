import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import CartLink from "./CartLink";
import TopActionBar from "./TopActionBar";
import { categoryLabel, isBikeStickersQuery, isBikeStickerPaperFullBodyBlackQuery, isShoesForMenQuery, isShoesForMenHighQualityQuery, isShoesForGirlsQuery, isShoesForGirlsSneakersQuery, isShoesForGirlsSneakersBlackQuery, isShoesForGirlsSneakersBlackAndWhiteQuery } from "../utils/storeUtils";
const NAV_MAIN = [
  { to: "/", label: "Home Page", labelBn: "হোম পেজ", end: true },
  { to: "/landing", label: "Landing Page", labelBn: "ল্যান্ডিং পেজ" },
  { to: "/review", label: "Review Page", labelBn: "রিভিউ পেজ" },
  { to: "/catalog-links", label: "Catalog Pages", labelBn: "ক্যাটালগ পেজ" },
  { to: "/contact", label: "Contact Page", labelBn: "যোগাযোগ" },
];

const NAV_MENU_ITEMS = [
  { to: "/headphone", label: "Headphone", labelBn: "হেডফোন" },
  { to: "/watch", label: "Watch for Man", labelBn: "ঘড়ি (পুরুষ)" },
  { to: "/smartwatch", label: "Smart Watch", labelBn: "স্মার্ট ওয়াচ" },
  { to: "/seller", label: "Become a Seller", labelBn: "সেলার হোন" },
  { to: "/services", label: "Services", labelBn: "সার্ভিস" },
  { to: "/privacy", label: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি" },
  { to: "/admin", label: "Admin Panel", labelBn: "অ্যাডমিন প্যানেল" },
];

export default function Layout() {
  const { settings, lang, loading, error, categories } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [catsOpen, setCatsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const catsRef = useRef(null);
  const menuRef = useRef(null);
  const isContactPage = location.pathname === "/contact";
  const siteName = lang === "bn" ? settings.siteNameBn || settings.siteName : settings.siteName || "E-commerce Website";
  const searchPh =
    lang === "bn"
      ? settings.searchPlaceholderBn || `${siteName} এ সার্চ করুন`
      : settings.searchPlaceholder || `Search in ${siteName}`;

  useEffect(() => {
    setSearchQuery(new URLSearchParams(location.search).get("q") || "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    setCatsOpen(false);
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onDocClick(e) {
      if (catsRef.current && !catsRef.current.contains(e.target)) {
        setCatsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const wrap = catsRef.current;
    if (!wrap) return undefined;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return undefined;
    const open = () => setCatsOpen(true);
    const close = () => setCatsOpen(false);
    wrap.addEventListener("mouseenter", open);
    wrap.addEventListener("mouseleave", close);
    return () => {
      wrap.removeEventListener("mouseenter", open);
      wrap.removeEventListener("mouseleave", close);
    };
  }, []);

  useEffect(() => {
    const wrap = menuRef.current;
    if (!wrap) return undefined;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return undefined;
    const open = () => setMenuOpen(true);
    const close = () => setMenuOpen(false);
    wrap.addEventListener("mouseenter", open);
    wrap.addEventListener("mouseleave", close);
    return () => {
      wrap.removeEventListener("mouseenter", open);
      wrap.removeEventListener("mouseleave", close);
    };
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (isShoesForGirlsSneakersBlackAndWhiteQuery(q) || isShoesForGirlsSneakersBlackQuery(q) || isShoesForGirlsSneakersQuery(q) || isShoesForGirlsQuery(q) || isShoesForMenHighQualityQuery(q) || isShoesForMenQuery(q) || isBikeStickerPaperFullBodyBlackQuery(q) || isBikeStickersQuery(q)) {
      navigate(`/catalog?q=${encodeURIComponent(q)}`);
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  if (loading) {
    return <div className="container" style={{ padding: "3rem" }}>Loading store…</div>;
  }
  if (error) {
    return (
      <div className="container" style={{ padding: "3rem" }}>
        <h1>Store unavailable</h1>
        <p>{error}</p>
        <p>Start MongoDB and run: <code>npm run seed</code> then <code>npm run server</code></p>
      </div>
    );
  }

  const categoriesLabel = lang === "bn" ? "আপনার জন্য ক্যাটাগরি" : "Categories for you";
  const menuLabel = lang === "bn" ? "মেনু" : "Menu";

  function navLabel(item) {
    return lang === "bn" ? item.labelBn || item.label : item.label;
  }

  function isActive(to, end) {
    if (end) return location.pathname === "/";
    return location.pathname.startsWith(to);
  }

  return (
    <>
      <header className="site-header" id="site-header">
        <TopActionBar />
        <div className="main-header-bar">
          <div className="container header__inner">
            <Link className="brand" to="/">{siteName}</Link>
            <div className="header-search-wrap">
              <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
                <div className="search-box">
                  <input
                    type="search"
                    name="q"
                    className="header-search__input search-box__input"
                    placeholder={searchPh}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                  />
                  <button type="submit" className="header-search__btn" aria-label="Search">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            <div className="header__actions">
              <CartLink />
            </div>
          </div>
        </div>
      </header>

      <nav className="site-nav" id="site-nav">
        <div className="container nav__inner">
          <div className="nav__links">
            {NAV_MAIN.map((item) => (
              <Link key={item.to} className={`nav__link${isActive(item.to, item.end) ? " is-active" : ""}`} to={item.to}>
                {navLabel(item)}
              </Link>
            ))}
          </div>
          <div className="nav__actions">
            <div className={`nav__menu${menuOpen ? " is-open" : ""}`} ref={menuRef}>
              <button
                type="button"
                className="cats-trigger menu-trigger"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((open) => !open);
                  setCatsOpen(false);
                }}
              >
                <span>{menuLabel}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <div className="mega-menu nav-menu" role="menu">
                {NAV_MENU_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    className={`mega-menu__item${isActive(item.to) ? " is-active" : ""}`}
                    role="menuitem"
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                  >
                    {navLabel(item)}
                  </Link>
                ))}
              </div>
            </div>
            <div className={`nav__cats${catsOpen ? " is-open" : ""}`} ref={catsRef}>
              <button
                type="button"
                className="cats-trigger"
                aria-expanded={catsOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setCatsOpen((open) => !open);
                  setMenuOpen(false);
                }}
              >
              <span>{categoriesLabel}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="mega-menu" role="menu">
              {(categories || []).map((c) => (
                <Link
                  key={c.id}
                  className="mega-menu__item"
                  role="menuitem"
                  to={`/?cat=${encodeURIComponent(c.id)}`}
                  onClick={() => setCatsOpen(false)}
                >
                  {categoryLabel(c, lang)}
                </Link>
              ))}
            </div>
          </div>
          </div>
        </div>
      </nav>

      <main className={isContactPage ? "main--contact" : undefined}>
        <Outlet />
      </main>

      {!isContactPage ? (
        <footer className="site-footer">
          <div className="container">
            <p>© {siteName} {new Date().getFullYear()} · MERN Stack</p>
          </div>
        </footer>
      ) : null}
      <a className="whatsapp-float" href={`https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a>
    </>
  );
}
