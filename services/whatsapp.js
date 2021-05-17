import { Client } from "whatsapp-web.js";
import session from "../session/session.js";
const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--unhandled-rejections=strict",
    ],
  },
  session: session,
});

client.on("authenticated", (session) => {
  console.log("AUTH!");
});
client.on("auth_failure", () => {
  console.log("AUTH Failed !");
  process.exit();
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

export default client;