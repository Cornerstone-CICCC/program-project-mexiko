import { User, IUser } from "../models/user.model";
import admin from "firebase-admin";

// delete later
export const createUserDirect = async (userInfo: Partial<IUser>) => {
  return await User.create(userInfo);
};

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    console.log("🔵 [SERVICE] Verifying Firebase token...");

    // Verify that Firebase Admin is initialized
    if (!admin.apps.length) {
      throw new Error(
        "Firebase Admin is not initialized. Please initialize it before calling this function.",
      );
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("✅ [SERVICE] Token verified for UID:", decodedToken.uid);

    return decodedToken;
  } catch (error) {
    console.error("❌ [SERVICE] Error verifying token:", error);
    throw error;
  }
};

export const getAllUsers = async () => await User.find();

export const createUser = async (userData: any) => {
  try {
    console.log("🔵 [SERVICE] Creating user in MongoDB...");

    // Ensure fullName has the correct structure
    const userToCreate = {
      firebaseUid: userData.firebaseUid,
      email: userData.email,
      fullName: {
        first: userData.fullName?.first || "Usuario",
        last: userData.fullName?.last || "",
      },
    };

    const newUser = new User(userToCreate);
    const savedUser = await newUser.save();

    console.log("✅ [SERVICE] User created with ID:", savedUser._id);
    return savedUser;
  } catch (error) {
    console.error("❌ [SERVICE] Error creating user:", error);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("❌ [SERVICE] Error finding user by email:", error);
    throw error;
  }
};

export const updateUserInfo = async (idOrUid: string, updateData: any) => {
  const id = typeof idOrUid === "object" ? (idOrUid as any).id : idOrUid;

  const allowedFields = [
    "fullName",
    "mbtiType",
    "bio",
    "hobbies",
    "profileImage",
    "location",
    "preferredAgeRange",
    "preferredDistance",
    "Interests",
    "mbtiTestchecked",
  ];

  console.log("id", id);
  console.log("updateData", updateData);

  const actualData = updateData.userInfo ? updateData.userInfo : updateData;

  const filteredData = Object.keys(actualData)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      return { ...obj, [key]: actualData[key] };
    }, {});

  console.log("actualData", actualData);

  return await User.findOneAndUpdate(
    {
      $or: [
        {
          _id:
            typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)
              ? id
              : undefined,
        },
        { firebaseUid: id },
      ],
    },
    { $set: filteredData },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

export const updateAdminStatus = async (id: string, isAdmin: boolean) => {
  return await User.findByIdAndUpdate(id, { $set: { isAdmin } }, { new: true });
};

export const findUser = async (idOrUid: string) => {
  console.log("findUser called with:", idOrUid);
  try {
    const user = await User.findOne({
      $or: [
        { _id: idOrUid.match(/^[0-9a-fA-F]{24}$/) ? idOrUid : null },
        { firebaseUid: idOrUid },
      ],
    });
    console.log("findUser result:", user ? "Found" : "Not found");
    return user;
  } catch (error) {
    console.error("findUser error:", error);
    throw error;
  }
};

export const deactivateUser = async (id: string) => {
  console.log("deactivateUser called with:", id);
  console.log("deactivateUser - ID type:", typeof id);
  console.log("deactivateUser - ID length:", id?.length);

  try {
    // Verify if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    console.log("Is valid ObjectId:", isValidObjectId);

    if (!isValidObjectId) {
      console.log(
        "ID is not a valid MongoDB ObjectId, trying to find by firebaseUid first",
      );
      // Search for user by firebaseUid first (since id might be the firebaseUid)
      const userByFirebaseUid = await User.findOne({ firebaseUid: id });
      if (userByFirebaseUid) {
        console.log("Found user by firebaseUid:", userByFirebaseUid._id);
        const result = await User.findByIdAndUpdate(
          userByFirebaseUid._id,
          { isDeleted: true, deletedAt: new Date() },
          { new: true },
        );
        console.log("deactivateUser result:", result ? "Success" : "Failed");
        return result;
      }
    }

    // If ID is a valid ObjectId or user not found by firebaseUid, try to find by _id
    const result = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );

    console.log(
      "deactivateUser result:",
      result ? "Success" : "User not found",
    );
    return result;
  } catch (error) {
    console.error("deactivateUser error:", error);
    console.error(
      "deactivateUser error details:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
};
