import { Request, Response } from "express";
import * as matchService from "../services/match.service";

export const getMatches = async (req: Request, res: Response) => {
  try {
    const list = await matchService.getMatchingList(req.userId!);
    res.json({ data: list });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to fetch matching list.";
    res.status(400).json({ error: message });
  }
};

export const applyMatch = async (req: Request, res: Response) => {
  try {
    const { targetUserId } = req.body;
    const myId = req.userId;
    const match = await matchService.createMatchRequest(myId!, targetUserId);
    res
      .status(201)
      .json({ message: "Match requested successfully.", data: match });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to request match.";
    res.status(400).json({ error: message });
  }
};

export const handleMatchInteraction = async (req: Request, res: Response) => {
  try {
    const matchId = req.params.matchId as string;
    const { currentUserId, targetUserId } = req.body;
    const chatRoomId = await matchService.processMatchInteraction(
      matchId,
      currentUserId,
      targetUserId,
    );
    res.json({
      message: "Match interaction processed successfully.",
      chatRoomId,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to process match interaction.";
    res.status(400).json({ error: message });
  }
};
