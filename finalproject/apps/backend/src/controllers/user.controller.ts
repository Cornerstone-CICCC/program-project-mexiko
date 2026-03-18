import { Request, Response } from "express";
import * as userService from "../services/user.service";

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
    const user = await userService.findUser(decodedToken.uid);

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
    res.status(200).json({ success: true, user });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Invalid authentication token.";
    res.status(401).json({ error: message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("user-login", { path: "/" }).json({ success: true });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { userInfo, idToken } = req.body;
    const decodedToken = await userService.verifyFirebaseToken(idToken);
    const newUser = await userService.createUser(userInfo, decodedToken);
    res.status(201).json(newUser);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to create user account.";
    res.status(500).json({ error: message });
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
