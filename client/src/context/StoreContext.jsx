import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadStore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/store");
      if (!r.ok) throw new Error("Store unavailable");
      setStore(await r.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadStore();
  }, [reloadStore]);

  const value = useMemo(
    () => ({
      store,
      loading,
      error,
      reloadStore,
      lang,
      setLang: (next) => {
        localStorage.setItem("lang", next);
        setLang(next);
      },
      settings: store?.settings || {},
      products: (store?.products || []).filter((p) => p.active !== false),
      categories: store?.categories || [],
      reviews: store?.reviews || [],
      homeProductIds: store?.homeProductIds || [],
      contactProductIds: store?.contactProductIds || [],
      flashSaleIds: store?.flashSaleIds || [],
      banners: (store?.banners || []).filter((b) => b.active !== false),
      homeCategoryIcons: store?.homeCategoryIcons || [],
      homeCategories: store?.homeCategories || { title: "Categories", titleBn: "ক্যাটাগরি", items: [] },
      landingProductIds: store?.landingProductIds || [],
      tshirtProductIds: store?.tshirtProductIds || [],
      watchProductIds: store?.watchProductIds || [],
      smartwatchProductIds: store?.smartwatchProductIds || [],
      braProductIds: store?.braProductIds || [],
      brazilJerseyProductIds: store?.brazilJerseyProductIds || [],
      argentinaJerseyProductIds: store?.argentinaJerseyProductIds || [],
      portugalJerseyProductIds: store?.portugalJerseyProductIds || [],
      spinJerseyProductIds: store?.spinJerseyProductIds || [],
      bikeStickerProductIds: store?.bikeStickerProductIds || [],
      bikeStickerPaperFullBodyBlackProductIds: store?.bikeStickerPaperFullBodyBlackProductIds || [],
      shoesForMenProductIds: store?.shoesForMenProductIds || [],
      shoesForMenHighQualityProductIds: store?.shoesForMenHighQualityProductIds || [],
      shoesForGirlsProductIds: store?.shoesForGirlsProductIds || [],
      shoesForGirlsSneakersProductIds: store?.shoesForGirlsSneakersProductIds || [],
      shoesForGirlsSneakersBlackProductIds: store?.shoesForGirlsSneakersBlackProductIds || [],
      shoesForGirlsSneakersBlackAndWhiteProductIds: store?.shoesForGirlsSneakersBlackAndWhiteProductIds || [],
      sidebarCategoryIds: store?.sidebarCategoryIds || [],
      trendingSearches: store?.trendingSearches || [],
      brands: store?.brands || [],
    }),
    [store, loading, error, lang, reloadStore]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
