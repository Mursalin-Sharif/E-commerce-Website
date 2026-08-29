require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const apiRoutes = require("./routes/api.routes");
const uploadRoutes = require("./routes/upload.routes");

function createApp({ serveSpa = true } = {}) {
  const app = express();
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
  app.use("/admin", express.static(path.join(ROOT, "admin"), { index: false }));
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

  if (!serveSpa) {
    return app;
  }

  if (process.env.NODE_ENV === "production" || require("fs").existsSync(CLIENT_DIST)) {
    app.use(express.static(CLIENT_DIST));
    app.get(/^\/(?!api|uploads|assets|css)(?!admin\/).*/, (_req, res) => {
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

  return app;
}

module.exports = createApp;
