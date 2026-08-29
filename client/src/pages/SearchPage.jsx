import { useMemo, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import SearchResultCard from "../components/SearchResultCard";
import {
  searchProducts,
  sortProducts,
  paginateList,
  itemsFoundCount,
  getSidebarCategories,
  categoryLabel,
  tshirtCatalogProducts,
  watchCatalogProducts,
  smartwatchCatalogProducts,
  headphoneCatalogProducts,
  braCatalogProducts,
  brazilJerseyCatalogProducts,
  argentinaJerseyCatalogProducts,
  portugalJerseyCatalogProducts,
  spinJerseyCatalogProducts,
  bikeStickersCatalogProducts,
  bikeStickerPaperFullBodyBlackCatalogProducts,
  shoesForMenCatalogProducts,
  shoesForMenHighQualityCatalogProducts,
  shoesForGirlsCatalogProducts,
  shoesForGirlsSneakersCatalogProducts,
  shoesForGirlsSneakersBlackCatalogProducts,
  shoesForGirlsSneakersBlackAndWhiteCatalogProducts,
} from "../utils/storeUtils";

const SORT_OPTIONS = [
  { id: "best", label: "Best Match" },
  { id: "sold", label: "Top Sales" },
  { id: "price-asc", label: "Price low to high" },
  { id: "price-desc", label: "Price high to low" },
];

export default function SearchPage({ mode = "home" }) {
  const { products, categories, settings, lang, homeProductIds, landingProductIds, tshirtProductIds, watchProductIds, smartwatchProductIds, braProductIds, brazilJerseyProductIds, argentinaJerseyProductIds, portugalJerseyProductIds, spinJerseyProductIds, bikeStickerProductIds, bikeStickerPaperFullBodyBlackProductIds, shoesForMenProductIds, shoesForMenHighQualityProductIds, shoesForGirlsProductIds, shoesForGirlsSneakersProductIds, shoesForGirlsSneakersBlackProductIds, shoesForGirlsSneakersBlackAndWhiteProductIds, sidebarCategoryIds, trendingSearches } = useStore();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const [catsExpanded, setCatsExpanded] = useState(false);

  const q = (params.get("q") || "").trim();
  const cat = params.get("cat") || "";
  const brand = params.get("brand") || "";
  const mall = params.get("mall") === "1";
  const sort = params.get("sort") || "best";
  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

  const landingQ = settings.landing?.searchQuery || "headphone";
  const tshirtQ = settings.tshirt?.searchQuery || "t shirt";
  const watchQ = settings.watch?.searchQuery || "watch for man";
  const smartwatchQ = settings.smartwatch?.searchQuery || "smart watch";
  const braQ = settings.bra?.searchQuery || "bra for girls";
  const brazilJerseyQ = settings.brazilJersey?.searchQuery || "brazil jersey 2026 world cup";
  const argentinaJerseyQ = settings.argentinaJersey?.searchQuery || "jersey 2026 world cup argentina";
  const portugalJerseyQ = settings.portugalJersey?.searchQuery || "protugal jersey";
  const spinJerseyQ = settings.spinJersey?.searchQuery || "spin jersey 2026 world cup 2 star";
  const bikeStickersQ = settings.bikeStickers?.searchQuery || "bike stickers";
  const bikeStickerPaperQ = settings.bikeStickerPaperFullBodyBlack?.searchQuery || "bike stickers paper full body black";
  const shoesForMenQ = settings.shoesForMen?.searchQuery || "shoes for men";
  const shoesForMenHighQualityQ = settings.shoesForMenHighQuality?.searchQuery || "shoes for men high quality";
  const shoesForGirlsQ = settings.shoesForGirls?.searchQuery || "shoes for girls";
  const shoesForGirlsSneakersQ = settings.shoesForGirlsSneakers?.searchQuery || "shoes for girls sneakers";
  const shoesForGirlsSneakersBlackQ = settings.shoesForGirlsSneakersBlack?.searchQuery || "shoes for girls sneakers black";
  const shoesForGirlsSneakersBlackAndWhiteQ = settings.shoesForGirlsSneakersBlackAndWhite?.searchQuery || "shoes for girls sneakers black and white";
  const hasFilters = !!(q || cat || brand);
  const isCatalogMode = mode === "landing" || mode === "headphone" || mode === "tshirt" || mode === "watch" || mode === "smartwatch" || mode === "bra" || mode === "brazil-jersey" || mode === "argentina-jersey" || mode === "portugal-jersey" || mode === "spin-jersey" || mode === "bike-stickers" || mode === "bike-sticker-paper-black" || mode === "shoes-for-men" || mode === "shoes-for-men-high-quality" || mode === "shoes-for-girls" || mode === "shoes-for-girls-sneakers" || mode === "shoes-for-girls-sneakers-black" || mode === "shoes-for-girls-sneakers-black-and-white";

  const list = useMemo(() => {
    let items;
    if (mode === "tshirt") {
      items = tshirtCatalogProducts(products, categories, tshirtProductIds, q || tshirtQ, { cat, brand });
    } else if (mode === "watch") {
      items = watchCatalogProducts(products, categories, watchProductIds, q || watchQ, { cat, brand });
    } else if (mode === "smartwatch") {
      items = smartwatchCatalogProducts(products, categories, smartwatchProductIds, q || smartwatchQ, { cat, brand });
    } else if (mode === "bra") {
      items = braCatalogProducts(products, categories, braProductIds, q || braQ, { cat, brand });
    } else if (mode === "brazil-jersey") {
      items = brazilJerseyCatalogProducts(products, categories, brazilJerseyProductIds, q || brazilJerseyQ, { cat, brand });
    } else if (mode === "argentina-jersey") {
      items = argentinaJerseyCatalogProducts(products, categories, argentinaJerseyProductIds, q || argentinaJerseyQ, { cat, brand });
    } else if (mode === "portugal-jersey") {
      items = portugalJerseyCatalogProducts(products, categories, portugalJerseyProductIds, q || portugalJerseyQ, { cat, brand });
    } else if (mode === "spin-jersey") {
      items = spinJerseyCatalogProducts(products, categories, spinJerseyProductIds, q || spinJerseyQ, { cat, brand });
    } else if (mode === "bike-stickers") {
      items = bikeStickersCatalogProducts(products, categories, bikeStickerProductIds, q || bikeStickersQ, { cat, brand });
    } else if (mode === "bike-sticker-paper-black") {
      items = bikeStickerPaperFullBodyBlackCatalogProducts(products, categories, bikeStickerPaperFullBodyBlackProductIds, q || bikeStickerPaperQ, { cat, brand });
    } else if (mode === "shoes-for-men") {
      items = shoesForMenCatalogProducts(products, categories, shoesForMenProductIds, q || shoesForMenQ, { cat, brand });
    } else if (mode === "shoes-for-men-high-quality") {
      items = shoesForMenHighQualityCatalogProducts(products, categories, shoesForMenHighQualityProductIds, q || shoesForMenHighQualityQ, { cat, brand });
    } else if (mode === "shoes-for-girls") {
      items = shoesForGirlsCatalogProducts(products, categories, shoesForGirlsProductIds, q || shoesForGirlsQ, { cat, brand });
    } else if (mode === "shoes-for-girls-sneakers") {
      items = shoesForGirlsSneakersCatalogProducts(products, categories, shoesForGirlsSneakersProductIds, q || shoesForGirlsSneakersQ, { cat, brand });
    } else if (mode === "shoes-for-girls-sneakers-black") {
      items = shoesForGirlsSneakersBlackCatalogProducts(products, categories, shoesForGirlsSneakersBlackProductIds, q || shoesForGirlsSneakersBlackQ, { cat, brand });
    } else if (mode === "shoes-for-girls-sneakers-black-and-white") {
      items = shoesForGirlsSneakersBlackAndWhiteCatalogProducts(products, categories, shoesForGirlsSneakersBlackAndWhiteProductIds, q || shoesForGirlsSneakersBlackAndWhiteQ, { cat, brand });
    } else if (mode === "landing" || mode === "headphone") {
      items = headphoneCatalogProducts(products, categories, landingProductIds, q || landingQ, { cat, brand });
    } else if (mode === "search") {
      items = searchProducts(products, categories, q, { cat, brand });
    } else if (mode === "home" && !hasFilters) {
      items = homeProductIds.length
        ? homeProductIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)
        : products;
    } else {
      items = searchProducts(products, categories, q, { cat, brand });
    }
    if (mall) items = items.filter((p) => p.mall === true);
    return sortProducts(items, sort);
  }, [mode, hasFilters, q, cat, brand, mall, sort, products, categories, homeProductIds, landingProductIds, tshirtProductIds, watchProductIds, smartwatchProductIds, braProductIds, brazilJerseyProductIds, argentinaJerseyProductIds, portugalJerseyProductIds, spinJerseyProductIds, bikeStickerProductIds, bikeStickerPaperFullBodyBlackProductIds, shoesForMenProductIds, shoesForMenHighQualityProductIds, shoesForGirlsProductIds, shoesForGirlsSneakersProductIds, shoesForGirlsSneakersBlackProductIds, shoesForGirlsSneakersBlackAndWhiteProductIds, landingQ, tshirtQ, watchQ, smartwatchQ, braQ, brazilJerseyQ, argentinaJerseyQ, portugalJerseyQ, spinJerseyQ, bikeStickersQ, bikeStickerPaperQ, shoesForMenQ, shoesForMenHighQualityQ, shoesForGirlsQ, shoesForGirlsSneakersQ, shoesForGirlsSneakersBlackQ, shoesForGirlsSneakersBlackAndWhiteQ]);

  const paged = paginateList(list, page);
  const defaultCatalogQ =
    mode === "landing" || mode === "headphone"
      ? landingQ
      : mode === "tshirt"
        ? tshirtQ
        : mode === "watch"
          ? watchQ
          : mode === "smartwatch"
            ? smartwatchQ
            : mode === "bra"
              ? braQ
              : mode === "brazil-jersey"
                ? brazilJerseyQ
                : mode === "argentina-jersey"
                  ? argentinaJerseyQ
                  : mode === "portugal-jersey"
                    ? portugalJerseyQ
                    : mode === "spin-jersey"
                      ? spinJerseyQ
                      : mode === "bike-stickers"
                        ? bikeStickersQ
                        : mode === "bike-sticker-paper-black"
                          ? bikeStickerPaperQ
                          : mode === "shoes-for-men"
                            ? shoesForMenQ
                            : mode === "shoes-for-men-high-quality"
                              ? shoesForMenHighQualityQ
                              : mode === "shoes-for-girls"
                                ? shoesForGirlsQ
                                : mode === "shoes-for-girls-sneakers"
                                  ? shoesForGirlsSneakersQ
                                  : mode === "shoes-for-girls-sneakers-black"
                                    ? shoesForGirlsSneakersBlackQ
                                    : mode === "shoes-for-girls-sneakers-black-and-white"
                                      ? shoesForGirlsSneakersBlackAndWhiteQ
              : "";
  const effectiveQ = q || (isCatalogMode && !hasFilters ? defaultCatalogQ : q);
  const heading =
    q ||
    (mode === "landing" || mode === "headphone" ? settings.landing?.resultTitle || landingQ : "") ||
    (mode === "tshirt" ? settings.tshirt?.resultTitle || tshirtQ : "") ||
    (mode === "watch" ? settings.watch?.resultTitle || watchQ : "") ||
    (mode === "smartwatch" ? settings.smartwatch?.resultTitle || smartwatchQ : "") ||
    (mode === "bra" ? settings.bra?.resultTitle || braQ : "") ||
    (mode === "brazil-jersey" ? settings.brazilJersey?.resultTitle || brazilJerseyQ : "") ||
    (mode === "argentina-jersey" ? settings.argentinaJersey?.resultTitle || argentinaJerseyQ : "") ||
    (mode === "portugal-jersey" ? settings.portugalJersey?.resultTitle || portugalJerseyQ : "") ||
    (mode === "spin-jersey" ? settings.spinJersey?.resultTitle || spinJerseyQ : "") ||
    (mode === "bike-stickers" ? settings.bikeStickers?.resultTitle || bikeStickersQ : "") ||
    (mode === "bike-sticker-paper-black" ? settings.bikeStickerPaperFullBodyBlack?.resultTitle || bikeStickerPaperQ : "") ||
    (mode === "shoes-for-men" ? settings.shoesForMen?.resultTitle || shoesForMenQ : "") ||
    (mode === "shoes-for-men-high-quality" ? settings.shoesForMenHighQuality?.resultTitle || shoesForMenHighQualityQ : "") ||
    (mode === "shoes-for-girls" ? settings.shoesForGirls?.resultTitle || shoesForGirlsQ : "") ||
    (mode === "shoes-for-girls-sneakers" ? settings.shoesForGirlsSneakers?.resultTitle || shoesForGirlsSneakersQ : "") ||
    (mode === "shoes-for-girls-sneakers-black" ? settings.shoesForGirlsSneakersBlack?.resultTitle || shoesForGirlsSneakersBlackQ : "") ||
    (mode === "shoes-for-girls-sneakers-black-and-white" ? settings.shoesForGirlsSneakersBlackAndWhite?.resultTitle || shoesForGirlsSneakersBlackAndWhiteQ : "") ||
    (lang === "bn" ? settings.homePageTitleBn || "হোম" : settings.homePageTitle || "Just For You");

  const countQuery = q || defaultCatalogQ || effectiveQ;
  const found = hasFilters || isCatalogMode
    ? itemsFoundCount(countQuery, list, settings, trendingSearches)
    : list.length;
  const sidebar = getSidebarCategories(categories, sidebarCategoryIds);
  const sidebarPreviewCount = 18;
  const visibleCats = catsExpanded ? sidebar : sidebar.slice(0, sidebarPreviewCount);

  const basePath =
    mode === "landing"
      ? "/landing"
      : mode === "headphone"
        ? "/headphone"
        : mode === "tshirt"
          ? "/tshirt"
          : mode === "watch"
            ? "/watch"
            : mode === "smartwatch"
              ? "/smartwatch"
              : mode === "bra"
                ? "/bra"
                : mode === "brazil-jersey"
                  ? "/brazil-jersey"
                  : mode === "argentina-jersey"
                    ? "/argentina-jersey"
                    : mode === "portugal-jersey"
                      ? "/portugal-jersey"
                      : mode === "spin-jersey"
                        ? "/spin-jersey"
                        : mode === "bike-stickers"
                          ? (location.pathname === "/catalog" ? "/catalog" : "/bike-stickers")
                          : mode === "bike-sticker-paper-black"
                            ? (location.pathname === "/catalog" ? "/catalog" : "/bike-sticker-paper-full-body-black")
                            : mode === "shoes-for-men"
                              ? (location.pathname === "/catalog" ? "/catalog" : "/shoes-for-men")
                              : mode === "shoes-for-men-high-quality"
                                ? (location.pathname === "/catalog" ? "/catalog" : "/shoes-for-men-high-quality")
                                : mode === "shoes-for-girls"
                                  ? (location.pathname === "/catalog" ? "/catalog" : "/shoes-for-girls")
                                  : mode === "shoes-for-girls-sneakers"
                                    ? (location.pathname === "/catalog" ? "/catalog" : "/shoes-for-girls-sneakers")
                                    : mode === "shoes-for-girls-sneakers-black"
                                      ? (location.pathname === "/catalog" ? "/catalog" : "/shoes-for-girls-sneakers-black")
                                      : mode === "shoes-for-girls-sneakers-black-and-white"
                                        ? (location.pathname === "/catalog" ? "/catalog" : "/shoes-for-girls-sneakers-black-and-white")
                : mode === "search"
                  ? "/search"
                  : "/";

  function updateParams(next) {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v === "" || v == null || v === false) p.delete(k);
      else p.set(k, String(v));
    });
    setParams(p);
  }

  const bodyClass =
    mode === "tshirt"
      ? "page-search tshirt-store"
      : mode === "watch"
        ? "page-search watch-store"
        : mode === "smartwatch"
          ? "page-search smartwatch-store"
          : mode === "bra"
            ? "page-search bra-store"
            : mode === "brazil-jersey"
              ? "page-search brazil-jersey-store"
              : mode === "argentina-jersey"
                ? "page-search argentina-jersey-store"
                : mode === "portugal-jersey"
                  ? "page-search portugal-jersey-store"
                  : mode === "spin-jersey"
                    ? "page-search spin-jersey-store"
                    : mode === "bike-stickers"
                      ? "page-search bike-stickers-store"
                      : mode === "bike-sticker-paper-black"
                        ? "page-search bike-sticker-paper-black-store"
                        : mode === "shoes-for-men"
                          ? "page-search shoes-for-men-store"
                          : mode === "shoes-for-men-high-quality"
                            ? "page-search shoes-for-men-high-quality-store"
                            : mode === "shoes-for-girls"
                              ? "page-search shoes-for-girls-store"
                              : mode === "shoes-for-girls-sneakers"
                                ? "page-search shoes-for-girls-sneakers-store"
                                : mode === "shoes-for-girls-sneakers-black"
                                  ? "page-search shoes-for-girls-sneakers-black-store"
                                  : mode === "shoes-for-girls-sneakers-black-and-white"
                                    ? "page-search shoes-for-girls-sneakers-black-and-white-store"
            : mode === "headphone"
            ? "page-search headphone-store"
            : mode === "landing"
              ? "landing-route page-search landing-store"
              : "page-search";

  return (
    <div className={bodyClass}>
      <div className="container container--daraz">
        <div className="search-layout">
          <aside className="search-sidebar">
            <div className="search-filter">
              <h3 className="search-filter__title">Category</h3>
              <ul className="search-filter__list">
                {visibleCats.map((c) => (
                  <li key={c.id}>
                    <Link className={`search-filter__link${cat === c.id ? " is-active" : ""}`} to={`${basePath}?cat=${c.id}&q=${encodeURIComponent(effectiveQ || q)}`}>
                      {categoryLabel(c, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
              {sidebar.length > sidebarPreviewCount && (
                <button type="button" className="search-filter__toggle" onClick={() => setCatsExpanded(!catsExpanded)}>
                  {catsExpanded ? "VIEW LESS" : "VIEW MORE"}
                </button>
              )}
            </div>
          </aside>
          <div className="search-main">
            <div className="search-main__panel">
              <h1 className="search-main__title">{heading}</h1>
              <p className="search-main__count">
                {hasFilters || isCatalogMode
                  ? `${found.toLocaleString("en-BD")} items found for "${heading}"`
                  : `${found.toLocaleString("en-BD")} products`}
              </p>
              <div className="search-toolbar">
                <div className="search-sort">
                  <span>Sort By:</span>
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.id} type="button" className={`search-sort-btn${sort === opt.id ? " is-active" : ""}`} onClick={() => updateParams({ sort: opt.id, page: 1 })}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`sr-grid sr-grid--grid`}>
                {paged.items.length ? (
                  paged.items.map((p) => <SearchResultCard key={p.id} product={p} lang={lang} settings={settings} />)
                ) : (
                  <p className="search-main__empty">
                    No products found. Try another keyword or check Admin →{" "}
                    {mode === "bra"
                      ? "Bra for Girls"
                      : mode === "headphone" || mode === "landing"
                      ? "Headphone"
                      : mode === "smartwatch"
                        ? "Smart Watch"
                        : mode === "watch"
                          ? "Watch for Man"
                          : mode === "tshirt"
                            ? "T-Shirt"
                            : mode === "bike-stickers"
                              ? "Bike Stickers"
                              : mode === "bike-sticker-paper-black"
                                ? "Bike Stickers Paper Full Body Black"
                                : mode === "shoes-for-men"
                                  ? "Shoes for Men"
                                  : mode === "shoes-for-men-high-quality"
                                    ? "Shoes for Men High Quality"
                                    : mode === "shoes-for-girls"
                                      ? "Shoes for Girls"
                                      : mode === "shoes-for-girls-sneakers"
                                        ? "Shoes for Girls Sneakers"
                                        : mode === "shoes-for-girls-sneakers-black"
                                          ? "Shoes for Girls Sneakers Black"
                                          : mode === "shoes-for-girls-sneakers-black-and-white"
                                            ? "Shoes for Girls Sneakers Black and White"
                            : "products"}.
                  </p>
                )}
              </div>
              {paged.totalPages > 1 && (
                <nav className="sr-pagination">
                  {Array.from({ length: Math.min(5, paged.totalPages) }, (_, i) => {
                    const n = i + 1;
                    return (
                      <button key={n} type="button" className={`sr-page${n === paged.page ? " is-active" : ""}`} onClick={() => updateParams({ page: n })}>
                        {n}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
