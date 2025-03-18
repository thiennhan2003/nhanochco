import express from "express";
import upload from "../../middlewares/upload.middleware";
import { updateAvatar } from "../../controllers/upload.controller";

const router = express.Router();

// Route upload ảnh
router.post("/upload-avatar", upload.single("avatar"), updateAvatar);

export default router;
