export const HTTP_STATUS_CODE = {
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
};

export const MAIL_CONSTANTS = {
  WELCOME_SUBJECT: "Vaccine bell welcomes you",
  AVAILABILITY_SUBJECT: "Vaccine available",
  WELCOME_TEMPLATE: "welcome",
  NOTIFICATION_TEMPLATE: "mail",
  UNSUBLINK: `${process.env.APP_URL}/api/unsubscribe`,
};

export const STOP_TEXT = "stop";

export const UNSUBSCRIBE_FEEDBACK = `*Unsubscribed successfully*
Thank you for using Vaccine Bell

You have been successfully removed from this subscriber list and won't receive any further notification from us. 

Did you unsubscribe by accident?
Re-subcribe: https://vaccinebell.in/
`;
