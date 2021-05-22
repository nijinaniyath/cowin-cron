import { sendMail } from "./email.js";
import whatsapp from "./whatsapp.js";
import { MAIL_CONSTANTS } from "../constants/constants.js";
export const NOTIFIERS = {
  MAIL: "mail",
  WHATSAPP: "whatsapp",
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

  [NOTIFIERS.WHATSAPP]: {
    sendMessage({ centers, user }) {
      const message = buildWmessage({ centers });
      whatsapp.sendMessage(`91${user.phone}@c.us`, message).then((response) => {
        if (response.id.fromMe) {
        }
      });
    },
  },
};

function buildWmessage({ centers }) {
  let message = `*🔔 Vaccine Available at ${centers[0].district_name}* 
  `;
  const maxLmt = 2048;
  for (let i = 0; i < centers.length; i++) {
    const center = `
    🏥 ${centers[i].name}`;
    if (maxLmt - 140 <= message.length) {
      break;
    }
    message = `${message}${center}`;
  }
  return message;
}
