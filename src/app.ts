import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { appConfig } from "./config/app.config";
import { initializeSocket } from "./config/socket";
import { errorHandler } from "./middlewares";
import { routes } from "./routes";
import { welcomePage } from "./constants";
import { SocketService } from "./services/socketService";

const app = express();

const httpServer = createServer(app);

const io = initializeSocket(httpServer);
SocketService.initialize(io);

app.use(cors(appConfig.corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send(welcomePage);
});

app.use("/api", routes);

app.use(errorHandler);

httpServer.listen(appConfig.port, () => {
  console.log(`Server running on port ${appConfig.port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

export default app;
