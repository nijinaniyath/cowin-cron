import { Joi } from "express-validation";
import phoneNumber from "joi-phone-number";
import { NOTIFIERS } from "../services/notifier.js";
const covinJoi = Joi.extend(phoneNumber);
export const userValidation = {
  body: covinJoi
    .object({
      email: covinJoi
        .string()
        .email()
        .when("notificationChannels", {
          is: covinJoi
            .array()
            .items(
              covinJoi.string().valid(NOTIFIERS.MAIL).required(),
              covinJoi.any()
            ),
          then: covinJoi.required(),
        })
        .allow(null, "")
        .messages({
          "any.required":
            "Email is required is when you select email as your notification channel",
        }),
      phone: covinJoi
        .string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .phoneNumber({ defaultCountry: "IN", format: "international" })
        .allow(null, "")
        .when("notificationChannels", {
          is: covinJoi
            .array()
            .items(
              covinJoi.string().valid(NOTIFIERS.WHATSAPP).required(),
              covinJoi.any()
            ),
          then: covinJoi.required(),
        })
        .messages({
          "any.required":
            "Phone number is required is when you select whatsapp as your notification channel",
        }),
      districts: covinJoi
        .array()
        .items(covinJoi.number().integer().min(1).max(1000))
        .required()
        .messages({
          "any.required": "Please select atlest one district",
        }),
      hospitals: covinJoi.array().items(covinJoi.number().integer()),
      notificationChannels: covinJoi
        .array()
        .items(covinJoi.string().valid(NOTIFIERS.MAIL, NOTIFIERS.WHATSAPP))
        .required()
        .messages({
          "any.required": "Please select atlest one notification channel",
        }),
    })
    .or("email", "phone"),
};
