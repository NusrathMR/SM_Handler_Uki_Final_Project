import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    uploadMedia,
    getMyMedia,
    deleteMedia,
    deleteMediaByPublicId,
} from "../controller/mediaController.js";

const router = express.Router();

// "image" must match the field name used in the React FormData
router.post("/upload", protect, upload.single("image"), uploadMedia);
router.get("/", protect, getMyMedia);
router.delete("/", protect, deleteMediaByPublicId);
router.delete("/:id", protect, deleteMedia);

export default router;