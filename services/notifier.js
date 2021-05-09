import { sendMail } from "./email.js";
export const NOTIFIERS = {
  MAIL: "mail",
};

export const notifications = {
  [NOTIFIERS.MAIL]: {
    createMessage: (user, avalibilityData) => {
      return "hello world";
    },
    sendMessage: ({ message, user }) => {
      sendMail(message, user.email);
    },
  },
};
