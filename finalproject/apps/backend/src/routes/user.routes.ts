import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);

router.get("/", isAdmin, userController.getUsers);

router.get("/:id", userController.getUser);

router.put("/:id", userController.updateUser);

router.patch("/:id/admin", isAdmin, userController.toggleAdmin);

router.delete("/:id", isAdmin, userController.deleteUser);

export default router;
