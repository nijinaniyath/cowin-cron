import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import { ValidationError } from "express-validation";
import { CronJob } from "cron";
import * as env from "dotenv";
env.config();

import "./db/db.js";
import "./services/whatsapp.js";
import router from "./routes/index.js";
import { procesSessionData } from "./services/service.js";
import { HTTP_STATUS_CODE } from "./constants/constants.js";

const { PORT, SCHEDULER_INTERVAL } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(bodyParser.json());
app.use(limiter);
const job = new CronJob(SCHEDULER_INTERVAL, function () {
  console.log("STARTED...");
  procesSessionData();
});

job.start();

app.use(express.static("public"));
app.use("/api", router);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json(err);
});

app.listen(PORT || 3000, () => {
  console.log(`server running on port ${PORT || 3000}`);
});
