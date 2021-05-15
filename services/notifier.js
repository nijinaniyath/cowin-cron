import { sendMail } from "./email.js";
export const NOTIFIERS = {
  MAIL: "mail",
};

export const notifications = {
  [NOTIFIERS.MAIL]: {
    sendMessage: ({ user, ...rest }) => {
      const context = {
        ...rest,
        subject: "Vaccine Available",
        template: "mail",
        unsubUrl: `${process.env.APP_URL}/api/unsubscribe/${user.token}`,
      };
      sendMail({
        ...context,
        email: user.email,
      });
    },
  },
};
