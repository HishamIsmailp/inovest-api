import { config } from "dotenv";

config();

export const appConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  clientAppUrl: process.env.CLIENT_APP_URL || "https://inovest-api-ezgy.vercel.app",
  corsOptions: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};
