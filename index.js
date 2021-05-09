import express from "express";
import scheduler from "node-schedule";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import { ValidationError } from "express-validation";

import * as env from "dotenv";
env.config();

import "./db/db.js";
import router from "./routes/index.js";
import { procesSessionData } from "./services/service.js";
import { HTTP_STATUS_CODE } from "./constants/constants.js";

const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(limiter);

const job = scheduler.scheduleJob({ second: 10 }, function () {
  console.log("STARTED...");
  procesSessionData();
});

app.use("/", router);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json(err);
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
