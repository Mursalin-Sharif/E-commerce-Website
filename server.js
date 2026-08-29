const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const STORE_PATH = path.join(ROOT, "data", "store.json");
const UPLOADS_DIR = path.join(ROOT, "uploads");
const ADMIN_PASSWORD_HASH = hashPassword(process.env.ADMIN_PASSWORD || "admin123");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(express.json({ limit: "32mb" }));
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next(err);
});
app.use(express.static(ROOT, { index: "home.html" }));

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "admin123";
}

function createSessionToken() {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  if (sig !== expected) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() <= exp;
}

function readStore() {
  const raw = fs.readFileSync(STORE_PATH, "utf8");
  return JSON.parse(raw);
}

function writeStore(data) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/store", (_req, res) => {
  try {
    res.json(readStore());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (hashPassword(password) !== ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = createSessionToken();
  res.json({ token });
});

app.put("/api/store", auth, (req, res) => {
  try {
    const next = req.body;
    if (!next || typeof next !== "object") {
      return res.status(400).json({ error: "Invalid store payload" });
    }
    writeStore(next);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const ALLOWED_UPLOAD_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".webm"]);

app.post("/api/admin/upload", auth, (req, res) => {
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

app.delete("/api/admin/upload", auth, (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
      return res.status(400).json({ error: "Invalid upload URL" });
    }
    const name = path.basename(url);
    if (!name || name !== url.slice("/uploads/".length)) {
      return res.status(400).json({ error: "Invalid upload path" });
    }
    const filePath = path.join(UPLOADS_DIR, name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Store: http://127.0.0.1:${PORT}`);
  console.log(`Admin: http://127.0.0.1:${PORT}/admin/`);
  console.log(`Default admin password: admin123`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    console.error("Stop the other server (often python), then run: npm start");
    process.exit(1);
  }
  throw err;
});
