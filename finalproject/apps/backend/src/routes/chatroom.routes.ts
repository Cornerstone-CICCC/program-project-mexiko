import { Router } from "express";
import * as chatController from "../controllers/chatroom.controller";
import multer from "multer";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let ext = path.extname(file.originalname);
    if (!ext) {
      ext = file.mimetype.includes("audio") ? ".m4a" : ".jpg";
    }
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });
const router = Router();

router.get("/", chatController.listRooms);
router.get("/:roomId", chatController.getRoom);
router.delete("/:roomId", chatController.removeRoom);
router.post("/", chatController.createRoom);

router.post(
  "/:roomId/messages",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { messageType, roomId } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (messageType === "image" && files?.files) {
        return chatController.postMessage(req, res);
      }

      if (
        (messageType === "voice" || messageType === "video") &&
        files?.file?.[0]
      ) {
        const uploadedFile = files.file[0];
        const originalPath = uploadedFile.path;
        const fileName = `converted-${Date.now()}${messageType === "voice" ? ".m4a" : ".mp4"}`;
        const targetPath = path.join("uploads", fileName);

        let command = ffmpeg(originalPath);

        if (messageType === "voice") {
          command.toFormat("ipod").audioCodec("aac");
        } else {
          command.videoCodec("libx264").audioCodec("aac").format("mp4");
        }

        command
          .on("end", async () => {
            if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);

            files.file[0].filename = fileName;
            files.file[0].path = targetPath;
            return chatController.postMessage(req, res);
          })
          .on("error", (err) => {
            console.error("FFmpeg Error:", err);
            return res.status(500).json({ error: "File processing failed" });
          })
          .save(targetPath);
      } else {
        return chatController.postMessage(req, res);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  },
);

export default router;
