import fs from "fs";
import path from "path";
import { Client } from "whatsapp-web.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SESSION_FILE_PATH = "../session/session.json";

let sessionCfg;
const client = new Client({
  puppeteer: {
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--unhandled-rejections=strict",
    ],
  },
  session: sessionCfg,
});

client.on("authenticated", (session) => {
  console.log("AUTH!");
  sessionCfg = session;

  fs.writeFile(
    path.join(__dirname, SESSION_FILE_PATH),
    JSON.stringify(session),
    { flag: "wx" },
    function (err) {
      if (err) {
        console.error(err);
      }
    }
  );
});

client.on("auth_failure", () => {
  console.log("AUTH Failed !");
  sessionCfg = "";
  process.exit();
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();
