const fs = require("fs");
const path = require("path");
const Store = require("../models/Store");

const JSON_PATH = path.join(__dirname, "..", "..", "data", "store.json");

function readJsonStore() {
  return JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
}

async function getStoreDocument() {
  let doc = await Store.findOne({ key: "main" });
  if (!doc) {
    const seed = readJsonStore();
    doc = await Store.create({ key: "main", ...seed });
    console.log("Seeded MongoDB from data/store.json");
  }
  return doc;
}

function toPlainStore(doc) {
  const obj = doc.toObject();
  delete obj.__v;
  delete obj._id;
  delete obj.key;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
}

async function getStore() {
  const doc = await getStoreDocument();
  return toPlainStore(doc);
}

async function saveStore(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid store payload");
  }
  const doc = await getStoreDocument();
  const { key, _id, __v, createdAt, updatedAt, ...data } = payload;
  Object.assign(doc, data);
  await doc.save();
  return toPlainStore(doc);
}

module.exports = { getStore, saveStore, readJsonStore };
