import mongoose from "mongoose";
import { ChatRoom } from "../models/chatroom.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model"; // User 모델 import 확인하세요!

export const chatService = {
  async getMyRooms(userId: string) {
    const rooms = await ChatRoom.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean();

    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        const unreadCount = await Message.countDocuments({
          chatRoomId: room.roomId,
          senderId: { $ne: userId },
          isRead: false,
        });

        const participantDetails = await User.find(
          {
            firebaseUid: { $in: room.participants },
          },
          "firebaseUid mbtiType fullName profileImage",
        ).lean();

        return {
          ...room,
          participants: participantDetails,
          unreadCount,
          currentUserId: userId,
        };
      }),
    );

    return roomsWithDetails;
  },

  async getRoomDetails(roomId: string, userId: string, page: number = 1) {
    const limit = 50;
    const skip = (page - 1) * limit;

    const room = await ChatRoom.findOne({
      roomId: roomId,
      participants: userId,
    }).lean();

    if (!room) {
      throw new Error("Access denied or chat room not found");
    }

    const participantDetails = await User.find(
      {
        firebaseUid: { $in: room.participants },
      },
      "firebaseUid mbtiType fullName profileImage",
    ).lean();

    const messages = await Message.find({
      chatRoomId: roomId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      room: { ...room, participants: participantDetails },
      messages,
      myId: userId,
    };
  },

  async createRoom(userId: string, targetId: string, matchId: string) {
    const newRoom = await ChatRoom.create({
      participants: [userId, targetId],
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
      { roomId: roomId },
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
      participants: userId,
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
};
