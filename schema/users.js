import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  hospitals: [Number],
  districts: { type: [Number], required: true },
  email: {
    type: String,
  },
  phone: String,
  notificationChannels: {
    type: [String],
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  notifiedOn: {
    type: Date,
    default: () => new Date("2020-05-22T16:57:29.142Z"),
  },
  notifiedCenters: {
    type: [Number],
  },
  updated: { type: Date, default: Date.now },
});

export default mongoose.model("users", UserSchema);
