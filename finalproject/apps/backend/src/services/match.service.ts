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

const toRadians = (value: number) => (value * Math.PI) / 180;

const hasValidCoordinates = (coordinates?: number[]) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }

  const [lng, lat] = coordinates;

  if (typeof lng !== "number" || typeof lat !== "number") {
    return false;
  }

  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    return false;
  }

  // Avoid filtering out matches because of default/fake coordinates.
  if (lng === 0 && lat === 0) {
    return false;
  }

  return true;
};

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

const getAgeFromBirthDate = (birthDate?: Date | string | null) => {
  if (!birthDate) {
    return null;
  }

  const date = new Date(birthDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();

  const monthDifference = today.getMonth() - date.getMonth();
  const hasBirthdayPassedThisYear =
    monthDifference > 0 ||
    (monthDifference === 0 && today.getDate() >= date.getDate());

  if (!hasBirthdayPassedThisYear) {
    age -= 1;
  }

  return age;
};

export const getMatchingList = async (firebaseUid: string) => {
  const currentUser = await getUserByFirebaseUid(firebaseUid);

  const preferredGender = (currentUser as any).preferredGender;
  const preferredAgeRange = (currentUser as any).preferredAgeRange;
  const preferredDistance = Number((currentUser as any).preferredDistance);
  const currentUserCoordinates = (currentUser as any).location?.coordinates;

  const matchFeed = await Match.findOne({ userId: currentUser._id })
    .populate(
      "matchedUsers.targetId",
      "email fullName mbtiType images bio gender birthDate location",
    )
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
        gender?: string;
        birthDate?: Date | string | null;
        location?: {
          type?: string;
          coordinates?: number[];
        };
      };

      const targetCoordinates = targetUser?.location?.coordinates;

      const canCalculateDistance =
        hasValidCoordinates(currentUserCoordinates) &&
        hasValidCoordinates(targetCoordinates);

      const distanceKm = canCalculateDistance
        ? calculateDistanceKm(currentUserCoordinates, targetCoordinates!)
        : null;

      return {
        matchId: matchFeed._id.toString(),
        targetUserId: targetUser?._id?.toString?.() ?? "",
        synergyScore: entry.synergyScore,
        isOpened: entry.isOpened,
        recommendedAt: entry.recommendedAt,
        expiresAt: entry.expiresAt,
        distanceKm,
        targetUser: {
          email: targetUser?.email ?? null,
          fullName: targetUser?.fullName ?? null,
          mbtiType: targetUser?.mbtiType ?? null,
          images: targetUser?.images ?? [],
          bio: targetUser?.bio ?? null,
          gender: targetUser?.gender ?? null,
          birthDate: targetUser?.birthDate ?? null,
        },
      };
    })
    .filter((entry) => {
      const genderMatches =
        !preferredGender ||
        preferredGender === "All" ||
        entry.targetUser.gender === preferredGender;

      const targetAge = getAgeFromBirthDate(entry.targetUser.birthDate);

      const ageMatches =
        targetAge === null ||
        !preferredAgeRange ||
        typeof preferredAgeRange.min !== "number" ||
        typeof preferredAgeRange.max !== "number" ||
        (targetAge >= preferredAgeRange.min &&
          targetAge <= preferredAgeRange.max);

      const distanceMatches =
        Number.isNaN(preferredDistance) ||
        preferredDistance <= 0 ||
        entry.distanceKm === null ||
        entry.distanceKm <= preferredDistance;

      return genderMatches && ageMatches && distanceMatches;
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

      const targets = await User.aggregate([
        {
          $match: {
            _id: { $nin: excludedIds },
            mbtiType: { $exists: true, $ne: null },
            isDeleted: { $ne: true },
          },
        },
        { $sample: { size: slotsNeeded } },
      ]);

      if (targets.length === 0) continue;

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