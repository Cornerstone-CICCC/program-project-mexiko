import mongoose from "mongoose";
import { ChatRoom } from "../models/chatroom.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";

export const chatService = {
  // async getInternalId(firebaseUid: string) {
  //   const user = await User.findOne({ firebaseUid });
  //   return user ? user._id : null;
  // },

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
      //.populate("participants");

      const roomsWithDetails = await Promise.all(
        rooms.map(async (room) => {
          const internalIdStr = room.participants.filter((p) =>
            mongoose.Types.ObjectId.isValid(p),
          );
          let myDeletedAt = new Date(0);
          if (room.deletedAt) {
            const rawDeletedAt =
              room.deletedAt instanceof Map
                ? room.deletedAt.get(firebaseUid) ||
                  room.deletedAt.get(internalIdStr as any)
                : (room.deletedAt as any)?.[firebaseUid] ||
                  (room.deletedAt as any)?.[internalIdStr as any];

            if (rawDeletedAt) myDeletedAt = new Date(rawDeletedAt);
          }

          const latestMsg = await Message.findOne({
            chatRoomId: room.roomId,
            createdAt: { $gt: myDeletedAt },
          }).sort({ createdAt: -1 });

          const lastMessageToShow = latestMsg ? latestMsg.content : "";
          const lastMessageSender = latestMsg ? latestMsg.senderId : null;
          const lastMessageTime = latestMsg
            ? latestMsg.createdAt
            : room.updatedAt;

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
            "firebaseUid mbtiType fullName profileImage lastLogin gender isRevealed",
          ).lean();

          //console.log("participantDetails", participantDetails);

          const myDetail = participantDetails.find(
            (p) => p.firebaseUid === firebaseUid,
          );
          const otherDetail = participantDetails.find(
            (p) => p.firebaseUid !== firebaseUid,
          );

          const unreadCount = await Message.countDocuments({
            chatRoomId: room.roomId,
            senderId: { $ne: firebaseUid },
            isRead: false,
            createdAt: { $gt: myDeletedAt },
          });
          // console.log(
          //   "otherDetail",
          //   otherDetail,
          //   "participantDetails",
          //   participantDetails,
          // );
          return {
            ...room,
            participants: participantDetails,
            otherParticipant: otherDetail || null,
            me: myDetail,
            lastMessage: lastMessageToShow,
            lastMessageSenderId: lastMessageSender,
            unreadCount,
            updatedAt: lastMessageTime,
            currentUserId: firebaseUid,
            isRevealed: room.isRevealed || false,
            status: room.status || "active",
          };
        }),
      );

      return roomsWithDetails.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
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

    const rawParticipants = await User.find(
      {
        $or: [
          { firebaseUid: { $in: room.participants } },
          { _id: { $in: validObjectIds } },
        ],
      },
      "firebaseUid mbtiType fullName profileImage gender",
    ).lean();

    const participantDetails = room.participants
      .map((pId) => {
        return rawParticipants.find(
          (p) =>
            p.firebaseUid === String(pId) || p._id.toString() === String(pId),
        );
      })
      .filter((p) => p);

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
    const room = await ChatRoom.findOne({ roomId });

    if (room?.blockedBy && room.blockedBy.length > 0) {
      throw new Error("Cannot send message in a blocked chat.");
    }

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

  async deleteRoom(roomId: string, firebaseUid: string) {
    try {
      const user = await User.findOne({ firebaseUid });
      const internalId = user ? user._id : null;

      const room = await ChatRoom.findOneAndDelete({
        roomId: String(roomId),
        $or: [
          { participants: firebaseUid },
          { participants: internalId as any },
        ],
      });

      if (!room) {
        console.error(
          `Room not found or access denied: RoomID: ${roomId}, UserID: ${firebaseUid}`,
        );
        throw new Error("Chat room not found or unauthorized");
      }

      await Message.deleteMany({ chatRoomId: String(roomId) });

      return room;
    } catch (error) {
      console.error("deleteRoom Service Error:", error);
      throw error;
    }
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
    console.log("block targetId:", targetId);
    console.log("block userId:", userId);
    return await ChatRoom.findOneAndUpdate(
      { roomId: roomId },
      { $addToSet: { blockedBy: userId } },
      { new: true },
    );
  },

  async toggleReveal(roomId: string, firebaseUid: string) {
    const [room, user] = await Promise.all([
      ChatRoom.findOne({ roomId }),
      User.findOne({ firebaseUid }),
    ]);

    if (!room) throw new Error("Room not found");
    if (!user) throw new Error("User not found");

    const myFirebaseUid = String(firebaseUid).trim();
    const myInternalId = String(user._id).trim();

    const p0 = String(room.participants[0]).trim();
    const p1 = String(room.participants[1]).trim();

    const isUserA = p0 === myFirebaseUid || p0 === myInternalId;
    const isUserB = p1 === myFirebaseUid || p1 === myInternalId;

    if (!isUserA && !isUserB) {
      throw new Error("Unauthorized: Participant not found in this room");
    }

    const updateField = isUserA ? "consent.userA" : "consent.userB";

    if (room.consent[isUserA ? "userA" : "userB"]) return room;

    let updatedRoom = await ChatRoom.findOneAndUpdate(
      { roomId },
      { $set: { [updateField]: true } },
      { new: true },
    );

    if (updatedRoom && updatedRoom.consent.userA && updatedRoom.consent.userB) {
      updatedRoom = await ChatRoom.findOneAndUpdate(
        { roomId },
        { $set: { isRevealed: true, status: "revealed" } },
        { new: true },
      );
    }

    return updatedRoom;
  },

  async getBlacklist(firebaseUid: string) {
    const rooms = await ChatRoom.find({
      participants: firebaseUid,
      blockedBy: firebaseUid,
    }).lean();

    return Promise.all(
      rooms.map(async (room) => {
        const otherId = room.participants.find((p) => p !== firebaseUid);
        const otherDetail = await User.findOne(
          { firebaseUid: otherId },
          "mbtiType fullName profileImage",
        );
        return {
          roomId: room.roomId,
          otherUser: otherDetail,
        };
      }),
    );
  },
  async unblockUser(roomId: string, userId: string) {
    return await ChatRoom.findOneAndUpdate(
      { roomId: roomId },
      { $pull: { blockedBy: userId } },
      { returnDocument: "after" },
    );
  },
};
