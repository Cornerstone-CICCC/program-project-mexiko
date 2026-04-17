import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoter from "./routes/user.routes";
import reportRouter from "./routes/report.routes";
import matchRouter from "./routes/match.routes";
import chatroomRouter from "./routes/chatroom.routes";
import { connectDB } from "./config/mongodb";
import dbTestRouter from "./routes/db-test.routes";

import cron from "node-cron";
import { generateDailyMatches } from "./services/match.service";

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("🔍 Verificando variables de entorno...");
if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("❌ FIREBASE_PROJECT_ID no está definido");
  process.exit(1);
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  console.error("❌ FIREBASE_CLIENT_EMAIL no está definido");
  process.exit(1);
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error("❌ FIREBASE_PRIVATE_KEY no está definido");
  process.exit(1);
}
console.log("✅ Variables de entorno verificadas");

import "./config/firebase-admin";

// ===== CRON =====
cron.schedule("0 8 * * *", async () => {
  console.log("Batch process started: Generating daily matches.");
  try {
    await generateDailyMatches();
  } catch (error) {
    console.error("Failed to generate daily matches:", error);
  }
});

// ===== APP =====
const app = express();
const httpServer = createServer(app);

// ===== SHARED ORIGINS =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
  "http://localhost:19006",
  "http://localhost:8082",
];

// ===== SOCKET.IO =====
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
  }),
);

// ===== SESSION =====
if (!process.env.COOKIE_PRIMARY_KEY) {
  throw new Error("Missing COOKIE_PRIMARY_KEY!");
}

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.COOKIE_PRIMARY_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);

app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".m4a")) {
        res.setHeader("Content-Type", "audio/m4a");
      }
    },
  }),
);

app.use("/users", userRoter);
app.use("/reports", reportRouter);
app.use("/match", matchRouter);
app.use("/chatroom", chatroomRouter);
app.use("/db-tsst", dbTestRouter);

// ===== FALLBACK =====
app.use((_req: Request, res: Response) => {
  res.status(400).json({ message: "Invalid route!" });
});

// ===== START SERVER =====
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    const PORT = process.env.PORT || 3500;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();