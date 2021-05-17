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
