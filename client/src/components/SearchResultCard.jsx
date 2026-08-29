import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  productLabel,
  productImageUrl,
  productLocation,
  searchDiscount,
  searchSalePrice,
  searchFormatBdt,
  searchRating,
  searchSoldLabel,
} from "../utils/storeUtils";

function starsHtml(rating) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`sr-star${i < filled ? " is-on" : ""}`}>
      ★
    </span>
  ));
}

export default function SearchResultCard({ product, lang, settings }) {
  const fallbackImg = productImageUrl(product);
  const [imgSrc, setImgSrc] = useState(product.imageUrl || fallbackImg);

  useEffect(() => {
    setImgSrc(product.imageUrl || productImageUrl(product));
  }, [product.id, product.imageUrl]);
  const pct = searchDiscount(product);
  const sale = searchSalePrice(product);
  const title = productLabel(product, lang);
  const { rating, reviews } = searchRating(product);
  const badge = product.badge ? String(product.badge).trim() : "";
  const tag = product.tag ? String(product.tag).trim() : product.mall ? "Mall" : "";
  const coins = product.coinsSave != null ? product.coinsSave : 2 + (parseInt(String(product.id).replace(/\D/g, ""), 10) % 8);
  const strip = product.bannerStrip || (product.mall ? "Official Mobile · Authentic · 0% EMI · Fast Delivery" : "");

  return (
    <Link className="sr-card" to={`/product/${encodeURIComponent(product.id)}`} title={title}>
      <div className="sr-card__img">
        {strip ? <div className="sr-card__banner">{strip}</div> : null}
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          width="220"
          height="220"
          onError={() => {
            const hay = `${product.keywords || ""} ${product.name || ""}`;
            const isHeadphone = /headphone|earbud|earphone|headset|tws|buds/i.test(hay);
            const isSmartwatch = /smart watch|smartwatch|amoled|t900/i.test(hay) || product.category === "smartwatches";
            const isWatch = /watch for man|men watch|analog watch|wrist watch/i.test(hay);
            const isTshirt = /t shirt|tshirt|tee|kaporer/i.test(hay) || (product.category === "apparel" && !/bra|watch/i.test(hay));
            const fallback = isHeadphone
              ? `https://picsum.photos/seed/hp-${encodeURIComponent(product.id)}/440/440`
              : isSmartwatch
              ? `https://picsum.photos/seed/sw-${encodeURIComponent(product.id)}/440/440`
              : isWatch
                ? `https://picsum.photos/seed/wm-${encodeURIComponent(product.id)}/440/440`
                : isTshirt
                  ? `https://picsum.photos/seed/ts-${encodeURIComponent(product.id)}/440/440`
                  : `https://picsum.photos/seed/${encodeURIComponent(product.id)}/440/440`;
            if (imgSrc !== fallback) setImgSrc(fallback);
          }}
        />
      </div>
      <div className="sr-card__body">
        <div className="sr-card__tags">
          {tag ? <span className="sr-card__tag">{tag}</span> : null}
          {badge ? <span className="sr-card__promo">{badge}</span> : null}
        </div>
        <p className="sr-card__title">{title}</p>
        <div className="sr-card__price-row">
          <span className="sr-card__price">{searchFormatBdt(sale)}</span>
        </div>
        <div className="sr-card__deal">
          <span className="sr-card__off">{pct}% Off</span>
          <span className="sr-card__coins">Coins save ৳ {coins}</span>
        </div>
        <div className="sr-card__meta">
          <span className="sr-card__sold">{searchSoldLabel(product)}</span>
          <span className="sr-card__rating">
            {starsHtml(rating)} <em>({reviews})</em>
          </span>
          <span className="sr-card__loc">{productLocation(product, settings, lang)}</span>
        </div>
      </div>
    </Link>
  );
}
