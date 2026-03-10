import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.use(isAuthenticated);

router.get("/", reportController.getAllReports);
router.post("/", reportController.createReports);
router.get("/:id", reportController.getReportById);
router.put("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

export default router;
