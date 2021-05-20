import { Joi } from "express-validation";
import phoneNumber from "joi-phone-number";
import { NOTIFIERS } from "../services/notifier.js";
const covinJoi = Joi.extend(phoneNumber);
export const userValidation = {
  body: covinJoi
    .object({
      email: covinJoi.string().email(),
      phone: covinJoi
        .string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .phoneNumber({ defaultCountry: "IN", format: "international" }),
      districts: covinJoi
        .array()
        .items(covinJoi.number().integer().min(1).max(1000))
        .required(),
      hospitals: covinJoi.array().items(covinJoi.number().integer()),
      notificationChannels: covinJoi
        .array()
        .items(covinJoi.string().valid(NOTIFIERS.MAIL, NOTIFIERS.WHATSAPP))
        .required(),
    })
    .xor("email", "phone"),
};
