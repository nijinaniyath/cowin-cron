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
        subject: MAIL_CONSTANTS.AVAILABILITY_SUBJECT,
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
          logger.log({
            level: "info",
            message: `Whatsapp message sent to ${user.phone} at ${Date.now()}`,
          });
        }
      });
    },
  },
};

export function welcomeMessage(unsubcribeShorUrl) {
  let welcome = `*Thank you for subcribing Vaccine Bell 🔔*`;
  let info = `You will be notified of the latest updates on the availability of vaccine in your nearest locality based on your registration.`;
  let legal = `This is just a notification system only. Please don't misunderstand that vaccine is provided via this app. Also you can't book vaccine via Vaccine Bell. The sole purpose of this app is to notify users when vaccine is available at the centers you choose. Vaccine bell is not officially associated with Co-Win. For booking vaccine and other services, kindly visit Co-Win official website`;
  let disclaimer = `_Vaccine Bell using the Public API service provided by cowin.gov.in, the vaccine portal of the Union Ministry of Health. If the API is down, there will slowness in updating data accordingly._`;
  let unsubcribe = `You can stop notification any time by sending 'stop' or clicking on ${unsubcribeShorUrl}`;
  let msg = `${welcome}
${info}
  
${legal}

${disclaimer}
  
${unsubcribe}`;

  return msg;
}

export function buildWmessage({ centers }) {
  let message = `*🔔 Vaccine Available at ${centers[0].district_name}*`;
  const maxLmt = 2048;
  for (let i = 0; i < centers.length; i++) {
    let sessions = "";
    centers[i].sessions.forEach((s) => {
      if(s.available_capacity){
        sessions += `
${s.date} - ${s.available_capacity} Dose`
      }
});

    const center = `
${centers[i].name}, ${centers[i].address}
*Fee:* ${centers[i].fee_type}
*Vaccine:* ${centers[i].sessions[0].vaccine}
*Age:* ${centers[i].sessions[0].min_age_limit}+
*Availability:* ${sessions}
`;

    if (maxLmt - 140 <= message.length) {
      break;
    }
    message = `${message}${center}`;
  }
  return message;
}
