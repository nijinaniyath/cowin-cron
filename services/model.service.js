import UserModel from "../schema/users.js";
import DistrictModel from "../schema/districts.js";

export async function createUser(user) {
  return UserModel.create(user);
}

export async function findUserByEmail({ email }) {
  return UserModel.findOne({ email });
}

export async function findUsersByDistrict(dtId) {
  return UserModel.find({ districts: [dtId] });
}

export async function getAllDistricts() {
  console.log("fetching from db");
  return DistrictModel.find();
}

export function addDistrictsIfNotExist({ districts }) {
  for (let district of districts) {
    addDistrictIfnotExist(district);
  }
}

export async function addDistrictIfnotExist(district) {
  const dt = await DistrictModel.findOne({ districtId: district });
  if (!dt) {
    const newDt = await DistrictModel.create({ districtId: district });
    return newDt;
  }
}
