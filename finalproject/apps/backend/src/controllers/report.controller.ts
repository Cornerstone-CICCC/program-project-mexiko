import { Request, Response } from "express";
import * as reportService from "../services/report.service";
import { User } from "../models/user.model";

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

    res.status(200).json({
      message: reports.length
        ? "Reports fetched successfully."
        : "Report list is empty.",
      reports,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch reports.";
    res.status(500).json({ error: message });
  }
};

export const getMyReports = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.userId;

    if (!firebaseUid) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No user session found." });
    }

    const reporterUser = await User.findOne({ firebaseUid });

    if (!reporterUser) {
      return res
        .status(404)
        .json({ error: "Authenticated user not found in database." });
    }

    const reports = await reportService.getReportsByReporter(
      reporterUser._id.toString()
    );

    res.status(200).json({
      message: reports.length
        ? "User reports fetched successfully."
        : "No reports found for this user.",
      reports,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to fetch user reports.";
    res.status(500).json({ error: message });
  }
};

export const createReports = async (req: Request, res: Response) => {
  try {
    const { reportItems } = req.body;
    const firebaseUid = req.userId;

    if (!firebaseUid) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No user session found." });
    }

    if (!Array.isArray(reportItems) || reportItems.length === 0) {
      return res.status(400).json({ error: "Invalid input provided." });
    }

    const reporterUser = await User.findOne({ firebaseUid });

    if (!reporterUser) {
      return res
        .status(404)
        .json({ error: "Authenticated user not found in database." });
    }

    const newReports = await reportService.createManyReports(
      reportItems,
      reporterUser._id.toString()
    );

    res.status(201).json({
      message: "Reports created successfully.",
      data: newReports,
    });
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

    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

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

    if (!updated) {
      return res.status(404).json({ error: "Report not found." });
    }

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

    if (!deleted) {
      return res.status(404).json({ error: "Report not found." });
    }

    res.status(200).json({ message: "Report deleted successfully." });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to delete the report.";
    res.status(500).json({ error: message });
  }
};