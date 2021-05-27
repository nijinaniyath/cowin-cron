import nodemailer from "nodemailer";
import { pugEngine } from "nodemailer-pug-engine";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as env from "dotenv";

env.config();
const { EMAIL, PASS } = process.env;
const __dirname = dirname(fileURLToPath(import.meta.url));
import logger from "./logger.js";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: EMAIL,
    pass: PASS,
  },
});

transporter.use(
  "compile",
  pugEngine({
    templateDir: path.join(__dirname, "template"),
    pretty: true,
  })
);

export function sendMail({ email, template, subject, ...context }) {
  let mailOptions = {
    from: EMAIL,
    to: email,
    subject: subject,
    template: template,
    ctx: {
      ...context,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.log({
        level: "error",
        message: `Sent mail failed for ${mailOptions.to} at ${Date.now()}`,
        error,
      });
    }
    logger.log({
      level: "info",
      message: `Mail sent to ${mailOptions.to} at ${Date.now()}`,
      error,
    });
  });
}
