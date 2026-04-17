import mongoose from "mongoose";
import { Match } from "../models/match.model";
import { User } from "../models/user.model";
import { ChatRoom } from "../models/chatroom.model";
import { calculateSynergy } from "../utils/calculateSynergy";

const DAILY_MATCH_COUNT = 5;
const RECOMMENDATION_TTL_MS = 24 * 60 * 60 * 1000;
const CHATROOM_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type PopulatedTargetUser = {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  fullName?: { first?: string; last?: string };
  mbtiType?: string;
  images?: string[];
  bio?: string;
};

type AggregatedTarget = {
  _id: mongoose.Types.ObjectId;
  mbtiType: string;
};

const getUserByFirebaseUid = async (firebaseUid: string) => {
  const user = await User.findOne({ firebaseUid });

  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  return user;
};

const buildEligibleUserFilter = (
  excludedIds: mongoose.Types.ObjectId[] = [],
) => ({
  _id: { $nin: excludedIds },
  mbtiType: { $nin: [null, "", "NOT_SPECIFIED"] },
  mbtiTestchecked: true,
  isDeleted: { $ne: true },
  isSuspended: { $ne: true },
});

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
    .filter((entry) => entry.expiresAt > now && entry.isOpened === false)
    .map((entry) => {
      const targetUser = entry.targetId as unknown as PopulatedTargetUser;

      return {
        matchId: matchFeed._id.toString(),
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
    .sort((a, b) => b.synergyScore - a.synergyScore)
    .slice(0, 5);

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

  const currentMbti = currentUser.mbtiType;
  const targetMbti = targetUser.mbtiType;

  const synergyScore =
    currentMbti &&
    targetMbti &&
    currentMbti !== "NOT_SPECIFIED" &&
    targetMbti !== "NOT_SPECIFIED"
      ? calculateSynergy(currentMbti, targetMbti)
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
          isOpened: true,
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

  console.log("updatedFeed", updatedFeed);

  return updatedFeed;
};

export const processMatchInteraction = async (
  firebaseUid: string,
  matchId: string,
  targetUserId: string,
) => {
  const currentUser = await getUserByFirebaseUid(firebaseUid);

  const matchFeed = await Match.findOne({
    _id: new mongoose.Types.ObjectId(matchId),
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

  // 🔧 FIX defensive
  if (!entry?.expiresAt) {
    throw new Error("Match is corrupted (missing expiresAt).");
  }

  const expiresAt = new Date(entry.expiresAt);

  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    throw new Error("Match recommendation expired.");
  }

  const result = await Match.updateOne(
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

  console.log("isOpen  result", result);

  let room = await ChatRoom.findOne({
    participants: {
      $all: [currentUserParticipantId, targetParticipantId],
    },
  });

  if (!room) {
    room = await ChatRoom.create({
      participants: [
        currentUser._id,
        new mongoose.Types.ObjectId(targetUserId),
      ],
      matchId: matchFeed._id,
      expiresAt: new Date(Date.now() + CHATROOM_TTL_MS),
      status: "active",
    });
  }
  console.log("room._id:", room._id);
  console.log("room.roomId:", room.roomId);

  return room.roomId;
};

export const generateDailyMatches = async () => {
  const allUsers = await User.find(buildEligibleUserFilter(), {
    _id: 1,
    mbtiType: 1,
  }).lean();

  for (const user of allUsers) {
    const existingFeed = await Match.findOne({ userId: user._id });
    if (existingFeed && existingFeed.matchedUsers.length > 0) {
      continue;
    }

    const currentEntries = existingFeed?.matchedUsers ?? [];
    // const activeTargetIds = currentEntries
    //   .filter((entry) => entry.expiresAt.getTime() > Date.now())
    //   .map((entry) => entry.targetId);
    const activeTargetIds = currentEntries
      .filter(
        (entry) => entry.expiresAt && entry.expiresAt.getTime() > Date.now(),
      )
      .map((entry) => entry.targetId);

    // 🔧 FIX PRINCIPAL
    const activeEntries = currentEntries.filter((entry) => {
      if (!entry?.expiresAt) return false;

      const expiresAt =
        entry.expiresAt instanceof Date
          ? entry.expiresAt
          : new Date(entry.expiresAt);

      return (
        !Number.isNaN(expiresAt.getTime()) &&
        expiresAt.getTime() > now.getTime()
      );
    });

    const activeTargetIds = activeEntries.map(
      (entry) => new mongoose.Types.ObjectId(entry.targetId.toString()),
    );

    const excludedIds: mongoose.Types.ObjectId[] = [
      new mongoose.Types.ObjectId(user._id.toString()),
      ...activeTargetIds,
    ];

    const remainingSlots = Math.max(
      0,
      DAILY_MATCH_COUNT - activeEntries.length,
    );

    if (remainingSlots === 0) continue;

    const targets = await User.aggregate<AggregatedTarget>([
      { $match: buildEligibleUserFilter(excludedIds) },
      { $sample: { size: remainingSlots } },
      { $project: { _id: 1, mbtiType: 1 } },
    ]);

    const expiresAt = new Date(now.getTime() + RECOMMENDATION_TTL_MS);
    const userMbti = String(user.mbtiType);

    const newMatches = targets.map((target) => ({
      targetId: target._id,
      synergyScore: calculateSynergy(userMbti, String(target.mbtiType)),
      isOpened: false,
      recommendedAt: now,
      expiresAt,
    }));
    console.log("newMatches", newMatches);
    await Match.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          matchedUsers: [
            ...currentEntries.filter(
              (entry) => entry.expiresAt > now && entry.isOpened === false,
            ),
            ...newMatches,
          ],
        },
        // $set: {
        //   matchedUsers: newMatches,
        // },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  console.log("Daily match recommendations refreshed successfully.");
};
