import mongoose from "mongoose";
import { Match } from "../models/match.model";
import { User } from "../models/user.model";
import { ChatRoom } from "../models/chatroom.model";
import { calculateSynergy } from "../utils/calculateSynergy";

const DAILY_MATCH_COUNT = 5;
const RECOMMENDATION_TTL_MS = 24 * 60 * 60 * 1000;
const CHATROOM_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const getUserByFirebaseUid = async (firebaseUid: string) => {
  const user = await User.findOne({ firebaseUid });

  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  return user;
};

export const getMatchingList = async (firebaseUid: string) => {
  const currentUser = await getUserByFirebaseUid(firebaseUid);

  const matchFeed = await Match.findOne({ userId: currentUser._id })
    .populate("matchedUsers.targetId", "email fullName mbtiType images bio")
    .lean();

  if (!matchFeed) {
    return [];
  }

  const now = new Date();

  const activeMatches = matchFeed.matchedUsers
    .filter((entry) => entry.expiresAt > now)
    .map((entry) => {
      const targetUser = entry.targetId as unknown as {
        _id?: mongoose.Types.ObjectId;
        email?: string;
        fullName?: { first?: string; last?: string };
        mbtiType?: string;
        images?: string[];
        bio?: string;
      };

      return {
        targetUserId: targetUser?._id?.toString?.() ?? "",
        synergyScore: entry.synergyScore,
        isOpened: entry.isOpened,
        recommendedAt: entry.recommendedAt,
        expiresAt: entry.expiresAt,
        targetUser: {
          email: targetUser?.email ?? null,
          fullName: targetUser?.fullName ?? null,
          mbtiType: targetUser?.mbtiType ?? null,
          images: targetUser?.images ?? [],
          bio: targetUser?.bio ?? null,
        },
      };
    })
    .sort((a, b) => b.synergyScore - a.synergyScore);

  return activeMatches;
};

export const createMatchRequest = async (
  firebaseUid: string,
  targetUserId: string,
) => {
  const currentUser = await getUserByFirebaseUid(firebaseUid);

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new Error("Invalid target user id.");
  }

  if (currentUser._id.toString() === targetUserId) {
    throw new Error("You cannot match with yourself.");
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new Error("Target user not found.");
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + RECOMMENDATION_TTL_MS);
  const synergyScore =
    currentUser.mbtiType && targetUser.mbtiType
      ? calculateSynergy(currentUser.mbtiType, targetUser.mbtiType)
      : 0;

  const existingFeed = await Match.findOne({ userId: currentUser._id });

  const alreadyExists = existingFeed?.matchedUsers.some(
    (entry) => entry.targetId.toString() === targetUserId,
  );

  if (alreadyExists) {
    throw new Error("Target user already exists in your match feed.");
  }

  const updatedFeed = await Match.findOneAndUpdate(
    { userId: currentUser._id },
    {
      $push: {
        matchedUsers: {
          targetId: new mongoose.Types.ObjectId(targetUserId),
          synergyScore,
          isOpened: false,
          recommendedAt: now,
          expiresAt,
        },
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  return updatedFeed;
};

export const processMatchInteraction = async (
  firebaseUid: string,
  matchId: string,
  targetUserId: string,
) => {
  const currentUser = await getUserByFirebaseUid(firebaseUid);

  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    throw new Error("Invalid match id.");
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new Error("Invalid target user id.");
  }

  const matchFeed = await Match.findOne({
    _id: matchId,
    userId: currentUser._id,
  });

  if (!matchFeed) {
    throw new Error("Match feed not found.");
  }

  const entry = matchFeed.matchedUsers.find(
    (item) => item.targetId.toString() === targetUserId,
  );

  if (!entry) {
    throw new Error("Target user is not in this match feed.");
  }

  if (entry.expiresAt.getTime() < Date.now()) {
    throw new Error("Match recommendation expired.");
  }

  await Match.updateOne(
    {
      _id: matchFeed._id,
      userId: currentUser._id,
      "matchedUsers.targetId": new mongoose.Types.ObjectId(targetUserId),
    },
    {
      $set: {
        "matchedUsers.$.isOpened": true,
      },
    },
  );

  let room = await ChatRoom.findOne({
    participants: {
      $all: [currentUser._id, new mongoose.Types.ObjectId(targetUserId)],
    },
  });

  if (!room) {
    room = await ChatRoom.create({
      participants: [currentUser._id, new mongoose.Types.ObjectId(targetUserId)],
      matchId: matchFeed._id,
      expiresAt: new Date(Date.now() + CHATROOM_TTL_MS),
      status: "active",
    });
  }

  return room._id;
};

export const generateDailyMatches = async () => {
  const allUsers = await User.find({
    mbtiType: { $exists: true, $ne: null },
    isDeleted: { $ne: true },
  });

  for (const user of allUsers) {
    const existingFeed = await Match.findOne({ userId: user._id });

    const currentEntries = existingFeed?.matchedUsers ?? [];
    const activeTargetIds = currentEntries
      .filter((entry) => entry.expiresAt.getTime() > Date.now())
      .map((entry) => entry.targetId);

    const excludedIds = [user._id, ...activeTargetIds];

    const targets = await User.aggregate([
      {
        $match: {
          _id: { $nin: excludedIds },
          mbtiType: { $exists: true, $ne: null },
          isDeleted: { $ne: true },
        },
      },
      { $sample: { size: DAILY_MATCH_COUNT } },
    ]);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + RECOMMENDATION_TTL_MS);

    const newMatches = targets.map((target) => ({
      targetId: target._id,
      synergyScore: calculateSynergy(user.mbtiType, target.mbtiType),
      isOpened: false,
      recommendedAt: now,
      expiresAt,
    }));

    await Match.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          matchedUsers: [
            ...currentEntries.filter((entry) => entry.expiresAt > now),
            ...newMatches,
          ],
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  console.log("Daily match recommendations refreshed successfully.");
};