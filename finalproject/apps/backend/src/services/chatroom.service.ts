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
      .sort({ createdAt: 1 })
      .limit(50);

    return { room, messages };
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
    });

    await ChatRoom.findByIdAndUpdate(roomId, {
      lastMessage: content,
      updatedAt: new Date(),
    });

    return newMessage;
  },

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
