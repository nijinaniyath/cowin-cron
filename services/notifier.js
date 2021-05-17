import { sendMail } from "./email.js";
import { MAIL_CONSTANTS } from "../constants/constants.js";
export const NOTIFIERS = {
  MAIL: "mail",
};

export const notifications = {
  [NOTIFIERS.MAIL]: {
    sendMessage: ({ user, ...rest }) => {
      const context = {
        ...rest,
        subject: MAIL_CONSTANTS.WELCOME_SUBJECT,
        template: MAIL_CONSTANTS.NOTIFICATION_TEMPLATE,
        unsubUrl: `${MAIL_CONSTANTS.UNSUBLINK}/${user.token}`,
      };
      sendMail({
        ...context,
        email: user.email,
      });
    },
  },
};
