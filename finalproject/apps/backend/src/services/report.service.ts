import { Report, IReport } from "../models/report.model";
import mongoose from "mongoose";

export const getReports = async (
  query: object,
  page: number,
  limit: number,
) => {
  return await Report.find(query)
    .populate("reporterId", "fullName email")
    .populate("targetId", "fullName email")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
};

export const createManyReports = async (
  reportItems: Partial<IReport>[],
  reporterId: string,
) => {
  const data = reportItems.map((item) => ({
    ...item,
    reporterId: new mongoose.Types.ObjectId(reporterId),
    targetId: item.targetId
      ? new mongoose.Types.ObjectId(item.targetId as string)
      : undefined,
    chatRoomId: item.chatRoomId
      ? new mongoose.Types.ObjectId(item.chatRoomId as string)
      : undefined,
    status: "Pending" as const,
    evidenceImages: item.evidenceImages || [],
  }));

  return await Report.insertMany(data);
};

export const findReportById = async (id: string) => {
  return await Report.findById(id)
    .populate("reporterId", "fullName email")
    .populate("targetId", "fullName email");
};

export const updateReport = async (
  id: string,
  reportInfo: mongoose.UpdateQuery<IReport>,
) => {
  return await Report.findByIdAndUpdate(
    id,
    { $set: reportInfo },
    { new: true, runValidators: true },
  )
    .populate("reporterId", "fullName email")
    .populate("targetId", "fullName email");
};

export const deleteReport = async (id: string) => {
  return await Report.findByIdAndDelete(id);
};