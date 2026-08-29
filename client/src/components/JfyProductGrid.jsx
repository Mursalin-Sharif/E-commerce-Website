import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import JfyProductCard from "./JfyProductCard";

const PAGE_SIZE = 16;

function uniqueProducts(ids, products) {
  const seen = new Set();
  const list = [];
  for (const id of ids || []) {
    if (seen.has(id)) continue;
    const p = products.find((item) => item.id === id);
    if (p) {
      seen.add(id);
      list.push(p);
    }
  }
  return list;
}

export default function JfyProductGrid({
  productIds,
  products,
  title = "Just For You",
  loadMoreLabel = "LOAD MORE",
  show = true,
  sectionId = "js_jfy",
  className = "",
  emptyHint = "Choose products in Admin.",
  adminLink = "/admin",
  lang = "en",
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const allProducts = useMemo(() => uniqueProducts(productIds, products), [productIds, products]);
  const shown = allProducts.slice(0, visible);

  if (show === false) return null;

  return (
    <section className={`jfy pc-custom-link hp-mod-card jfy-comp-container ${className}`.trim()} id={sectionId}>
      <div className="hp-mod-card-content">
        <h2 className="jfy__title">{title}</h2>
        <div className="card-jfy-wrapper flex flex-row flex-wrap">
          {shown.map((p) => (
            <JfyProductCard key={p.id} product={p} lang={lang} />
          ))}
        </div>
        {visible < allProducts.length ? (
          <div className="jfy__more-wrap">
            <button type="button" className="jfy-load-more" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
              {loadMoreLabel}
            </button>
          </div>
        ) : null}
        {!shown.length ? (
          <p className="search-main__empty" style={{ padding: "1.5rem 0" }}>
            No products selected. {emptyHint}{" "}
            <Link to={adminLink}>Open Admin</Link>.
          </p>
        ) : null}
      </div>
    </section>
  );
}
