// server.ts
interface RoomState {
  participants: Map<
    string,
    {
      socketId: string;
      displayName: string;
      hasVideo: boolean;
      hasAudio: boolean;
      isScreenSharing: boolean;
    }
  >;
  created: Date;
}

interface SignalingData {
  to: string;
  from?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate;
  streamId?: string;
  type?: string;
}

import express from "express";
import { createServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import cors from "cors";
import { UserManager } from "./src/managers /UserManger";
import { getUser, loginUser, signupUser } from "./src/controllers/user";
import { startMeeting } from "./src/controllers/meeting";
import { authMiddleware } from "./src/middlewares/authMiddleware";

const app = express();
const server = createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: ["https://quick-meet-two.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  userManager.addUser("randomName", socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  });
});

const rooms = new Map<string, RoomState>();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// @ts-ignore
app.get("/room/:roomId/info", async (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const participantsCount = room.participants.size;
  res.json({
    participantsCount,
    created: room.created,
  });
});

app.post("/login", loginUser);
app.get("/user", authMiddleware, getUser);
app.post("/register", signupUser);
app.post("/start-meeting", authMiddleware, startMeeting);

// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

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
