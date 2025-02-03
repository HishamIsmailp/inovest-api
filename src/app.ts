import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { appConfig } from "./config/app.config";
import { initializeSocket } from "./config/socket";
import { errorHandler } from "./middlewares";
import { routes } from "./routes";

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

app.use(cors(appConfig.corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorHandler);

httpServer.listen(appConfig.port, () => {
  console.log(`Server running on port ${appConfig.port}`);
});

export default app;
