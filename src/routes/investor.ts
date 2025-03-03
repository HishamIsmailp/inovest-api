import express from "express";
import { investorController } from "../controllers/investorController";
import { auth } from "../middlewares/auth";
import { checkRole } from "../middlewares/checkRole";
import { validateRequest } from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router.use(auth);
router.use(checkRole("INVESTOR"));

router.get("/categories", investorController.getCategories);
router.get("/ideas/top", investorController.getTopIdeas);
router.get("/categories/:id/ideas", investorController.getCategoryIdeas);
router.get("/ideas", investorController.getIdeas);
router.get("/ideas/:id", investorController.getIdeaDetail);
router.post(
  "/ideas/:id/rate",
  validateRequest(projectValidation.rate),
  investorController.rateIdea
);
router.post("/ideas/:id/interest", investorController.showInterest);
router.get("/interests", investorController.getInterests);

export default router;
