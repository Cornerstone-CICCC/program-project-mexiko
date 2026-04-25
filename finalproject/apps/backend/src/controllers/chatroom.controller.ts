import { Request, Response } from "express";
import { chatService } from "../services/chatroom.service";
import { Message } from "../models/message.model";
import { ChatRoom } from "../models/chatroom.model";

export const listRooms = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    console.log("userid", userId);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rooms = await chatService.getMyRooms(userId);

    //res.status(200).json({ data: rooms });
    res.status(200).json({
      currentUserId: userId,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const roomId = String(req.params.roomId || req.params.id);
    const userId = req.session.userId;
    const page = parseInt(req.query.page as string) || 1;
    console.log("roomId", roomId);
    console.log("userId controller", userId);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!roomId) return res.status(400).json({ error: "Room ID is required" });

    await chatService.markMessagesAsRead(roomId, userId);

    const io = req.app.get("io");
    if (io) {
      io.to(roomId).emit("messages_read", { roomId, userId });
    }
    const result = await chatService.getRoomDetails(roomId, userId, page);

    //check block user
    if (result.room.blockedBy && result.room.blockedBy.includes(userId)) {
      return res
        .status(403)
        .json({ error: "You have blocked this user or been blocked." });
    }

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

    const room = await ChatRoom.findOne({ roomId });
    if (room?.blockedBy && room.blockedBy.length > 0) {
      return res
        .status(403)
        .json({ error: "Cannot send messages in a blocked chat." });
    }

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const filesMap = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    //const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let { content, messageType } = req.body || {};

    if (filesMap?.files && filesMap.files.length > 0) {
      content = filesMap.files.map((f) => f.filename).join(",");
      if (!messageType) messageType = "image";
    } else if (filesMap?.file?.[0]) {
      const uploadedFile = filesMap.file[0];
      content = uploadedFile.filename;
      console.log("uploadedFile.filename", uploadedFile.filename);

      if (uploadedFile.mimetype.includes("audio")) {
        messageType = "voice";
      } else if (uploadedFile.mimetype.includes("video")) {
        messageType = "video";
      } else if (uploadedFile.mimetype.includes("image")) {
        messageType = "image";
      }
    }

    if (!content && !req.body.content) {
      return res
        .status(400)
        .json({ error: "Message content or file is required" });
    }

    const io = req.app.get("io");

    const clientsInRoom = io?.sockets.adapter.rooms.get(roomId);
    const isRecipientPresent = clientsInRoom && clientsInRoom.size > 1;

    const newMessage = await chatService.sendMessage(
      roomId,
      userId,
      content,
      messageType || "text",
    );

    const unreadCount = await Message.countDocuments({
      chatRoomId: roomId,
      senderId: { $ne: userId },
      isRead: false,
    });

    if (isRecipientPresent) {
      newMessage.isRead = true;
      await newMessage.save();
    }

    if (io) {
      io.to(roomId).emit("receive_message", newMessage);

      await Message.findByIdAndUpdate(newMessage._id, { isDelivered: true });
      io.to(roomId).emit("message_delivered", { messageId: newMessage._id });

      if (isRecipientPresent) {
        io.to(roomId).emit("messages_read", { roomId, userId });
      }
      console.log("unreadCount", unreadCount);

      io.emit("update_chat_list", {
        roomId: newMessage.chatRoomId,
        lastMessage:
          newMessage.messageType === "text"
            ? newMessage.content
            : `[${newMessage.messageType}]`,
        updatedAt: newMessage.createdAt,
        senderId: newMessage.senderId,
        isRead: isRecipientPresent,
        unreadCount,
      });
    }

    return res.status(201).json({ data: newMessage, unreadCount });
  } catch (e: any) {
    console.error("❌ postMessage Error:", e.message);
    res.status(500).json({ error: e.message });
  }
};

export const removeRoom = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId as string;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(`roomId: ${roomId} , userId: ${userId} `);
    await chatService.deleteRoom(roomId, userId);

    res.status(200).json({ message: "Chat room deleted successfully." });
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "You do not have permission to delete this room or it was not found.";
    res.status(403).json({ error: message });
  }
};

export const clearChat = async (req: Request, res: Response) => {
  console.log("clear chat");
  console.log("params: ", req.params);

  try {
    const roomId = req.params.roomId as string;
    const userId = req.session.userId as string;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!roomId) return res.status(400).json({ error: "Room ID is required" });

    await chatService.clearChatHistory(roomId, userId);

    const io = req.app.get("io");
    if (io) {
      io.to(userId).emit("chat_cleared", { roomId });
    }

    res
      .status(200)
      .json({ message: "Chat history cleared for you successfully." });
  } catch (e: any) {
    console.error("❌ clearChat Error:", e.message);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  const userId = req.session.userId as string;
  const roomId = req.params.roomId as string;

  if (!userId || !roomId) {
    return res.status(400).json({ error: "Missing required information" });
  }

  try {
    const result = await chatService.blockUser(roomId, userId);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Chat room not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: result,
    });
  } catch (e: any) {
    console.error("❌ blockUser Error:", e.message);
    res.status(500).json({ error: "Failed to block user" });
  }
};

export const toggleReveal = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!roomId) return res.status(400).json({ error: "Room ID is required" });

    const updatedRoom = await chatService.toggleReveal(roomId, userId);

    if (!updatedRoom) {
      return res
        .status(404)
        .json({ error: "Chat room not found after update." });
    }

    const io = req.app.get("io");
    if (io) {
      io.to(roomId).emit("receive_reveal_request", { senderId: userId });

      if (updatedRoom.isRevealed) {
        io.to(roomId).emit("profiles_revealed", {
          roomId,
          status: updatedRoom.status,
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        consent: updatedRoom.consent,
        isRevealed: updatedRoom.isRevealed,
        status: updatedRoom.status,
      },
    });
  } catch (e: any) {
    console.error("❌ toggleReveal Error:", e.message);
    res.status(500).json({ error: e.message });
  }
};

export const getBlacklist = async (req: Request, res: Response) => {
  try {
    console.log("Current Session:", req.session);
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const blacklist = await chatService.getBlacklist(userId);

    res.status(200).json({
      success: true,
      data: blacklist,
    });
  } catch (error: any) {
    console.error("❌ getBlacklist Error:", error.message);
    res.status(500).json({ error: "Failed to fetch blacklist" });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const roomId = req.params.roomId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!roomId) return res.status(400).json({ error: "Room ID is required" });

    const updatedRoom = await chatService.unblockUser(roomId, userId);

    if (!updatedRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: updatedRoom,
    });
  } catch (error: any) {
    console.error("❌ unblockUser Error:", error.message);
    res.status(500).json({ error: "Failed to unblock user" });
  }
};
