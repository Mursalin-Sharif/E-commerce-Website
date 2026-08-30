const mongoose = require("mongoose");

let dbAvailable = false;

async function connectDB() {
  if (dbAvailable && mongoose.connection.readyState === 1) return true;

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    dbAvailable = true;
    console.log("MongoDB connected:", uri.replace(/\/\/.*@/, "//***@"));
    return true;
  } catch (err) {
    dbAvailable = false;
    console.warn("MongoDB unavailable, using JSON store:", err.message);
    return false;
  }
}

function isDbConnected() {
  return dbAvailable && mongoose.connection.readyState === 1;
}

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
