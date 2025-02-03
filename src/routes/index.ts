import { Router } from "express";
import authRoutes from "./auth";
import entrepreneurRoutes from "./entrepreneur";
import investorRoutes from "./investor";
import commonRoutes from "./common";
import categoryRoutes from "./category";
import { welcomePage } from "../constants";

const router = Router();

router.get("/", (_, res) => {
  res.send(welcomePage);
});

router.use("/auth", authRoutes);
router.use("/entrepreneur", entrepreneurRoutes);
router.use("/investor", investorRoutes);
router.use("/category", categoryRoutes);
router.use("/", commonRoutes);

export { router as routes };
