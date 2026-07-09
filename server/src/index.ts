import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

try {
  const dbPath = path.join(__dirname, "..", "prisma", "dev.db");
  const tmpPath = "/tmp/dev.db";
  if (!fs.existsSync(tmpPath)) {
    console.log("Copying dev.db to /tmp/dev.db");
    fs.copyFileSync(dbPath, tmpPath);
  }
} catch (e) {
  console.error("Failed to copy dev.db", e);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Socket.io integration
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room.`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// For Vercel Serverless Functions
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the express app for Vercel
export default app;
