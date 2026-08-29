const crypto = require("crypto");

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "admin123";
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function createSession() {
  const exp = Date.now() + TOKEN_TTL_MS;
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
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  return true;
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = { auth, hashPassword, createSession, verifyToken };
