import mongoose from "mongoose";
import * as env from "dotenv";
import { CronJob } from "cron";

import logger from "../services/logger.js";
import { updateUserNotifiedCenters } from "../services/model.service.js";
env.config();

const { DB_CON, DB_JOB_INTERVAL } = process.env;
mongoose.connect(DB_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  logger.info("db connection has succeeded");
});

const job = new CronJob(DB_JOB_INTERVAL, function () {
  logger.log({
    level: "info",
    message: `DB JOB STARTED.. ${Date.now()}`,
  });
  updateUserNotifiedCenters();
});

job.start();
