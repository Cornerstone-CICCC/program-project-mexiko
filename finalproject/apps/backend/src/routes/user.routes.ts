import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

// Auth
router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);

// Session
router.get("/session/me", userController.getSessionMe);

// Users
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);

// Admin
router.patch("/:id/admin", isAdmin, userController.toggleAdmin);
router.delete("/:id", isAdmin, userController.deleteUser);

// Self account
router.delete(
  "/me/delete",
  isAuthenticated,
  userController.deleteOwnAccountBySession
);

// Dev
router.post("/dev", userController.createUserDev);

export default router;