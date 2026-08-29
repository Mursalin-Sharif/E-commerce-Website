import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { contactBrandName, contactHeadline, contactMapEmbedUrl, mergeContactSettings } from "../utils/contactDefaults";
import JfyProductGrid from "../components/JfyProductGrid";
function pick(c, lang, enKey, bnKey) {
  if (lang === "bn") return c[bnKey] || c[enKey] || "";
  return c[enKey] || c[bnKey] || "";
}

function linkLabel(item, lang) {
  if (lang === "bn") return item.labelBn || item.label || "";
  return item.label || item.labelBn || "";
}

export default function ContactPage() {
  const { settings, lang, loading, products, contactProductIds, homeProductIds } = useStore();
  const c = mergeContactSettings(settings);
  const whatsapp = (c.whatsapp || "").replace(/\D/g, "");
  const phone = (c.phone || "").replace(/\D/g, "");
  const waMessage = pick(c, lang, "whatsappMessage", "whatsappMessageBn") || "Hi, I want to get in touch.";
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}` : "#";
  const telHref = phone ? `tel:${phone}` : "#";

  if (loading) {
    return (
      <div className="app-frame contact-route">
        <div className="contact-page__loading">Loading…</div>
      </div>
    );
  }

  const links = (c.links || []).filter((item) => item.active !== false);
  const legalLinks = (c.legalLinks || []).filter((item) => item.active !== false);
  const services = lang === "bn" ? c.servicesBn || c.services || [] : c.services || c.servicesBn || [];
  const callLabel = pick(c, lang, "callButton", "callButtonBn") || "Call";
  const callText = phone ? `${callLabel} ${phone}` : callLabel;

  const heroEyebrow = pick(c, lang, "eyebrow", "eyebrowBn") || "CONTACT";
  const heroTitle = contactHeadline(c, settings, lang);
  const heroSubtitle = pick(c, lang, "subtitle", "subtitleBn") || "Get in touch. We respond fast.";
  const heroIntro =
    pick(c, lang, "intro", "introBn") ||
    "WhatsApp is the fastest way to reach us: portfolio websites, demo showcases, landing pages and admin dashboards.";
  const waButtonLabel = pick(c, lang, "whatsappButton", "whatsappButtonBn") || "WhatsApp Us";

  const addressLines = [
    pick(c, lang, "addressLine1", "addressLine1Bn"),
    pick(c, lang, "addressLine2", "addressLine2Bn"),
    pick(c, lang, "addressLine3", "addressLine3Bn"),
  ].filter(Boolean);

  const gridIds = contactProductIds?.length ? contactProductIds : homeProductIds;
  const gridTitle = pick(c, lang, "productGridTitle", "productGridTitleBn") || "Just For You";
  const gridLoadMore = pick(c, lang, "loadMore", "loadMoreBn") || "LOAD MORE";
  const showGrid = c.showProductGrid !== false;
  const showMap = c.showMap !== false;
  const mapEmbedUrl = contactMapEmbedUrl(c.mapQuery, c.mapZoom);
  const mapTitle = pick(c, lang, "mapTitle", "mapTitleBn") || "map";

  return (
    <div className="app-frame contact-route">
      <section className="contact-hero">
        <div className={`contact-hero__inner${showMap && mapEmbedUrl ? " contact-hero__inner--with-map" : ""}`}>
          <div className="contact-hero__content">
          <p className="contact-hero__eyebrow">{heroEyebrow}</p>
          <h1 className="contact-hero__title">{heroTitle}</h1>
          <p className="contact-hero__subtitle">{heroSubtitle}</p>
          <p className="contact-hero__intro">{heroIntro}</p>

          <div className="contact-hero__actions">
            <a className="contact-cta contact-cta--wa" href={waHref} target="_blank" rel="noreferrer">
              <span className="contact-cta__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </span>
              {waButtonLabel}
            </a>
            <a className="contact-cta contact-cta--call" href={telHref}>
              <span className="contact-cta__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </span>
              {callText}
            </a>
          </div>
          </div>

          {showMap && mapEmbedUrl ? (
            <div className="contact-map">
              <iframe
                className="contact-map__iframe"
                title={mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedUrl}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="contact-products">
        <div className="container container--daraz">
          <JfyProductGrid
            productIds={gridIds}
            products={products}
            title={gridTitle}
            loadMoreLabel={gridLoadMore}
            show={showGrid}
            sectionId="js_contact_jfy"
            className="contact-jfy"
            lang={lang}
            emptyHint="Admin → Contact page → Products."
            adminLink="/admin#admin-contact"
          />
        </div>
      </section>

      <footer className="contact-footer">
        <div className="contact-footer__inner">
          <div className="contact-footer__brand">
            <p className="contact-footer__logo">{contactBrandName(c, settings, lang)}</p>
            <p className="contact-footer__tagline">{pick(c, lang, "tagline", "taglineBn")}</p>
            <p className="contact-footer__desc">{pick(c, lang, "description", "descriptionBn")}</p>
          </div>

          <div className="contact-footer__grid">
            <div className="contact-footer__col">
              <h3>{pick(c, lang, "linksTitle", "linksTitleBn")}</h3>
              <ul>
                {links.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link to={item.href || "/"}>{linkLabel(item, lang)}</Link>
                  </li>
                ))}
                {c.facebookHref ? (
                  <li>
                    <a href={c.facebookHref} target="_blank" rel="noreferrer" className="contact-footer__facebook">
                      {pick(c, lang, "facebookLabel", "facebookLabelBn")}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="contact-footer__col">
              <h3>{pick(c, lang, "contactTitle", "contactTitleBn")}</h3>
              <address>
                {addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {phone ? <p>{phone}</p> : null}
                {whatsapp ? (
                  <p>
                    <a href={waHref} target="_blank" rel="noreferrer">
                      {pick(c, lang, "whatsappNowLabel", "whatsappNowLabelBn")}
                    </a>
                  </p>
                ) : null}
                {c.email ? (
                  <p>
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </p>
                ) : null}
              </address>
            </div>

            <div className="contact-footer__col">
              <h3>{pick(c, lang, "legalTitle", "legalTitleBn")}</h3>
              <ul>
                {legalLinks.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link to={item.href || "/"}>{linkLabel(item, lang)}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact-footer__col">
              <h3>{pick(c, lang, "servicesTitle", "servicesTitleBn")}</h3>
              <ul className="contact-footer__services">
                {services.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="contact-footer__copy">
          <p>
            © {new Date().getFullYear()} {c.copyrightName || contactBrandName(c, settings, lang)}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
