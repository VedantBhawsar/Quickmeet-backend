"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const UserManger_1 = require("./src/managers /UserManger");
const user_1 = require("./src/controllers/user");
const meeting_1 = require("./src/controllers/meeting");
const authMiddleware_1 = require("./src/middlewares/authMiddleware");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://quick-meet-two.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const userManager = new UserManger_1.UserManager();
io.on("connection", (socket) => {
    console.log("a user connected");
    userManager.addUser("randomName", socket);
    socket.on("disconnect", () => {
        console.log("user disconnected");
        userManager.removeUser(socket.id);
    });
});
const rooms = new Map();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});
// @ts-ignore
app.get("/room/:roomId/info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }
    const participantsCount = room.participants.size;
    res.json({
        participantsCount,
        created: room.created,
    });
}));
app.post("/login", user_1.loginUser);
app.get("/user", authMiddleware_1.authMiddleware, user_1.getUser);
app.post("/register", user_1.signupUser);
app.post("/start-meeting", authMiddleware_1.authMiddleware, meeting_1.startMeeting);
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
// Start server
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to quickmeet backend",
    });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down...");
    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
});
