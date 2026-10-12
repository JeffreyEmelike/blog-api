import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validation/auth.schema.js";
import { requireAuth } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

router.post("/register", validate(registerSchema), AuthController.register);
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  AuthController.login,
);
router.get("/me", requireAuth, AuthController.me);
export default router;
