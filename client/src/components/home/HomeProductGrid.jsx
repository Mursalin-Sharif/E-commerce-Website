import JfyProductGrid from "../JfyProductGrid";

export default function HomeProductGrid({ homeProductIds, products, settings, lang }) {
  const home = settings.home || {};
  const title =
    lang === "bn"
      ? settings.homePageTitleBn || home.justForYouTitleBn || "আপনার জন্য"
      : settings.homePageTitle || home.justForYouTitle || "Just For You";
  const loadMore = lang === "bn" ? home.loadMoreBn || "আরও দেখুন" : home.loadMore || "LOAD MORE";

  return (
    <JfyProductGrid
      productIds={homeProductIds}
      products={products}
      title={title}
      loadMoreLabel={loadMore}
      show={home.showJustForYou !== false}
      lang={lang}
      emptyHint="Choose products in Admin → Home products."
      adminLink="/admin#admin-home"
    />
  );
}
