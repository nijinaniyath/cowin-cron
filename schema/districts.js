import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema({
  districtId: { type: Number, required: true },
});

export default mongoose.model("DistrictModel", DistrictSchema);
