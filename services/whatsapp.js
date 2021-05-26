import { Client } from "whatsapp-web.js";
import session from "../session/session.js";
import { unsubscribeUserByWhatsapp } from "./model.service.js";
import { STOP_TEXT } from "../constants/constants.js";
import logger from "./logger.js";
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

client.on("authenticated", () => {
  logger.info("Whatsapp authentication success");
});
client.on("auth_failure", () => {
  console.warn("Whatsapp authentiation failed");
});

client.on("message", (msg) => {
  if (msg.body.toLocaleLowerCase() == STOP_TEXT) {
    const phone = msg.from.slice(2, 12);
    unsubscribeUserByWhatsapp(phone);
    sendMessage(phone, `*Unsubscribed successfully*
Thank you for using Vaccine Bell

You have been successfully removed from this subscriber list and won't receive any further notification from us. 

Did you unsubscribe by accident?
Re-subcribe: https://vaccinebell.in/
`)
    logger.log({
      level: "info",
      message: `unsubscribed through whatsapp ${phone}`,
    });
  }
});

client.on("ready", () => {
  console.log("Client is ready!");
  logger.log({
    level: "info",
    message: `Client is ready!`,
  });
});

client.initialize();

export function sendMessage(phone, message) {
  client.sendMessage(`91${phone}@c.us`, message);
}

export default client;
