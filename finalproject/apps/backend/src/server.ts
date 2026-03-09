import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import session from "express-session";

import userRoter from "./routes/user.routes";
import reportRouter from "./routes/report.routes";
import matchRouter from "./routes/match.routes";
import chatroomRouter from "./routes/chatroom.routes";
import { connectDB } from "./config/mongodb";
import dbTestRouter from "./routes/db-test.routes";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  }),
);

if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
  throw new Error("Missing cookie keys!");
}

app.use(
  session({
    secret: process.env.COOKIE_PRIMARY_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  }),
);

app.use("/users", userRoter);
app.use("/reports", reportRouter);
app.use("/match", matchRouter);
app.use("/chatroom", chatroomRouter);
app.use("/db-tsst", dbTestRouter);

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(400).json({ message: "Invalid route!" });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
