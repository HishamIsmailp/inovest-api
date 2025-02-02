import express from "express";
import { categoryController } from "../controllers/categoryController";
import { validateRequest } from "../middlewares";
import { categoryValidation } from "../validations";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.use(auth);

router.post(
  "/",
  validateRequest(categoryValidation.create),
  categoryController.createCategory
);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put(
  "/:id",
  validateRequest(categoryValidation.update),
  categoryController.updateCategory
);
router.delete("/:id", categoryController.deleteCategory);

export default router;
