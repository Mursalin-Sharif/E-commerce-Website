import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import SearchPage from "./SearchPage";
import BannerCarousel from "../components/home/BannerCarousel";
import SecondaryPromoBanner from "../components/home/SecondaryPromoBanner";
import CategoryStrip from "../components/home/CategoryStrip";
import HomeCategoriesGrid from "../components/home/HomeCategoriesGrid";
import FlashSaleSection from "../components/home/FlashSaleSection";
import HomeProductGrid from "../components/home/HomeProductGrid";

export default function HomePage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const cat = params.get("cat") || "";
  const brand = params.get("brand") || "";

  if (q || cat || brand) return <SearchPage mode={q ? "search" : "home"} />;

  const {
    banners,
    flashSaleIds,
    homeProductIds,
    homeCategoryIcons,
    homeCategories,
    products,
    categories,
    settings,
    lang,
  } = useStore();

  const home = settings.home || {};

  return (
    <div className="page-home daraz-home">
      <div className="container container--daraz">
        {home.showBanner !== false ? <BannerCarousel banners={banners} lang={lang} /> : null}
        <SecondaryPromoBanner promo={home.promoBanner} lang={lang} />
        {home.showCategoryStrip !== false ? (
          <CategoryStrip icons={homeCategoryIcons} categories={categories} lang={lang} />
        ) : null}
        {home.showCategoriesGrid !== false ? (
          <HomeCategoriesGrid homeCategories={homeCategories} products={products} lang={lang} />
        ) : null}
        <FlashSaleSection
          products={products}
          flashSaleIds={flashSaleIds}
          categories={categories}
          settings={settings}
          lang={lang}
        />
        <HomeProductGrid
          homeProductIds={homeProductIds}
          products={products}
          settings={settings}
          lang={lang}
        />
      </div>
    </div>
  );
}
