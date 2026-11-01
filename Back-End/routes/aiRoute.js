import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { generateCaptionSuggestion } from "../controller/aiController.js"

const route = express.Router();

route.post("/generate-caption", protect,generateCaptionSuggestion)

export default route;