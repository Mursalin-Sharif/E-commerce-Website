require("dotenv").config();
const connectDB = require("../config/db");
const Store = require("../models/Store");
const { readJsonStore } = require("../services/storeService");

async function seed() {
  await connectDB();
  const data = readJsonStore();
  await Store.findOneAndUpdate({ key: "main" }, { key: "main", ...data }, { upsert: true, new: true });
  console.log("MongoDB seeded:", data.products?.length || 0, "products");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
