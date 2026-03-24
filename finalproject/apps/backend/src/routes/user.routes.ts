import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", userController.logout);

//router.get("/", isAdmin, userController.getUsers);
router.get("/", userController.getUsers);


router.get("/:id", userController.getUser);

router.put("/:id", userController.updateUser);

router.patch("/:id/admin", isAdmin, userController.toggleAdmin);

router.delete("/:id", isAdmin, userController.deleteUser);

router.delete("/me/delete", isAuthenticated, userController.deleteOwnAccountBySession);

router.post("/dev", userController.createUserDev);

export default router;
