import { HTTP_STATUS_CODE } from "../constants/constants.js";
import {
  findUserByEmail,
  createUser,
  addDistrictsIfNotExists,
} from "../services/model.service.js";

export async function save(req, res) {
  const isUserExist = await findUserByEmail({ email: req.body.email });
  if (isUserExist) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: "Email has been registered already" });
  }

  const user = await createUser(req.body);
  addDistrictsIfNotExists({ districts: user.districts });
  res.json(user);
}
