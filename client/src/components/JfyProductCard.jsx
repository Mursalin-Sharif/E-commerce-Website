import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  productLabel,
  productImageUrl,
  searchDiscount,
  searchFormatBdt,
  searchRating,
  searchSalePrice,
  searchSoldLabel,
} from "../utils/storeUtils";

function starsHtml(rating) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return Array.from({ length: 5 }, (_, i) => {
    let cls = "jfy-star";
    if (i < full) cls += " is-on";
    else if (i === full && half) cls += " is-half";
    return (
      <span key={i} className={cls} aria-hidden="true">
        ★
      </span>
    );
  });
}

export default function JfyProductCard({ product, lang }) {
  const fallbackImg = productImageUrl(product);
  const [imgSrc, setImgSrc] = useState(product.imageUrl || fallbackImg);

  useEffect(() => {
    setImgSrc(product.imageUrl || productImageUrl(product));
  }, [product.id, product.imageUrl]);

  const pct = searchDiscount(product);
  const sale = searchSalePrice(product);
  const title = productLabel(product, lang);
  const { rating, reviews } = searchRating(product);
  const sold = searchSoldLabel(product);
  const badge = product.badge ? String(product.badge).trim() : "";

  return (
    <Link className="jfy-card" to={`/product/${encodeURIComponent(product.id)}`} title={title}>
      <div className="jfy-card__img">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          width="220"
          height="220"
          onError={() => {
            const seed = encodeURIComponent(product.id);
            const fallback = `https://picsum.photos/seed/jfy-${seed}/440/440`;
            if (imgSrc !== fallback) setImgSrc(fallback);
          }}
        />
        {badge ? <span className="jfy-card__badge">{badge}</span> : null}
      </div>
      <div className="jfy-card__body">
        <p className="jfy-card__title">{title}</p>
        <div className="jfy-card__price-row">
          <span className="jfy-card__price">{searchFormatBdt(sale)}</span>
          {pct > 0 ? <span className="jfy-card__discount">-{pct}%</span> : null}
        </div>
        <div className="jfy-card__rating" aria-label={`${rating} stars`}>
          {starsHtml(rating)}
          <span className="jfy-card__reviews">({reviews})</span>
        </div>
        {sold ? <p className="jfy-card__sold">{sold}</p> : null}
      </div>
    </Link>
  );
}
