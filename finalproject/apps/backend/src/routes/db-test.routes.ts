import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;

  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

  res.status(200).json({
    status: states[dbState] || "Unknown",
    dbStateCode: dbState,
  });
});

export default router;
