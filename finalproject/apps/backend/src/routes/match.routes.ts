import { Router } from "express";
import * as matchController from "../controllers/match.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, matchController.getMatches);
router.post("/", isAuthenticated, matchController.applyMatch);
router.patch(
  "/:matchId",
  isAuthenticated,
  matchController.handleMatchInteraction,
);

export default router;
