import { Router } from "express";
import * as chatController from "../controllers/chatroom.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, chatController.listRooms);

router.get("/:roomId", isAuthenticated, chatController.getRoom);

router.post("/:roomId/messages", isAuthenticated, chatController.postMessage);

router.delete("/:roomId", isAuthenticated, chatController.removeRoom);

router.post("/", isAuthenticated, chatController.createRoom);

export default router;
