import { Router } from "express";
import * as reportController from "../controllers/report.controller";

const router = Router();

router.get("/", reportController.getAllReports);
router.post("/", reportController.createReports);
router.get("/:id", reportController.getReportById);
router.put("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

export default router;
