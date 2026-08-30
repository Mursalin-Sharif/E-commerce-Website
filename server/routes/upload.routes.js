const express = require("express");
const fs = require("fs");
const path = require("path");
const { auth } = require("../middleware/auth");

const router = express.Router();
const UPLOADS_DIR = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "..", "..", "uploads");
const ALLOWED_UPLOAD_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".webm"]);

try {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch (err) {
  console.warn("Uploads directory unavailable:", err.message);
}

router.post("/upload", auth, (req, res) => {
  try {
    const { data, filename } = req.body || {};
    if (!data || typeof data !== "string") {
      return res.status(400).json({ error: "Missing file data" });
    }
    const match = data.match(/^data:((?:image|video)\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "Invalid file data URL" });
    }
    const mime = match[1].toLowerCase();
    const extFromMime = {
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
    }[mime];
    const rawName = String(filename || "upload").replace(/[^a-zA-Z0-9._-]/g, "");
    const ext = extFromMime || path.extname(rawName).toLowerCase() || ".png";
    if (!ALLOWED_UPLOAD_EXT.has(ext)) {
      return res.status(400).json({ error: "Unsupported file type" });
    }
    const safeBase = path.basename(rawName, path.extname(rawName)) || "upload";
    const outName = `${Date.now()}-${safeBase}${ext}`;
    const outPath = path.join(UPLOADS_DIR, outName);
    const buf = Buffer.from(match[2], "base64");
    if (buf.length > 28 * 1024 * 1024) {
      return res.status(400).json({ error: "File too large (max ~28MB)" });
    }
    fs.writeFileSync(outPath, buf);
    res.json({ url: `/uploads/${outName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/upload", auth, (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
      return res.status(400).json({ error: "Invalid upload URL" });
    }
    const name = path.basename(url);
    const filePath = path.join(UPLOADS_DIR, name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
