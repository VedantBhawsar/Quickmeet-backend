"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const user_1 = require("./src/controllers/user");
const authMiddleware_1 = require("./src/middlewares/authMiddleware");
const meeting_1 = require("./src/controllers/meeting");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = process.env.PORT || 8000;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
};
app.use((0, cors_1.default)(corsOptions));
const io = new socket_io_1.Server(server, { cors: corsOptions });
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join-room", (room) => {
        socket.join(room);
        const roomClients = io.sockets.adapter.rooms.get(room);
        const clientsCount = roomClients ? roomClients.size : 0;
        if (clientsCount === 1) {
            socket.emit("created", room, socket.id);
        }
        else if (clientsCount === 2) {
            socket.emit("joined", room, socket.id);
            socket.to(room).emit("peer-connected", socket.id);
        }
        else {
            socket.emit("full", room);
        }
    });
    socket.on("offer", (data) => {
        socket.to(data.to).emit("offer", { offer: data.offer, from: socket.id });
    });
    socket.on("answer", (data) => {
        socket.to(data.to).emit("answer", { answer: data.answer, from: socket.id });
    });
    socket.on("ice-candidate", (data) => {
        socket
            .to(data.to)
            .emit("ice-candidate", { candidate: data.candidate, from: socket.id });
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        socket.broadcast.emit("peer-disconnected", socket.id);
    });
});
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Welcome to Express & TypeScript Server");
});
app.post("/signup", user_1.signupUser);
app.post("/login", user_1.loginUser);
app.get("/user", authMiddleware_1.authMiddleware, user_1.getUser);
app.post("/start-meeting", authMiddleware_1.authMiddleware, meeting_1.startMeeting);
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
