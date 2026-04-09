import { Request, Response } from "express";
import { chatService } from "../services/chatroom.service";
import { Message } from "../models/message.model";

export const listRooms = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    console.log("userid", userId);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rooms = await chatService.getMyRooms(userId);

    res.status(200).json({ data: rooms });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const roomId = String(req.params.roomId || req.params.id);
    const userId = req.session.userId;
    const page = parseInt(req.query.page as string) || 1;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!roomId) return res.status(400).json({ error: "Room ID is required" });

    await chatService.markMessagesAsRead(roomId, userId);

    const io = req.app.get("io");
    if (io) {
      io.to(roomId).emit("messages_read", { roomId, userId });
    }
    const result = await chatService.getRoomDetails(roomId, userId, page);
    return res.status(200).json({ ...result, myId: userId });
  } catch (e: any) {
    console.error("❌ [Controller] catch error:", e.message);

    res.status(403).json({ error: e.message });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const { targetId, matchId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const room = await chatService.createRoom(userId, targetId, matchId);

    res.status(201).json({
      message: "Chat room created successfully.",
      data: room,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const postMessage = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let { content, messageType } = req.body || {};

    if (messageType === "image" && files?.files) {
      content = files.files.map((f) => f.filename).join(",");
    } else if (files?.file?.[0]) {
      const uploadedFile = files.file[0];
      content = uploadedFile.filename;

      if (!messageType || messageType === "text") {
        if (uploadedFile.mimetype.includes("audio")) messageType = "voice";
        else if (uploadedFile.mimetype.includes("video")) messageType = "video";
        else messageType = "image";
      }
    }

    if (!content && (!files || Object.keys(files).length === 0)) {
      return res
        .status(400)
        .json({ error: "Message content or file is required" });
    }

    const io = req.app.get("io");

    const clientsInRoom = io?.sockets.adapter.rooms.get(roomId);
    const isRecipientPresent = clientsInRoom && clientsInRoom.size > 1;

    const message = await chatService.sendMessage(
      roomId,
      userId,
      content,
      messageType || "text",
    );

    if (isRecipientPresent) {
      message.isRead = true;
      await message.save();
    }

    if (io) {
      io.to(roomId).emit("receive_message", message);

      await Message.findByIdAndUpdate(message._id, { isDelivered: true });
      io.to(roomId).emit("message_delivered", { messageId: message._id });

      if (isRecipientPresent) {
        io.to(roomId).emit("messages_read", { roomId, userId });
      }

      io.emit("update_chat_list", {
        roomId: message.chatRoomId,
        lastMessage:
          message.messageType === "text"
            ? message.content
            : `[${message.messageType}]`,
        updatedAt: message.createdAt,
        senderId: message.senderId,
        isRead: isRecipientPresent,
      });
    }

    return res.status(201).json({ data: message });
  } catch (e: any) {
    console.error("❌ postMessage Error:", e.message);
    res.status(500).json({ error: e.message });
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
