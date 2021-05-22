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

function welcomeMessage(unsubcribeShorUrl) {
  let br = '%0a';
  let welcome = `*Thank you for subcribing Vaccine Bell 🔔*`;
  let info = `You will be notified of the latest updates on the availability of vaccine in your nearest locality based on your registration.`
  let unsubcribe = `You can stop natification any time by sending 'stop' or clicking on ${unsubcribeShorUrl}`;
  let disclaimer = `_Vaccine Bell using the Public API service provided by cowin.gov.in, the vaccine portal of the Union Ministry of Health. If the API is down, there will slowness in updating data accordingly._`;
  return (welcome + br + info + br +  disclaimer + br + unsubcribe);
}

function buildWmessage({ centers }) {
  let br = '%0a';
  let message = `*🔔 Vaccine Available at ${centers[0].district_name}* 
  `;
  const maxLmt = 2048;
  for (let i = 0; i < centers.length; i++) {
    const center = `${br}${br}${centers[i].name},`;
    const address = `${centers[i].address}`;
    const fee_type = `${br}*Fee:* ${centers[i].fee_type}`;
    const vaccine = `${br}*Vaccine:* ${centers[i].sessions[0].vaccine}`;
    let sessions = '';
    centers[i].sessions.forEach(s=> sessions += s.date +', ');
    const dates = `${br}*Avilable on:* ${sessions.replace(/,(?=[^,]*$)/, '')}`;

    if (maxLmt - 140 <= message.length) {
      break;
    }
    message = `${message}${center + address + vaccine + fee_type + dates}`;
  }
  return message;
}
