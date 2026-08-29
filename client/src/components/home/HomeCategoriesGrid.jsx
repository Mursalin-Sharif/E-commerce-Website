import { Link } from "react-router-dom";
import { getProductById, productImageUrl } from "../../utils/storeUtils";

export default function HomeCategoriesGrid({ homeCategories, products, lang }) {
  const cfg = homeCategories || {};
  const items = Array.isArray(cfg.items) ? cfg.items : [];
  if (!items.length) return null;

  const title = lang === "bn" ? cfg.titleBn || cfg.title || "ক্যাটাগরি" : cfg.title || "Categories";

  function itemHref(item) {
    if (item.linkType === "product" && item.productId) return `/product/${encodeURIComponent(item.productId)}`;
    if (item.categoryId) return `/?cat=${encodeURIComponent(item.categoryId)}`;
    if (item.productId) return `/product/${encodeURIComponent(item.productId)}`;
    if (item.href) return item.href.replace(/^home\.html/i, "/");
    return "/";
  }

  return (
    <section className="card-categories hp-mod-card" id="js_categories" aria-label="Categories">
      <div className="card-categories__inner">
        <h2 className="card-categories__title">{title}</h2>
        <div className="card-categories__grid">
          {items.map((item) => {
            const label = lang === "bn" ? item.labelBn || item.label : item.label;
            const product = item.productId ? getProductById(products, item.productId) : null;
            const img = item.imageUrl || (product ? productImageUrl(product) : "");
            return (
              <Link key={item.id || label} className="card-categories__item" to={itemHref(item)} title={label || ""}>
                <span className="card-categories__thumb">
                  {img ? (
                    <img src={img} alt="" loading="lazy" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <span className="card-categories__fallback">{(label || "?").charAt(0)}</span>
                  )}
                </span>
                <span className="card-categories__label">{label || ""}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
