import { Request, Response } from "express";
import User from "../models/user.model";

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Đường dẫn file đã upload
    const filePath = `/uploads/${req.file.filename}`;

    // Lấy userId từ token (được gắn bởi authMiddleware)
    const userId = req.user?._id;

    // Cập nhật avatar cho user
    await User.findByIdAndUpdate(userId, { avatar: filePath });

    res.status(200).json({
      message: "Avatar updated successfully",
      filePath,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading avatar", error: error.message });
  }
};