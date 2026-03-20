import { User, IUser } from "../models/user.model";
import admin from "firebase-admin";

// delete later
export const createUserDirect = async (userInfo: Partial<IUser>) => {
  return await User.create(userInfo);
};

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    console.log('🔵 [SERVICE] Verifying Firebase token...');
    
    // Verify that Firebase Admin is initialized
    if (!admin.apps.length) {
      throw new Error('Firebase Admin is not initialized. Please initialize it before calling this function.');
    }
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('✅ [SERVICE] Token verified for UID:', decodedToken.uid);
    
    return decodedToken;
  } catch (error) {
    console.error('❌ [SERVICE] Error verifying token:', error);
    throw error;
  }
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

export const createUser = async (userData: any) => {
  try {
    console.log('🔵 [SERVICE] Creating user in MongoDB...');
    
    // Ensure fullName has the correct structure
    const userToCreate = {
      firebaseUid: userData.firebaseUid,
      email: userData.email,
      fullName: {
        first: userData.fullName?.first || 'Usuario',
        last: userData.fullName?.last || ''
      },
    };
    
    const newUser = new User(userToCreate);
    const savedUser = await newUser.save();
    
    console.log('✅ [SERVICE] User created with ID:', savedUser._id);
    return savedUser;
    
  } catch (error) {
    console.error('❌ [SERVICE] Error creating user:', error);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('❌ [SERVICE] Error finding user by email:', error);
    throw error;
  }
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
