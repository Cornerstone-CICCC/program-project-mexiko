import { Request, Response } from "express";
import * as matchService from "../services/match.service";

export const getMatches = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.userId;
    const list = await matchService.getMatchingList(firebaseUid!);
    return res.status(200).json({ data: list });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to fetch matching list.";
    return res.status(400).json({ error: message });
  }
};

export const applyMatch = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.userId;
    const { targetUserId } = req.body;

    const match = await matchService.createMatchRequest(
      firebaseUid!,
      targetUserId,
    );

    return res
      .status(201)
      .json({ message: "Match requested successfully.", data: match });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to request match.";
    return res.status(400).json({ error: message });
  }
};

export const handleMatchInteraction = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.userId;
    const matchId = req.params.matchId as string;
    const { targetUserId } = req.body;

    const chatRoomId = await matchService.processMatchInteraction(
      firebaseUid!,
      matchId,
      targetUserId,
    );

    return res.status(200).json({
      message: "Match interaction processed successfully.",
      chatRoomId,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to process match interaction.";
    return res.status(400).json({ error: message });
  }
};