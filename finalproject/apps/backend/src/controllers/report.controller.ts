import { Request, Response } from "express";
import * as reportService from "../services/report.service";

interface ReportQuery {
  category?: string;
  status?: string;
}

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const query: ReportQuery = {};

    if (req.query.category) query.category = req.query.category as string;
    if (req.query.status) query.status = req.query.status as string;

    const reports = await reportService.getReports(query, page, limit);
    res
      .status(200)
      .json(
        reports.length
          ? reports
          : { message: "Report list is empty.", reports: [] },
      );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch reports.";
    res.status(500).json({ error: message });
  }
};

export const createReports = async (req: Request, res: Response) => {
  try {
    const { reportItems } = req.body;
    if (!Array.isArray(reportItems)) {
      return res.status(400).json({ error: "Invalid input provided." });
    }
    const newReports = await reportService.createManyReports(reportItems);
    res
      .status(201)
      .json({ message: "Reports created successfully.", data: newReports });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to create reports.";
    res.status(500).json({ error: message });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const report = await reportService.findReportById(id);
    if (!report) return res.status(404).json({ error: "Report not found." });
    res.status(200).json(report);
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "An error occurred while fetching the report.";
    res.status(500).json({ error: message });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await reportService.updateReport(id, req.body.reportInfo);
    if (!updated) return res.status(404).json({ error: "Report not found." });
    res.status(200).json(updated);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to update the report.";
    res.status(500).json({ error: message });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await reportService.deleteReport(id);
    if (!deleted) return res.status(404).json({ error: "Report not found." });
    res.status(200).json({ message: "Report deleted successfully." });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to delete the report.";
    res.status(500).json({ error: message });
  }
};
