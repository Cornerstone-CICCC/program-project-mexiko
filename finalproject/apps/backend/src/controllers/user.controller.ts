import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { User } from "../models/user.model";

// delete later
export const createUserDev = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUserDirect(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await userService.verifyFirebaseToken(idToken);
    const email = decodedToken.email;

    // Search for user by Firebase UID first (for users created after Firebase integration)
    let user = await userService.findUser(decodedToken.uid);

    // If not found by UID, try email (for users created before Firebase integration)
    if (!user && email) {
      console.log("⚠️ Not found by UID, searching by email...");
      user = await userService.findUserByEmail(email);

      if (user) {
        console.log("✅ Linking user by email...");
        user.firebaseUid = decodedToken.uid;
        await user.save();
      }
    }

    if (!user) {
      return res.status(200).json({
        isNewUser: true,
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
      });
    }

    res.cookie("user-login", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Save session with firebaseUid instead of MongoDB _id
    req.session.userId = user.firebaseUid;
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ error: "Session error" });
      }
      res.status(200).json({ success: true, user });
      console.log("req.session.userId", req.session.userId);
    });

    //res.status(200).json({ success: true, user });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Invalid authentication token.";
    return res.status(401).json({ error: message });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout session destroy error:", err);
      return res.status(500).json({ error: "Failed to logout." });
    }

    res.clearCookie("user-login", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ success: true });
  });
};

export const getSessionMe = async (req: Request, res: Response) => {
  try {
    const sessionUserId = req.session?.userId;

    if (!sessionUserId) {
      return res.status(200).json({
        authenticated: false,
        user: null,
      });
    }

    const user = await User.findOne({ firebaseUid: sessionUserId });

    if (!user) {
      return res.status(200).json({
        authenticated: false,
        user: null,
      });
    }

    return res.status(200).json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("getSessionMe error:", error);
    return res.status(500).json({
      error: "Failed to get session user",
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { userInfo, idToken } = req.body;
    const decodedToken = await userService.verifyFirebaseToken(idToken);
    const email = decodedToken.email || userInfo.email;

    // find firebaseUid first
    let user = await userService.findUser(decodedToken.uid);

    if (user) {
      return res.status(200).json({
        isNewUser: false,
        user: user,
      });
    }

    // If not found by UID, try email (for users created before Firebase integration)
    user = await userService.findUserByEmail(email);

    if (user) {
      // Update existing user with firebaseUid
      user.firebaseUid = decodedToken.uid;
      await user.save();

      return res.status(200).json({
        isNewUser: false,
        user: user,
        message: "User found by email and linked to Firebase UID.",
      });
    }

    // If still not found, create new user
    const newUser = await userService.createUser({
      firebaseUid: decodedToken.uid,
      email: email,
      fullName: userInfo.fullName || {
        first: userInfo.name || "Usuario",
        last: "",
      },
    });

    res.status(201).json({
      isNewUser: true,
      user: newUser,
    });
  } catch (error) {
    console.error("❌ [SIGNUP] Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch users.";
    res.status(500).json({ error: message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await userService.findUser(id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "An error occurred while fetching the user.";
    res.status(500).json({ error: message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await userService.updateUserInfo(id, req.body.userInfo);
    res.status(201).json(updated);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to update user information.";
    res.status(500).json({ error: message });
  }
};

export const toggleAdmin = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await userService.updateAdminStatus(id, req.body.isAdmin);
    res.status(200).json(updated);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to update admin status.";
    res.status(500).json({ error: message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await userService.deactivateUser(id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json({ message: "User account deactivated successfully." });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to deactivate user account.";
    res.status(500).json({ error: message });
  }
};

export const deleteOwnAccountBySession = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log("=== DELETE OWN ACCOUNT BY SESSION ===");

    const userId = req.userId;
    console.log("User ID from session (firebaseUid):", userId);

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    // Search for user by firebaseUid first (since req.userId is the firebaseUid)
    console.log("Searching for user by firebaseUid...");
    const existingUser = await User.findOne({ firebaseUid: userId });

    if (!existingUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found." });
    }

    const mongoId = existingUser._id;
    console.log("User found in MongoDB with _id:", mongoId);

    // Delete user in MongoDB (soft delete)
    const deactivatedUser = await User.findByIdAndUpdate(
      mongoId,
      {
        isDeleted: true,
        deletedAt: new Date(),
        active: false,
      },
      { new: true },
    );

    if (!deactivatedUser) {
      throw new Error("Failed to deactivate user in MongoDB");
    }

    console.log("✅ User deactivated in MongoDB");

    // Delete cookie to log out user
    res.clearCookie("user-login", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Sent response with firebaseUid for frontend to handle Firebase deletion
    res.status(200).json({
      success: true,
      message: "User account deactivated successfully.",
      firebaseUid: userId,
    });
  } catch (e: unknown) {
    console.error("Delete own account error:", e);
    const message =
      e instanceof Error ? e.message : "Failed to deactivate user account.";
    res.status(500).json({ error: message });
  }
};
