import { Joi } from "express-validation";
import { NOTIFIERS } from "../services/notifier.js";

export const userValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.number().integer(),
    districts: Joi.array()
      .items(Joi.number().integer().min(1).max(1000))
      .required(),
    hospitals: Joi.array().items(Joi.number().integer()),
    notificationChannels: Joi.array()
      .items(Joi.string().valid(NOTIFIERS.MAIL))
      .required(),
  }),
};
