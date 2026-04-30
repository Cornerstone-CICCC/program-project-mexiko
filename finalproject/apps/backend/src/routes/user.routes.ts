import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, "profile-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const router = Router();

// Auth
router.post("/login", userController.login);
router.post("/signup", upload.single("profileImage"), userController.signup);
router.post("/logout", userController.logout);

// Session
router.get("/session/me", userController.getSessionMe);

// Users
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
//router.patch("/:id", userController.updateUser);
router.patch("/:id", upload.single("profileImage"), userController.updateUser);

// Admin
router.patch("/:id/admin", isAdmin, userController.toggleAdmin);
router.delete("/:id", isAdmin, userController.deleteUser);

// Self account
router.delete(
  "/me/delete",
  isAuthenticated,
  userController.deleteOwnAccountBySession,
);

// Dev
router.post("/dev", userController.createUserDev);

export default router;
