require("dotenv").config();
const connectDB = require("./config/db");
const createApp = require("./createApp");

const PORT = process.env.PORT || 8080;
const app = createApp({ serveSpa: true });

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
