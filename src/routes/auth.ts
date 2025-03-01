import express from "express";
import { authController } from "../controllers/authController";
import { validateRequest } from "../middlewares";
import { authValidation } from "../validations";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(authValidation.signup),
  authController.signup
);
router.post(
  "/login",
  validateRequest(authValidation.login),
  authController.login
);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/forgot-password",
  validateRequest(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(authValidation.resetPassword),
  authController.resetPassword
);

export default router;
