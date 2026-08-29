import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import AppDownloadPopup from "./AppDownloadPopup";

function normalizeTopHref(href) {
  if (!href) return "/";
  if (/^https?:\/\//i.test(href)) return href;
  return href
    .replace(/^help\.html/i, "/help")
    .replace(/^services\.html/i, "/services")
    .replace(/^login\.html/i, "/login")
    .replace(/^signup\.html/i, "/signup")
    .replace(/^home\.html/i, "/")
    .replace(/^index\.html/i, "/");
}

function TopLink({ href, children, className = "top-links__item" }) {
  const to = normalizeTopHref(href);
  if (/^https?:\/\//i.test(to)) {
    return (
      <a className={className} href={to} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export default function TopActionBar() {
  const { settings, lang, setLang } = useStore();
  const topBar = settings.topBar || {};
  if (topBar.enabled === false) return null;

  const appDownload = topBar.appDownload || {};
  const appLinkId = appDownload.linkId || "save-app";

  const headerLinks = (settings.headerLinks || []).filter((link) => link.active !== false);
  const authLinks = (topBar.authLinks || [
    { id: "login", label: "LOGIN", labelBn: "লগইন", href: "/login", active: true },
    { id: "signup", label: "SIGN UP", labelBn: "সাইন আপ", href: "/signup", active: true },
  ]).filter((link) => link.active !== false);

  const langLabel =
    lang === "bn"
      ? topBar.languageLabelBn || topBar.languageLabel || "ভাষা"
      : topBar.languageLabel || "Change Language";

  function renderHeaderLink(link, i) {
    if (link.id === appLinkId && appDownload.enabled !== false) {
      return <AppDownloadPopup key={link.id || i} link={link} lang={lang} />;
    }
    return (
      <TopLink key={link.id || i} href={link.href} className={`top-links__item${i < 2 ? " is-priority-hide" : ""}`}>
        {lang === "bn" ? link.labelBn || link.label : link.label}
      </TopLink>
    );
  }

  return (
    <div className="top-action-bar">
      <div className="container top-action-bar__inner">
        <div className={`top-links links-list header-content${lang === "bn" ? " BD bn" : " BD en"}`} id="topActionLinks">
          {headerLinks.map((link, i) => renderHeaderLink(link, i))}
          {authLinks.map((link) => (
            <TopLink key={link.id || link.label} href={link.href}>
              {lang === "bn" ? link.labelBn || link.label : link.label}
            </TopLink>
          ))}
          {topBar.showLanguage !== false ? (
            <div className="top-links__lang" role="group" aria-label="Language">
              <span className="top-links__item top-links__lang-label">{langLabel}</span>
              <button
                type="button"
                className={`lang-btn${lang === "en" ? " active" : ""}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang-btn${lang === "bn" ? " active" : ""}`}
                onClick={() => setLang("bn")}
              >
                বাং
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
