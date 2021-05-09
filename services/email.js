import nodemailer from "nodemailer";
import * as env from "dotenv";
env.config();
const { EMAIL, PASS, SUBJECT } = process.env;

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

export function sendMail(message, email) {
  console.log(EMAIL, PASS);
  let mailOptions = {
    from: EMAIL,
    to: email,
    subject: SUBJECT,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error.message);
    }
    console.log("success");
  });
}
