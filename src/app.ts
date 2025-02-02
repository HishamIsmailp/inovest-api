import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { config } from "dotenv";
import { initializeSocket } from "./config";
import { errorHandler } from "./middlewares";
import {
  authRoutes,
  entrepreneurRoutes,
  investorRoutes,
  categoryRoutes,
  commonRoutes,
} from "./routes";

config();

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/entrepreneur", entrepreneurRoutes);
app.use("/api/investor", investorRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api", commonRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
