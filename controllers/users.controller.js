import { HTTP_STATUS_CODE, MAIL_CONSTANTS } from "../constants/constants.js";
import {
  findUserByEmailOrPhone,
  createUser,
  addDistrictsIfNotExists,
  unsubscribeUser,
} from "../services/model.service.js";
import { sendMail } from "../services/email.js";
import { sendMessage } from "../services/whatsapp.js";
import { welcomeMessage } from "../services/notifier.js";
import logger from "../services/logger.js";
export async function save(req, res) {
  const { email, phone } = req.body;
  const isUserExist = await findUserByEmailOrPhone({ email, phone });
  if (isUserExist) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: "Email or mobile has been registered already" });
  }

  const user = await createUser(req.body);
  logger.info("new user registration success");
  addDistrictsIfNotExists({ districts: user.districts });
  if (user.email) {
    logger.info("Welcome mail sent");
    sendMail({
      email: user.email,
      subject: MAIL_CONSTANTS.WELCOME_SUBJECT,
      template: MAIL_CONSTANTS.WELCOME_TEMPLATE,
      unsubLink: `${MAIL_CONSTANTS.UNSUBLINK}/${user.token}`,
    });
  }
  if (phone) {
    logger.info("Welcome whatsapp message sent");
    sendMessage(
      phone,
      welcomeMessage(`${MAIL_CONSTANTS.UNSUBLINK}/${user.token}`)
    );
  }
  const {
    email: mail,
    hospitals,
    districts,
    phone: phoneNumber,
    notificationChannels,
  } = user;
  res.json({ mail, hospitals, districts, phoneNumber, notificationChannels });
}

export async function confirmUnsubscribe(req, res) {
  res.redirect(`/unsubscribe.html?token=${req.params.id}`);
}

export async function unsubscribe(req, res) {
  await unsubscribeUser(req.params.id);
  res.json({ message: "Unsubscribed successfully" });
}
