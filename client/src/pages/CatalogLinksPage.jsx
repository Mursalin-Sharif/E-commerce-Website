import { Link, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";

function linkLabel(link, lang) {
  return lang === "bn" ? link.labelBn || link.label : link.label || link.labelBn;
}

function isLinkActive(to, pathname, search) {
  if (to.startsWith("/catalog?")) {
    const linkQ = decodeURIComponent(to.split("q=")[1] || "").replace(/\+/g, " ");
    const currentQ = new URLSearchParams(search).get("q") || "";
    return pathname === "/catalog" && linkQ === currentQ;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function CatalogLinksPage() {
  const { settings, lang } = useStore();
  const location = useLocation();
  const links = (settings.headerHotSearchLinks || []).filter((link) => link.active !== false && link.to);
  const title =
    lang === "bn"
      ? settings.catalogLinksPageTitleBn || settings.catalogLinksPageTitle || "ক্যাটালগ পেজ"
      : settings.catalogLinksPageTitle || "Catalog Pages";
  const intro =
    lang === "bn"
      ? settings.catalogLinksPageIntroBn ||
        settings.catalogLinksPageIntro ||
        "Daraz-style catalog shortcuts — যেকোনো link-এ ক্লিক করে সরাসরি search/catalog page-এ যান।"
      : settings.catalogLinksPageIntro ||
        "Daraz-style catalog shortcuts — click any link to open its catalog page.";

  return (
    <div className="catalog-links-page">
      <div className="container">
        <header className="catalog-links-page__head">
          <h1 className="catalog-links-page__title">{title}</h1>
          <p className="catalog-links-page__intro">{intro}</p>
          <p className="catalog-links-page__count">
            {links.length.toLocaleString("en-BD")} {lang === "bn" ? "টি লিংক" : "links"}
          </p>
        </header>

        {links.length ? (
          <div className="catalog-links-page__grid">
            {links.map((link, i) => (
              <Link
                key={link.id || link.to || i}
                className={`catalog-links-page__pill${isLinkActive(link.to, location.pathname, location.search) ? " is-active" : ""}`}
                to={link.to}
              >
                {linkLabel(link, lang)}
              </Link>
            ))}
          </div>
        ) : (
          <p className="catalog-links-page__empty">
            {lang === "bn"
              ? "কোনো catalog link নেই। Admin → Top bar → Catalog links থেকে যোগ করুন।"
              : "No catalog links yet. Add them in Admin → Top bar → Catalog links."}
          </p>
        )}
      </div>
    </div>
  );
}
