import { Router } from "express";
import authRoutes from "./auth";
import entrepreneurRoutes from "./entrepreneur";
import investorRoutes from "./investor";
import commonRoutes from "./common";
import categoryRoutes from "./category";

const router = Router();

router.use("/auth", authRoutes);
router.use("/entrepreneur", entrepreneurRoutes);
router.use("/investor", investorRoutes);
router.use("/category", categoryRoutes);
router.use("/", commonRoutes);

export { router as routes };
