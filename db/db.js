import mongoose from "mongoose";
import * as env from "dotenv";
env.config();
const { DB_CON } = process.env;
mongoose.connect(DB_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected");
});
