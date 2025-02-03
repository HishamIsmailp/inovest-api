import express from "express";
import { commonController } from "../controllers/commonController";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validate";
import {
  chatValidation,
  paymentValidation,
  userValidation,
} from "../validations";

const router = express.Router();

router.use(auth);

router.put(
  "/profile",
  validateRequest(userValidation.updateProfile),
  commonController.updateProfile
);
router.get("/profile", commonController.getProfile);
router.put(
  "/profile/role",
  validateRequest(userValidation.updateRole),
  commonController.updateRole
);
router.get("/chats/:id/messages", commonController.getChatMessages);
router.post(
  "/chats/:id/messages",
  validateRequest(chatValidation.sendMessage),
  commonController.sendMessage
);
router.get("/notifications", commonController.getNotifications);
router.put("/notifications/:id/read", commonController.markNotificationRead);
router.post(
  "/payments/create",
  validateRequest(paymentValidation.create),
  commonController.createPayment
);
router.post(
  "/payments/verify",
  validateRequest(paymentValidation.verify),
  commonController.verifyPayment
);
router.post(
  "/fcm-token",
  validateRequest(userValidation.updateFcmToken),
  commonController.updateFcmToken
);

export default router;
