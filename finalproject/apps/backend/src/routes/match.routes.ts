import { Router } from "express";
import * as matchController from "../controllers/match.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

// User-facing match feed
router.get("/", isAuthenticated, matchController.getMatches);
router.post("/", isAuthenticated, matchController.applyMatch);

// User interaction with a recommendation
router.patch(
  "/:matchId/interact",
  isAuthenticated,
  matchController.handleMatchInteraction,
);

export default router;