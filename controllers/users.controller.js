import { HTTP_STATUS_CODE } from "../constants/constants.js";
import {
  findUserByEmail,
  createUser,
  addDistrictsIfNotExist,
  getAllDistricts,
} from "../services/model.service.js";

export async function save(req, res) {
  const isUserExist = await findUserByEmail({ email: req.body.email });
  const dist = await getAllDistricts();
  if (isUserExist) {
    return res.json(dist);
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: "Email has been registered already" });
  }

  const user = await createUser(req.body);
  addDistrictsIfNotExist({ districts: user.districts });
  res.json(user);
}
