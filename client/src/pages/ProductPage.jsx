import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import {
  getProductById,
  getCategoryById,
  productLabel,
  productImageUrl,
  categoryLabel,
  searchFormatBdt,
  searchDiscount,
  searchSalePrice,
} from "../utils/storeUtils";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, categories, settings, lang, tshirtProductIds, watchProductIds, smartwatchProductIds, landingProductIds, braProductIds, brazilJerseyProductIds, argentinaJerseyProductIds, portugalJerseyProductIds, spinJerseyProductIds, bikeStickerProductIds, bikeStickerPaperFullBodyBlackProductIds, shoesForMenProductIds, shoesForMenHighQualityProductIds, shoesForGirlsProductIds, shoesForGirlsSneakersProductIds, shoesForGirlsSneakersBlackProductIds, shoesForGirlsSneakersBlackAndWhiteProductIds } = useStore();
  const product = getProductById(products, id);

  if (!product) {
    return (
      <div className="container content-card" style={{ padding: "2rem" }}>
        <h1>Product not found</h1>
        <Link to="/">Back to store</Link>
      </div>
    );
  }

  const cat = getCategoryById(categories, product.category);
  const isTshirt = tshirtProductIds.includes(product.id) || (product.category === "apparel" && !braProductIds.includes(product.id) && !brazilJerseyProductIds.includes(product.id) && !argentinaJerseyProductIds.includes(product.id) && !portugalJerseyProductIds.includes(product.id) && !spinJerseyProductIds.includes(product.id) && !bikeStickerProductIds.includes(product.id) && !bikeStickerPaperFullBodyBlackProductIds.includes(product.id) && !shoesForMenProductIds.includes(product.id) && !shoesForMenHighQualityProductIds.includes(product.id) && !shoesForGirlsProductIds.includes(product.id) && !shoesForGirlsSneakersProductIds.includes(product.id) && !shoesForGirlsSneakersBlackProductIds.includes(product.id) && !shoesForGirlsSneakersBlackAndWhiteProductIds.includes(product.id) && /shirt|tee|tshirt|t-shirt|kaporer/i.test(`${product.keywords || ""} ${product.name || ""}`));
  const isBra = braProductIds.includes(product.id) || /bra for girls|\bbra\b|innerwear|lingerie/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isBrazilJersey =
    brazilJerseyProductIds.includes(product.id) ||
    /brazil jersey|world cup 2026.*brazil|brazil.*jersey/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isArgentinaJersey =
    argentinaJerseyProductIds.includes(product.id) ||
    /argentina jersey|world cup argentina|argentina.*jersey|albiceleste/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isPortugalJersey =
    portugalJerseyProductIds.includes(product.id) ||
    /protugal jersey|portugal jersey|portugal.*jersey|ronaldo 7 jersey/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isSpinJersey =
    spinJerseyProductIds.includes(product.id) ||
    /spin jersey|spain jersey|spain.*jersey|2 star spain|la roja/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isBikeStickers =
    bikeStickerProductIds.includes(product.id) ||
    (/bike sticker|motorcycle sticker|bike decal|motorcycle decal|helmet sticker|tank pad sticker/i.test(`${product.keywords || ""} ${product.name || ""}`) &&
      !bikeStickerPaperFullBodyBlackProductIds.includes(product.id) &&
      !/full body black|sticker paper.*black/i.test(`${product.keywords || ""} ${product.name || ""}`));
  const isBikeStickerPaperBlack =
    bikeStickerPaperFullBodyBlackProductIds.includes(product.id) ||
    /bike stickers paper full body black|full body black.*sticker paper|black.*full body.*vinyl wrap/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isShoesForMen =
    shoesForMenProductIds.includes(product.id) ||
    (product.category === "shoes" && /shoes for men|men shoes|mens shoes|men sneaker|men formal|men running/i.test(`${product.keywords || ""} ${product.name || ""}`) &&
      !shoesForMenHighQualityProductIds.includes(product.id) &&
      !shoesForGirlsProductIds.includes(product.id) &&
      !shoesForGirlsSneakersProductIds.includes(product.id) &&
      !shoesForGirlsSneakersBlackProductIds.includes(product.id) &&
      !shoesForGirlsSneakersBlackAndWhiteProductIds.includes(product.id) &&
      !/high quality|premium.*shoe/i.test(`${product.keywords || ""} ${product.name || ""}`));
  const isShoesForMenHighQuality =
    shoesForMenHighQualityProductIds.includes(product.id) ||
    /shoes for men high quality|high quality.*men.*shoe|premium.*men.*shoe/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isShoesForGirlsSneakersBlackAndWhite =
    shoesForGirlsSneakersBlackAndWhiteProductIds.includes(product.id) ||
    /shoes for girls sneakers black and white|black and white girls sneakers|black white girls sneakers/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isShoesForGirlsSneakersBlack =
    shoesForGirlsSneakersBlackProductIds.includes(product.id) ||
    (/shoes for girls sneakers black|black girls sneakers|black girl sneakers/i.test(`${product.keywords || ""} ${product.name || ""}`) &&
      !shoesForGirlsSneakersBlackAndWhiteProductIds.includes(product.id) &&
      !/shoes for girls sneakers black and white|black and white girls sneakers/i.test(`${product.keywords || ""} ${product.name || ""}`));
  const isShoesForGirlsSneakers =
    shoesForGirlsSneakersProductIds.includes(product.id) ||
    (/shoes for girls sneakers|girls sneakers|girl sneakers|sneakers for girls/i.test(`${product.keywords || ""} ${product.name || ""}`) &&
      !shoesForGirlsSneakersBlackProductIds.includes(product.id) &&
      !shoesForGirlsSneakersBlackAndWhiteProductIds.includes(product.id) &&
      !/shoes for girls sneakers black|black and white/i.test(`${product.keywords || ""} ${product.name || ""}`));
  const isShoesForGirls =
    shoesForGirlsProductIds.includes(product.id) ||
    (/shoes for girls|girls shoes|girl shoes|girls sneaker|girls sandal|girls school shoe/i.test(`${product.keywords || ""} ${product.name || ""}`) &&
      !shoesForGirlsSneakersProductIds.includes(product.id) &&
      !shoesForGirlsSneakersBlackProductIds.includes(product.id) &&
      !shoesForGirlsSneakersBlackAndWhiteProductIds.includes(product.id) &&
      !/shoes for girls sneakers|girls sneakers|girl sneakers/i.test(`${product.keywords || ""} ${product.name || ""}`));
  const isWatch = watchProductIds.includes(product.id) || /watch for man|wrist watch|analog watch/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isSmartwatch = smartwatchProductIds.includes(product.id) || product.category === "smartwatches" || /smart watch|smartwatch/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const isHeadphone =
    landingProductIds.includes(product.id) ||
    /headphone|earbud|earphone|headset|tws|buds/i.test(`${product.keywords || ""} ${product.name || ""}`);
  const backHref = isShoesForGirlsSneakersBlackAndWhite
    ? "/catalog?q=shoes%20for%20girls%20sneakers%20black%20and%20white"
    : isShoesForGirlsSneakersBlack
    ? "/catalog?q=shoes%20for%20girls%20sneakers%20black"
    : isShoesForGirlsSneakers
    ? "/catalog?q=shoes%20for%20girls%20sneakers"
    : isShoesForGirls
    ? "/catalog?q=shoes%20for%20girls"
    : isShoesForMenHighQuality
    ? "/catalog?q=shoes%20for%20men%20high%20quality"
    : isShoesForMen
    ? "/catalog?q=shoes%20for%20men"
    : isBikeStickerPaperBlack
    ? "/catalog?q=bike%20stickers%20paper%20full%20body%20black"
    : isBikeStickers
    ? "/catalog?q=bike%20stickers"
    : isSpinJersey
    ? "/spin-jersey"
    : isPortugalJersey
    ? "/portugal-jersey"
    : isArgentinaJersey
    ? "/argentina-jersey"
    : isBrazilJersey
    ? "/brazil-jersey"
    : isBra
      ? "/bra"
      : isTshirt
        ? "/tshirt"
        : isSmartwatch
          ? "/smartwatch"
          : isWatch
            ? "/watch"
            : isHeadphone
              ? "/headphone"
              : "/landing";
  const backLabel = isShoesForGirlsSneakersBlackAndWhite
    ? "Shoes for Girls Sneakers Black and White"
    : isShoesForGirlsSneakersBlack
    ? "Shoes for Girls Sneakers Black"
    : isShoesForGirlsSneakers
    ? "Shoes for Girls Sneakers"
    : isShoesForGirls
    ? "Shoes for Girls"
    : isShoesForMenHighQuality
    ? "Shoes for Men High Quality"
    : isShoesForMen
    ? "Shoes for Men"
    : isBikeStickerPaperBlack
    ? "Bike Stickers Paper Full Body Black"
    : isBikeStickers
    ? "Bike Stickers"
    : isSpinJersey
    ? "Spin Jersey"
    : isPortugalJersey
    ? "Portugal Jersey"
    : isArgentinaJersey
    ? "Argentina Jersey"
    : isBrazilJersey
    ? "Brazil Jersey"
    : isBra
      ? "Bra for Girls"
      : isTshirt
        ? "T-Shirt"
        : isSmartwatch
          ? "Smart Watch"
          : isWatch
            ? "Watch for Man"
            : isHeadphone
              ? "Headphone"
              : "Store";
  const sale = searchSalePrice(product);
  const original = product.originalPrice != null ? product.originalPrice : product.price;
  const gallery = [...new Set([product.imageUrl, ...(product.imageGallery || [])].filter(Boolean))];
  const desc = lang === "bn" ? product.descriptionBn || product.description : product.description;
  const highlights = lang === "bn" ? product.highlightsBn || product.highlights : product.highlights;
  const specs = product.specs || [];

  return (
    <div className="container container--daraz page-product page-product--expanded">
      <section className="pdp">
        <nav className="pdp-breadcrumb">
          <Link to={backHref}>{backLabel}</Link>
          <span>›</span>
          <Link to={backHref}>{cat ? categoryLabel(cat, lang) : "Products"}</Link>
          <span>›</span>
          <span>{productLabel(product, lang)}</span>
        </nav>
        <div className="pdp-shell">
          <div className="pdp-gallery">
            <div className="pdp-gallery__main">
              <img src={gallery[0] || productImageUrl(product)} alt={productLabel(product, lang)} />
            </div>
            <div className="pdp-gallery__thumbs">
              {gallery.map((src, i) => (
                <button key={i} type="button" className={`pdp-thumb${i === 0 ? " is-active" : ""}`}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="pdp-main">
            <div className="pdp-flash">
              <span className="pdp-flash__tag">{product.badge || "FLASH SALE"}</span>
              <span className="pdp-flash__sold">{product.sold || 0} sold</span>
            </div>
            <h1 className="pdp-title">{productLabel(product, lang)}</h1>
            <p className="pdp-brand">Brand: <strong>{product.brand || "No Brand"}</strong></p>
            <div className="pdp-pricebox">
              <div className="pdp-price">{searchFormatBdt(sale)}</div>
              <div className="pdp-pricebox__sub">
                <span className="pdp-pricebox__old">{searchFormatBdt(original)}</span>
                <span className="pdp-pricebox__off">-{searchDiscount(product)}%</span>
              </div>
            </div>
            <div className="pdp-actions">
              <button
                type="button"
                className="btn btn--sky"
                onClick={() => {
                  addToCart(product.id, 1);
                  navigate("/cart");
                }}
              >
                Buy Now
              </button>
              <button type="button" className="btn btn--primary" onClick={() => addToCart(product.id, 1)}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="pdp-details">
          <h2 className="pdp-details__title">Product details</h2>
          <div className="pdp-details__grid">
            <div className="pdp-details__main">
              <div className="pdp-details__block">
                <h3 className="pdp-details__subtitle">Description</h3>
                <div className="pdp-details__body">
                  {(desc || "").split(/\n+/).filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
              {Array.isArray(highlights) && highlights.length > 0 && (
                <div className="pdp-details__block">
                  <h3 className="pdp-details__subtitle">Highlights</h3>
                  <ul className="pdp-details__list">
                    {highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <aside className="pdp-details__aside">
              <div className="pdp-details__block">
                <h3 className="pdp-details__subtitle">Specifications</h3>
                <table className="pdp-specs">
                  <tbody>
                    {specs.map((row, i) => (
                      <tr key={i}>
                        <th>{lang === "bn" ? row.labelBn || row.label : row.label}</th>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
