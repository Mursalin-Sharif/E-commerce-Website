require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const PORT = process.env.PORT || 8080;
const ROOT = path.join(__dirname, "..");
const CLIENT_DIST = path.join(ROOT, "client", "dist");
const UPLOADS_DIR = path.join(ROOT, "uploads");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "32mb" }));
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next(err);
});

app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/assets", express.static(path.join(ROOT, "assets")));
app.use("/admin", express.static(path.join(ROOT, "admin"), { index: "index.html" }));
app.get(["/admin", "/admin/"], (_req, res) => {
  res.sendFile(path.join(ROOT, "admin", "index.html"));
});
app.use("/css", express.static(path.join(ROOT, "css")));
app.use("/api", apiRoutes);
app.use("/api/admin", uploadRoutes);

const legacyMap = {
  "/index.html": "/landing",
  "/home.html": "/",
  "/tshirt.html": "/tshirt",
  "/product.html": "/product",
  "/review.html": "/review",
  "/contact.html": "/contact",
  "/services.html": "/services",
  "/privacy.html": "/privacy",
  "/help.html": "/help",
  "/cart.html": "/cart",
  "/login.html": "/login",
  "/signup.html": "/signup",
  "/category.html": "/category",
};

Object.entries(legacyMap).forEach(([from, to]) => {
  app.get(from, (req, res) => {
    let qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    if (from === "/product.html" && req.query.id) {
      return res.redirect(301, `/product/${encodeURIComponent(req.query.id)}`);
    }
    res.redirect(301, to + qs);
  });
});

if (process.env.NODE_ENV === "production" || require("fs").existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^\/(?!api|uploads|assets|admin|css).*/, (_req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
} else {
  app.use(express.static(ROOT, { index: false }));
  app.get("/", (_req, res) => {
    res.type("html").send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Dev</title></head><body style="font-family:sans-serif;padding:2rem">
      <h1>MERN dev mode</h1>
      <p>Run React client: <code>npm run client</code> → <a href="http://127.0.0.1:5173">http://127.0.0.1:5173</a></p>
      <p>API: <a href="/api/store">/api/store</a></p>
    </body></html>`);
  });
}

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API: http://127.0.0.1:${PORT}/api/store`);
    console.log(`React dev: http://127.0.0.1:5173 (npm run client)`);
    console.log(`Production: npm run build && NODE_ENV=production npm start`);
    console.log(`Admin password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
