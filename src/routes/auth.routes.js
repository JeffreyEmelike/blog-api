import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema } from "../validation/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);

export default router;
