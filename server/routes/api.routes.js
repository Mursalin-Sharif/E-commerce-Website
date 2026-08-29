const express = require("express");
const { getStore, saveStore } = require("../services/storeService");
const { auth, hashPassword, createSession } = require("../middleware/auth");

const router = express.Router();

router.get("/store", async (_req, res) => {
  try {
    res.json(await getStore());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/login", (req, res) => {
  const { password } = req.body || {};
  const expected = hashPassword(process.env.ADMIN_PASSWORD || "admin123");
  if (hashPassword(password) !== expected) {
    return res.status(401).json({ error: "Invalid password" });
  }
  res.json({ token: createSession() });
});

router.put("/store", auth, async (req, res) => {
  try {
    await saveStore(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(err.message.includes("Invalid") ? 400 : 500).json({ error: err.message });
  }
});

module.exports = router;
