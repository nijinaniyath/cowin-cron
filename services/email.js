import nodemailer from "nodemailer";
import { pugEngine } from "nodemailer-pug-engine";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as env from "dotenv";
env.config();
const { EMAIL, PASS, SUBJECT } = process.env;
const __dirname = dirname(fileURLToPath(import.meta.url));
//TODO: change authentication to app password
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

export function sendMail({ dates, centers, email, getSessionByDate }) {
  let mailOptions = {
    from: EMAIL,
    to: email,
    subject: SUBJECT,
    template: "mail",
    ctx: {
      dates,
      centers,
      getSessionByDate,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error.message);
    }
    console.log("success");
  });
}
