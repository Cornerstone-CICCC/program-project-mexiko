import { Request, Response } from "express";
import { chatService } from "../services/chatroom.service";

export const listRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await chatService.getMyRooms(req.userId!);
    res.status(200).json({ data: rooms });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to fetch chat rooms.";
    res.status(500).json({ error: message });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId as string;
    const result = await chatService.getRoomDetails(roomId, req.userId!);
    res.status(200).json(result);
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "You do not have permission to access this chat room.";
    res.status(403).json({ error: message });
  }
};

export const postMessage = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId as string;
    const { content, messageType } = req.body;
    const message = await chatService.sendMessage(
      roomId,
      req.userId!,
      content,
      messageType,
    );
    res
      .status(201)
      .json({ message: "Message sent successfully.", data: message });
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "An error occurred while sending the message.";
    res.status(500).json({ error: message });
  }
};

export const removeRoom = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId as string;
    await chatService.deleteRoom(roomId, req.userId!);
    res.status(200).json({ message: "Chat room deleted successfully." });
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "You do not have permission to delete this room or it was not found.";
    res.status(403).json({ error: message });
  }
};
