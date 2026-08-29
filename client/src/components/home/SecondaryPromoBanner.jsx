import { Link } from "react-router-dom";
import { normalizeBannerHref } from "../../utils/bannerUtils";

export default function SecondaryPromoBanner({ promo, lang }) {
  if (!promo || promo.enabled === false) return null;
  const href = normalizeBannerHref(promo.href || "/");
  const title = lang === "bn" ? promo.titleBn || promo.title : promo.title;
  const subtitle = lang === "bn" ? promo.subtitleBn || promo.subtitle : promo.subtitle;
  const cta = lang === "bn" ? promo.ctaBn || promo.cta : promo.cta;

  if (promo.imageUrl) {
    return (
      <Link className="home-promo-strip" to={href} aria-label={title || promo.alt || "Promotion"}>
        <img src={promo.imageUrl} alt={title || promo.alt || "Promotion"} loading="lazy" />
      </Link>
    );
  }

  return (
    <Link className="home-promo-strip home-promo-strip--text" to={href}>
      <div className="home-promo-strip__copy">
        {title ? <strong>{title}</strong> : null}
        {subtitle ? <span>{subtitle}</span> : null}
        {cta ? <span className="home-promo-strip__cta">{cta}</span> : null}
      </div>
    </Link>
  );
}
