import express from "express";
import { validate } from "express-validation";

import { userValidation } from "../validators/user.schema.validator.js";

const router = express.Router();

import * as userController from "../controllers/users.controller.js";

router.post("/users", validate(userValidation, {}, {}), userController.save);
router.get("/unsubscribe/:id", userController.unsubscribe);

export default router;
