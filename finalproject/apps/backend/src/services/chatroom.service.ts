import mongoose from "mongoose";
import { ChatRoom } from "../models/chatroom.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";

export const chatService = {
  async getInternalId(firebaseUid: string) {
    const user = await User.findOne({ firebaseUid });
    return user ? user._id : null;
  },

  async getMyRooms(firebaseUid: string) {
    try {
      const me = await User.findOne({ firebaseUid });
      if (!me) return [];
      const internalId = me._id;

      const rooms = await ChatRoom.find({
        $or: [
          { participants: firebaseUid },
          { participants: internalId as any },
        ],
        blockedBy: { $ne: firebaseUid },
      })
        .sort({ updatedAt: -1 })
        .lean();

      const roomsWithDetails = await Promise.all(
        rooms.map(async (room) => {
          const internalIdStr = room.participants.filter((p) =>
            mongoose.Types.ObjectId.isValid(p),
          );

          let myDeletedAt = new Date(0);
          if (room.deletedAt) {
            if (room.deletedAt instanceof Map) {
              myDeletedAt =
                room.deletedAt.get(firebaseUid) ||
                room.deletedAt.get(internalIdStr as any) ||
                new Date(0);
            } else {
              myDeletedAt =
                (room.deletedAt as any)?.[firebaseUid] ||
                (room.deletedAt as any)?.[internalIdStr as any] ||
                new Date(0);
            }
          }

          const validObjectIds = room.participants.filter((p: any) =>
            mongoose.Types.ObjectId.isValid(p),
          );

          const participantDetails = await User.find(
            {
              $or: [
                { firebaseUid: { $in: room.participants } },
                { _id: { $in: validObjectIds } },
              ],
            },
            "firebaseUid mbtiType fullName profileImage",
          ).lean();

          const unreadCount = await Message.countDocuments({
            chatRoomId: room.roomId,
            senderId: { $ne: firebaseUid },
            isRead: false,
            createdAt: { $gt: myDeletedAt },
          });

          return {
            ...room,
            participants: participantDetails,
            lastMessage: room.lastMessage,
            unreadCount,
            currentUserId: firebaseUid,
          };
        }),
      );

      return roomsWithDetails;
    } catch (error) {
      console.error("getMyRooms Error:", error);
      throw error;
    }
  },

  async getRoomDetails(roomId: string, firebaseUid: string, page: number = 1) {
    const limit = 50;
    const skip = (page - 1) * limit;

    const me = await User.findOne({ firebaseUid });
    if (!me) throw new Error("User not found");
    const internalId = me._id;

    //const isObjectId = mongoose.Types.ObjectId.isValid(roomId);
    // const query = isObjectId
    //   ? {
    //       $or: [
    //         { _id: new mongoose.Types.ObjectId(roomId) },
    //         { roomId: roomId },
    //       ],
    //     }
    //   : { roomId: roomId };
    const query = { roomId: roomId };

    const room = await ChatRoom.findOne({
      ...query,
      $or: [{ participants: firebaseUid }, { participants: internalId as any }],
    }).lean();

    if (!room) throw new Error("Access denied or chat room not found");

    const validObjectIds = room.participants.filter((p: any) =>
      mongoose.Types.ObjectId.isValid(p),
    );

    const participantDetails = await User.find(
      {
        $or: [
          { firebaseUid: { $in: room.participants } },
          { _id: { $in: validObjectIds } },
        ],
      },
      "firebaseUid mbtiType fullName profileImage",
    ).lean();

    const internalIdStr = internalId.toString();
    const myDeletedAt =
      room.deletedAt instanceof Map
        ? room.deletedAt.get(firebaseUid) || room.deletedAt.get(internalIdStr)
        : (room.deletedAt as any)?.[firebaseUid] ||
          (room.deletedAt as any)?.[internalIdStr] ||
          new Date(0);

    const messages = await Message.find({
      chatRoomId: roomId,
      createdAt: { $gt: myDeletedAt },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      room: { ...room, participants: participantDetails },
      messages,
      myId: firebaseUid,
    };
  },

  async createRoom(userId: string, targetId: string, matchId: string) {
    const existingRoom = await ChatRoom.findOne({
      participants: {
        $all: [String(userId), String(targetId)],
      },
    });

    if (existingRoom) {
      return existingRoom;
    }

    const newRoom = await ChatRoom.create({
      participants: [String(userId), String(targetId)],
      matchId,
      lastMessage: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return newRoom;
  },

  async sendMessage(
    roomId: string,
    senderId: string,
    content: string,
    messageType: string = "text",
  ) {
    const newMessage = await Message.create({
      chatRoomId: roomId,
      senderId,
      content,
      messageType,
      isDelivered: false,
      isRead: false,
    });
    await ChatRoom.findOneAndUpdate(
      { roomId: String(roomId) },
      {
        lastMessage: content,
        lastMessageSenderId: senderId,
        lastMessageIsRead: false,
        updatedAt: new Date(),
      },
    );
    return newMessage;
  },

  async deleteRoom(roomId: string, userId: string) {
    const room = await ChatRoom.findOneAndDelete({
      roomId: roomId,
      participants: { $in: [userId] },
    });
    if (room) await Message.deleteMany({ chatRoomId: roomId });
    return room;
  },

  async markMessagesAsRead(roomId: string, userId: string) {
    await Message.updateMany(
      { chatRoomId: roomId, senderId: { $ne: userId }, isRead: false },
      { $set: { isRead: true } },
    );
    await ChatRoom.findOneAndUpdate(
      { roomId: roomId, lastMessageSenderId: { $ne: userId } },
      { $set: { lastMessageIsRead: true } },
    );
  },

  async clearChatHistory(roomId: string, userId: string) {
    const updateQuery = { [`deletedAt.${userId}`]: new Date() };
    return await ChatRoom.findOneAndUpdate(
      { roomId: roomId, participants: userId },
      { $set: updateQuery },
      { new: true },
    );
  },

  async blockUser(roomId: string, userId: string) {
    const room = await ChatRoom.findOne({
      roomId: roomId,
      participants: userId,
    });
    if (!room) throw new Error("Room not found");

    const targetId = room.participants.find((p) => p !== userId);

    return await ChatRoom.findOneAndUpdate(
      { roomId: roomId },
      { $addToSet: { blockedBy: targetId } },
      { new: true },
    );
  },
};
