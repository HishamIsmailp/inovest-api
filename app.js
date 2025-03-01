"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const app_config_1 = require("./dist/src/config/app.config");
const socket_1 = require("./dist/src/config/socket");
const middlewares_1 = require("./dist/src/middlewares");
const routes_1 = require("./dist/src/routes");
const constants_1 = require("./dist/src/constants");
const socketService_1 = require("./dist/src/services/socketService");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = (0, socket_1.initializeSocket)(httpServer);
socketService_1.SocketService.initialize(io);
app.use((0, cors_1.default)(app_config_1.appConfig.corsOptions));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_, res) => {
    res.send(constants_1.welcomePage);
});
app.use("/api", routes_1.routes);
app.use(middlewares_1.errorHandler);
httpServer.listen(app_config_1.appConfig.port, () => {
    console.log(`Server running on port ${app_config_1.appConfig.port}`);
});
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    httpServer.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});
exports.default = app;
