import { Link } from "react-router-dom";
import { useState } from "react";
import {
  getProductById,
  getCategoryById,
  categoryLabel,
  productLabel,
  productImageUrl,
  searchFormatBdt,
  searchSalePrice,
  searchDiscount,
} from "../../utils/storeUtils";

function FlashSaleCard({ product, categories, lang }) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || productImageUrl(product));
  const sale = searchSalePrice(product);
  const pct = searchDiscount(product);
  const cat = getCategoryById(categories, product.category);
  const title = productLabel(product, lang);
  const suffix = lang === "bn" ? " | বিশেষ অফার" : " | Special Offer";

  return (
    <Link className="fs-card" to={`/product/${encodeURIComponent(product.id)}`} title={title + suffix}>
      <div className="common-img fs-card-img img-w100p">
        <picture>
          <img
            src={imgSrc}
            alt={title}
            loading="lazy"
            width="188"
            height="188"
            onError={() => setImgSrc(`https://picsum.photos/seed/fs-${product.id}/188/188`)}
          />
        </picture>
        <span className="fs-card-img__badge">-{pct}%</span>
      </div>
      <div className="fs-card__body">
        <p className="fs-card__name">{title}{suffix}</p>
        <p className="fs-card__cat">{cat ? categoryLabel(cat, lang) : ""}</p>
        <p className="fs-card__price">
          <strong>{searchFormatBdt(sale)}</strong>
        </p>
      </div>
    </Link>
  );
}

export default function FlashSaleSection({ products, flashSaleIds, categories, settings, lang }) {
  const home = settings.home || {};
  const items = (flashSaleIds || [])
    .map((id) => getProductById(products, id))
    .filter(Boolean);

  if (!items.length || home.showFlashSale === false) return null;

  const title = lang === "bn" ? home.flashSaleTitleBn || "ফ্ল্যাশ সেল" : home.flashSaleTitle || "Flash Sale";
  const status = lang === "bn" ? home.flashSaleStatusBn || "এখন সেল চলছে" : home.flashSaleStatus || "On Sale Now";
  const shopAll = lang === "bn" ? home.flashShopAllBn || "সব প্রোডাক্ট" : home.flashShopAll || "SHOP ALL PRODUCTS";

  return (
    <section className="flash-sale cardFsContent" id="js_flashSale">
      <h2 className="flash-sale__title">{title}</h2>
      <div className="flash-sale__header card-fs-content-header flex flex-justify-between">
        <span className="flash-sale__status">{status}</span>
        <Link className="flash-sale__shop-all" to="/">
          {shopAll}
        </Link>
      </div>
      <div className="flash-sale__row flex">
        {items.map((p) => (
          <FlashSaleCard key={p.id} product={p} categories={categories} lang={lang} />
        ))}
      </div>
    </section>
  );
}
