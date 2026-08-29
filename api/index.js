require("dotenv").config();
const connectDB = require("../server/config/db");
const createApp = require("../server/createApp");

let app;
let ready;

async function getApp() {
  if (!ready) {
    ready = connectDB().then(() => {
      app = createApp({ serveSpa: false });
      return app;
    });
  }
  await ready;
  return app;
}

module.exports = async (req, res) => {
  const expressApp = await getApp();
  return expressApp(req, res);
};
