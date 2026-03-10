import { ChatRoom } from "../models/chatroom.model";
import { Message } from "../models/message.model";

export const chatService = {
  async getMyRooms(userId: string) {
    return await ChatRoom.find({ participants: userId }).sort({
      updatedAt: -1,
    });
  },

  async getRoomDetails(roomId: string, userId: string) {
    const room = await ChatRoom.findOne({ _id: roomId, participants: userId });
    if (!room) throw new Error("Access denied or not found");

    const messages = await Message.find({ chatRoomId: roomId })
      .sort({ createdAt: -1 }) //Sort by latest
      .limit(50);

    return { room, messages };
  },

  async createRoom(userId: string, targetId: string, matchId: string) {
    const existingRoom = await ChatRoom.findOne({
      participants: { $all: [userId, targetId] },
    });

    if (existingRoom) {
      return existingRoom;
    }

    const newRoom = await ChatRoom.create({
      participants: [userId, targetId],
      matchId: matchId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastMessage: "",
      //updatedAt: new Date(),
    });

    return newRoom;
  },

  //text
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
    });

    await ChatRoom.findByIdAndUpdate(roomId, {
      lastMessage: content,
      updatedAt: new Date(),
    });

    return newMessage;
  },
  // add media ( picture / voice)

  async deleteRoom(roomId: string, userId: string) {
    const room = await ChatRoom.findOneAndDelete({
      _id: roomId,
      participants: userId,
    });
    if (room) {
      await Message.deleteMany({ chatRoomId: roomId });
    }
    return room;
  },
};
