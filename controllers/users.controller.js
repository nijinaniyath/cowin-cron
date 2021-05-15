import { HTTP_STATUS_CODE } from "../constants/constants.js";
import {
  findUserByEmail,
  createUser,
  addDistrictsIfNotExists,
  unsubscribeUser,
} from "../services/model.service.js";

import { sendMail } from "../services/email.js";
export async function save(req, res) {
  const isUserExist = await findUserByEmail({ email: req.body.email });
  if (isUserExist) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: "Email has been registered already" });
  }

  const user = await createUser(req.body);
  addDistrictsIfNotExists({ districts: user.districts });
  sendMail({
    email: user.email,
    subject: "Vaccine bell Welcome Aboard",
    template: "welcome",
    unsubLink: `${process.env.APP_URL}/api/unsubscribe/${user.token}`,
  });
  const { email, hospitals, districts, phone, notificationChannels } = user;
  res.json({ email, hospitals, districts, phone, notificationChannels });
}

export async function unsubscribe(req, res) {
  await unsubscribeUser(req.params.id);
  res.json({ message: "Unsubscribed successfully" });
}
