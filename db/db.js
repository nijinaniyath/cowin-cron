import mongoose from "mongoose";
import * as env from "dotenv";
import logger from "../services/logger.js";

env.config();

const { DB_CON } = process.env;
mongoose.connect(DB_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  logger.info("db connection has succeeded");
});
