import express from "express";
import scheduler from "node-schedule";
import { procesSessionData } from "./service.js";
import * as env from "dotenv";
env.config();

const port = process.env.PORT || 3000;

const app = express();
const job = scheduler.scheduleJob({ minute: 5 }, function () {
  console.log("STARTED...");
});
procesSessionData();
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
