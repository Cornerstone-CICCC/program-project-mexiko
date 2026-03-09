import { Match, IMatch } from "../models/match.model";
import { User } from "../models/user.model";
import { ChatRoom } from "../models/chatroom.model";
import { calculateSynergy } from "../utils/calculateSynergy";
import mongoose from "mongoose";

export const getMatchingList = async (userId: string) => {
  const myProfile = await User.findById(userId);
  if (!myProfile) throw new Error("User not found.");

  const userIdObject = new mongoose.Types.ObjectId(userId);
  const matchingList = (await Match.find({
    userId: { $ne: userIdObject },
  }).lean()) as IMatch[];

  const listWithSynergy = await Promise.all(
    matchingList.map(async (match: IMatch) => {
      const targetId = match.matchedUsers[0]?.targetId;
      const targetUser = await User.findById(targetId);

      const synergyScore = targetUser?.mbtiType
        ? calculateSynergy(myProfile.mbtiType, targetUser.mbtiType)
        : 0;

      return {
        ...match,
        synergyScore,
      };
    }),
  );

  return listWithSynergy.sort((a, b) => b.synergyScore - a.synergyScore);
};

export const createMatchRequest = async (
  myId: string,
  targetUserId: string,
) => {
  const existingMatch = await Match.findOne({
    userId: myId,
    "matchedUsers.targetId": targetUserId,
  });
  if (existingMatch) throw new Error("Already matched or pending.");

  return await Match.create({
    userId: myId,
    matchedUsers: [
      {
        targetId: targetUserId,
        synergyScore: 0,
        isOpened: false,
      },
    ],
    matchDate: new Date().toISOString(),
  });
};

export const processMatchInteraction = async (
  matchId: string,
  currentUserId: string,
  targetUserId: string,
) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match not found.");

  if (
    new Date().getTime() - new Date(match.createdAt).getTime() >
    24 * 60 * 60 * 1000
  ) {
    throw new Error("Match request expired.");
  }

  await Match.findOneAndUpdate(
    { _id: matchId, "matchedUsers.targetId": targetUserId },
    { $set: { "matchedUsers.$.isOpened": true } },
    { new: true },
  );

  let room = await ChatRoom.findOne({
    participants: { $all: [currentUserId, targetUserId] },
  });

  if (!room) {
    room = await ChatRoom.create({
      participants: [currentUserId, targetUserId],
      matchId: new mongoose.Types.ObjectId(matchId),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "active",
    });
  }
  return room._id;
};
