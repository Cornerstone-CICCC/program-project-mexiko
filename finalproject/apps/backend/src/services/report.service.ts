import { Report, IReport } from "../models/report.model";
import mongoose from "mongoose";

//typre check
const toObjectId = (id: any) => {
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id as string);
  }
  return null;
};

export const getReports = async (
  query: object,
  page: number,
  limit: number,
) => {
  return await Report.find(query)
    .populate("reporterId", "fullName email")
    .populate("targetId", "fullName email isSuspended")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
};

export const getReportsByReporter = async (reporterId: string) => {
  return await Report.find({
    reporterId: new mongoose.Types.ObjectId(reporterId),
  })
    .populate("targetId", "fullName email isSuspended")
    .sort({ createdAt: -1 });
};

export const createManyReports = async (
  reportItems: Partial<IReport>[],
  reporterId: string,
) => {
  const reporterOid = toObjectId(reporterId);
  if (!reporterOid) throw new Error("Invalid Reporter ID format");

  const data = reportItems.map((item) => {
    console.log("--- Report Item Debug ---");
    console.log(
      "Incoming targetId:",
      item.targetId,
      "Type:",
      typeof item.targetId,
    );
    console.log(
      "Incoming chatRoomId:",
      item.chatRoomId,
      "Type:",
      typeof item.chatRoomId,
    );

    const targetOid = toObjectId(item.targetId);
    const chatRoomOid = toObjectId(item.chatRoomId);

    console.log("Converted targetOid:", targetOid);
    console.log("Converted chatRoomOid:", chatRoomOid);

    if (!targetOid) {
      throw new Error(
        `Invalid Target ID: [${item.targetId}] is not a 24-char hex string.`,
      );
    }

    return {
      ...item,
      reporterId: reporterOid,
      targetId: targetOid,
      chatRoomId: chatRoomOid || undefined,
      status: "Pending" as const,
      evidenceImages: item.evidenceImages || [],
    };
  });

  return await Report.insertMany(data);
};

export const findReportById = async (id: string) => {
  return await Report.findById(id)
    .populate("reporterId", "fullName email")
    .populate("targetId", "fullName email isSuspended");
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
    .populate("targetId", "fullName email isSuspended");
};

export const deleteReport = async (id: string) => {
  return await Report.findByIdAndDelete(id);
};
