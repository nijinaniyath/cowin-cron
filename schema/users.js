import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  hospitals: [Number],
  districts: { type: [Number], required: true },
  email: {
    type: String,
    required: true,
  },
  phone: Number,
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
  updated: { type: Date, default: Date.now() },
});

export default mongoose.model("users", UserSchema);
