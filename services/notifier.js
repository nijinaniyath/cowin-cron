import { sendMail } from "./email.js";
export const NOTIFIERS = {
  MAIL: "mail",
};

export const notifications = {
  [NOTIFIERS.MAIL]: {
    sendMessage: ({ centers, dates, user, getSessionByDate }) => {
      sendMail({ centers, dates, email: user.email, getSessionByDate });
    },
  },
};
