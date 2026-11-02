import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { getSettings, updateSettings } from "../controller/adminSettingsController.js";

const router = express.Router();

// protect checks the token, adminOnly checks role === "admin"
router.get("/", protect, adminOnly, getSettings);
router.put("/", protect, adminOnly, updateSettings);

export default router;