import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.cookies["user-login"];

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No session found." });
  }

  req.userId = userId;
  next();
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.cookies["user-login"];
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No session found." });
    }

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Forbidden: Admins only." });
    }

    req.userId = userId;
    next();
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "Internal server error during authorization.";
    res.status(500).json({ error: message });
  }
};
