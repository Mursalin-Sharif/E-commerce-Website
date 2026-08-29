const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true, index: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    categories: { type: [mongoose.Schema.Types.Mixed], default: [] },
    products: { type: [mongoose.Schema.Types.Mixed], default: [] },
    reviews: { type: [mongoose.Schema.Types.Mixed], default: [] },
    banners: { type: [mongoose.Schema.Types.Mixed], default: [] },
    flashSaleIds: { type: [String], default: [] },
    featuredCategoryIds: { type: [String], default: [] },
    homeCategoryIcons: { type: [mongoose.Schema.Types.Mixed], default: [] },
    homeProductIds: { type: [String], default: [] },
    contactProductIds: { type: [String], default: [] },
    landingProductIds: { type: [String], default: [] },
    tshirtProductIds: { type: [String], default: [] },
    watchProductIds: { type: [String], default: [] },
    smartwatchProductIds: { type: [String], default: [] },
    braProductIds: { type: [String], default: [] },
    brazilJerseyProductIds: { type: [String], default: [] },
    argentinaJerseyProductIds: { type: [String], default: [] },
    portugalJerseyProductIds: { type: [String], default: [] },
    spinJerseyProductIds: { type: [String], default: [] },
    bikeStickerProductIds: { type: [String], default: [] },
    bikeStickerPaperFullBodyBlackProductIds: { type: [String], default: [] },
    shoesForMenProductIds: { type: [String], default: [] },
    shoesForMenHighQualityProductIds: { type: [String], default: [] },
    shoesForGirlsProductIds: { type: [String], default: [] },
    shoesForGirlsSneakersProductIds: { type: [String], default: [] },
    shoesForGirlsSneakersBlackProductIds: { type: [String], default: [] },
    shoesForGirlsSneakersBlackAndWhiteProductIds: { type: [String], default: [] },
    sidebarCategoryIds: { type: [String], default: [] },
    homeCategories: {
      type: mongoose.Schema.Types.Mixed,
      default: { title: "Categories", titleBn: "ক্যাটাগরি", items: [] },
    },
    trendingSearches: { type: [mongoose.Schema.Types.Mixed], default: [] },
    brands: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model("Store", storeSchema);
