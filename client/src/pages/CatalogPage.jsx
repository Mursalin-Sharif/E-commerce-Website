import { useSearchParams } from "react-router-dom";
import SearchPage from "./SearchPage";
import { isBikeStickersQuery, isBikeStickerPaperFullBodyBlackQuery, isShoesForMenQuery, isShoesForMenHighQualityQuery, isShoesForGirlsQuery, isShoesForGirlsSneakersQuery, isShoesForGirlsSneakersBlackQuery, isShoesForGirlsSneakersBlackAndWhiteQuery } from "../utils/storeUtils";

export default function CatalogPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  if (isShoesForGirlsSneakersBlackAndWhiteQuery(q)) return <SearchPage mode="shoes-for-girls-sneakers-black-and-white" />;
  if (isShoesForGirlsSneakersBlackQuery(q)) return <SearchPage mode="shoes-for-girls-sneakers-black" />;
  if (isShoesForGirlsSneakersQuery(q)) return <SearchPage mode="shoes-for-girls-sneakers" />;
  if (isShoesForGirlsQuery(q)) return <SearchPage mode="shoes-for-girls" />;
  if (isShoesForMenHighQualityQuery(q)) return <SearchPage mode="shoes-for-men-high-quality" />;
  if (isShoesForMenQuery(q)) return <SearchPage mode="shoes-for-men" />;
  if (isBikeStickerPaperFullBodyBlackQuery(q)) return <SearchPage mode="bike-sticker-paper-black" />;
  if (isBikeStickersQuery(q)) return <SearchPage mode="bike-stickers" />;
  return <SearchPage mode="search" />;
}
