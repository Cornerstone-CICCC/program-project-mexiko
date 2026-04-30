import mongoose from "mongoose";
import { Match } from "../models/match.model";
import { User } from "../models/user.model";
import { ChatRoom } from "../models/chatroom.model";
import { calculateSynergy } from "../utils/calculateSynergy";

const DAILY_MATCH_COUNT = 5;
const RECOMMENDATION_TTL_MS = 24 * 60 * 60 * 1000;
const CHATROOM_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type MatchFilters = {
  gender?: string;
  maxDistance?: number;
};

const getUserByFirebaseUid = async (firebaseUid: string) => {
  const user = await User.findOne({ firebaseUid });

  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  return user;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateDistanceKm = (
  fromCoordinates: number[],
  toCoordinates: number[],
): number => {
  const [fromLng, fromLat] = fromCoordinates;
  const [toLng, toLat] = toCoordinates;

  const earthRadiusKm = 6371;

  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

export const getMatchingList = async (
  firebaseUid: string,
  filters: MatchFilters = {},
) => {
  const currentUser = await getUserByFirebaseUid(firebaseUid);
  const now = new Date();

  console.log("=== Matching Search Start (Stored Data) ===");
  console.log(`User: ${currentUser.fullName?.first} / ID: ${currentUser._id}`);

  const matchFeed = await Match.findOne({ userId: currentUser._id }).populate({
    path: "matchedUsers.targetId",
    model: "User",
  });

  if (
    !matchFeed ||
    !matchFeed.matchedUsers ||
    matchFeed.matchedUsers.length === 0
  ) {
    console.log("⚠️ No stored matches found for this user.");
    return [];
  }

  const validMatches = matchFeed.matchedUsers.filter((entry: any) => {
    return entry.expiresAt > now && entry.targetId !== null;
  });

  console.log(`>>> Stored Matches Found: ${validMatches.length} users`);

  return validMatches.map((entry: any) => {
    const target = entry.targetId;

    let distanceKm = 0;
    if (currentUser.location?.coordinates && target.location?.coordinates) {
      distanceKm = calculateDistanceKm(
        currentUser.location.coordinates,
        target.location.coordinates,
      );
    }

    return {
      matchId: matchFeed._id.toString(),
      targetUserId: target._id.toString(),
      synergyScore: entry.synergyScore,
      isOpened: entry.isOpened,
      recommendedAt: entry.recommendedAt,
      expiresAt: entry.expiresAt,
      distanceKm: distanceKm,
      targetUser: {
        email: target.email,
        fullName: target.fullName,
        mbtiType: target.mbtiType,
        images: target.images || [],
        bio: target.bio,
        gender: target.gender,
      },
    };
  });
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
          //targetId: new mongoose.Types.ObjectId(targetUserId),
          targetId: targetUserId,
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
      $all: [currentUser._id.toString(), targetUserId],
    },
  });

  if (!room) {
    room = await ChatRoom.create({
      participants: [currentUser._id.toString(), targetUserId],
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
  console.log("🚀 Starting Daily Match Generation...");

  try {
    const allUsers = await User.find({
      mbtiType: { $exists: true, $ne: null },
      isDeleted: { $ne: true },
    });

    const now = new Date();

    for (const user of allUsers) {
      console.log(
        `Checking match for user: ${user.fullName?.first} (${user._id})`,
      );

      const coords = user.location?.coordinates;
      if (!Array.isArray(coords) || (coords[0] === 0 && coords[1] === 0)) {
        continue;
      }

      const existingFeed = await Match.findOne({ userId: user._id });
      const currentEntries = existingFeed?.matchedUsers ?? [];

      const activeEntries = currentEntries.filter(
        (entry) => entry.expiresAt > now && entry.isOpened === false,
      );

      if (activeEntries.length >= DAILY_MATCH_COUNT) {
        continue;
      }

      const excludedIds = [user._id, ...activeEntries.map((e) => e.targetId)];
      const slotsNeeded = DAILY_MATCH_COUNT - activeEntries.length;

      const minAge = user.preferredAgeRange?.min || 18;
      const maxAge = user.preferredAgeRange?.max || 100;
      const minBirthDate = new Date();
      minBirthDate.setFullYear(now.getFullYear() - maxAge);
      const maxBirthDate = new Date();
      maxBirthDate.setFullYear(now.getFullYear() - minAge);

      const targets = await User.aggregate([
        {
          $geoNear: {
            near: user.location,
            distanceField: "distance",
            maxDistance: (user.preferredDistance || 10) * 1609.34,
            query: {
              _id: { $nin: excludedIds },
              mbtiType: { $exists: true, $ne: null },
              isDeleted: { $ne: true },
              gender:
                user.preferredGender === "All"
                  ? { $exists: true }
                  : user.preferredGender,
              birthDate: { $gte: minBirthDate, $lte: maxBirthDate },
            },
            spherical: true,
          },
        },
        { $sample: { size: slotsNeeded } },
      ]);

      if (targets.length === 0) continue;

      const expiresAt = new Date(now.getTime() + RECOMMENDATION_TTL_MS);

      const newMatches = targets.map((target) => ({
        targetId: target._id,
        synergyScore: calculateSynergy(user.mbtiType!, target.mbtiType!),
        isOpened: false,
        recommendedAt: now,
        expiresAt,
      }));

      await Match.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            matchedUsers: [...activeEntries, ...newMatches],
          },
        },
        { upsert: true, returnDocument: "after" },
      );
    }

    console.log("✅ Daily match recommendations refreshed successfully.");
  } catch (error) {
    console.error("❌ Error in generateDailyMatches:", error);
  }
};

export const generateMatchesForNewUser = async (firebaseUid: string) => {
  const user = await getUserByFirebaseUid(firebaseUid);
  const now = new Date();

  const coords = user.location?.coordinates;
  if (!Array.isArray(coords) || (coords[0] === 0 && coords[1] === 0)) {
    console.log("❌ No location → cannot generate matches");
    return [];
  }

  const minAge = user.preferredAgeRange?.min || (18 as number);
  const maxAge = user.preferredAgeRange?.max || (100 as number);

  const minBirthDate = new Date();
  minBirthDate.setFullYear(now.getFullYear() - maxAge);

  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(now.getFullYear() - minAge);

  const targets = await User.aggregate([
    {
      $geoNear: {
        near: user.location,
        distanceField: "distance",
        //maxDistance: (user.preferredDistance || 10) * 1609.34,
        query: {
          _id: { $ne: user._id },
          mbtiType: { $exists: true, $ne: null },
          isDeleted: { $ne: true },
          gender:
            user.preferredGender === "All"
              ? { $exists: true }
              : user.preferredGender,
          birthDate: { $gte: minBirthDate, $lte: maxBirthDate },
        },
        spherical: true,
      },
    },
    { $sample: { size: DAILY_MATCH_COUNT } },
  ]);

  if (targets.length === 0) {
    console.log("❌ No targets found");
    return [];
  }

  const expiresAt = new Date(now.getTime() + RECOMMENDATION_TTL_MS);

  const newMatches = targets.map((target) => ({
    targetId: target._id,
    synergyScore: calculateSynergy(user.mbtiType!, target.mbtiType!),
    isOpened: false,
    recommendedAt: now,
    expiresAt,
  }));

  const matchFeed = await Match.findOneAndUpdate(
    { userId: user._id },
    {
      $set: { matchedUsers: newMatches },
    },
    { upsert: true, new: true },
  );

  console.log("✅ Matches created for new user");
  console.log("matchFeed", matchFeed);
  return matchFeed;
};
