import { User, IUser } from "../models/user.model";
import admin from "firebase-admin";

// delete later
export const createUserDirect = async (userInfo: Partial<IUser>) => {
  return await User.create(userInfo);
};

export const verifyFirebaseToken = async (idToken: string) => {
  return await admin.auth().verifyIdToken(idToken);
};

export const findUser = async (idOrUid: string) => {
  return await User.findOne({
    $or: [
      { _id: idOrUid.match(/^[0-9a-fA-F]{24}$/) ? idOrUid : null },
      { firebaseUid: idOrUid },
    ],
  });
};

export const getAllUsers = async () => await User.find();

export const createUser = async (
  userInfo: Partial<IUser>,
  decodedToken: admin.auth.DecodedIdToken,
) => {
  return await User.create({
    ...userInfo,
    firebaseUid: decodedToken.uid,
    email: decodedToken.email,
  });
};

export const updateUserInfo = async (
  id: string,
  updateData: Partial<IUser>,
) => {
  const allowedFields = ["fullName", "mbtiType", "bio", "hobbies"];
  const filteredData = Object.keys(updateData)
    .filter((key) => allowedFields.includes(key))
    .reduce(
      (obj, key) => ({ ...obj, [key]: updateData[key as keyof IUser] }),
      {},
    );

  return await User.findByIdAndUpdate(
    id,
    { $set: filteredData },
    { new: true },
  );
};

export const updateAdminStatus = async (id: string, isAdmin: boolean) => {
  return await User.findByIdAndUpdate(id, { $set: { isAdmin } }, { new: true });
};

export const deactivateUser = async (id: string) => {
  return await User.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true },
  );
};
