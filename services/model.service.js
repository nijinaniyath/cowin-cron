import crypto from "crypto";

import UserModel from "../schema/users.js";
import DistrictModel from "../schema/districts.js";

export async function createUser(user) {
  const tokenBuffer = await crypto.randomBytes(10);
  user.token = tokenBuffer.toString("hex");
  return UserModel.create(user);
}

export async function findUserByEmailOrPhone({ email, phone }) {
  let query = [];

  if (email) {
    query = [...query, { email }];
  }
  if (phone) {
    query = [...query, { phone }];
  }
  return UserModel.findOne({ $or: query });
}

export async function findUsersByDistrict(dtId) {
  return UserModel.find({ districts: dtId, active: true });
}

export async function getAllDistricts() {
  return DistrictModel.find();
}

export function addDistrictsIfNotExists({ districts }) {
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

export async function unsubscribeUser(token) {
  return UserModel.findOneAndUpdate({ token: token }, { active: false });
}
