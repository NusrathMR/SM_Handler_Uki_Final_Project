import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { generateCaption } from "../controller/aiController.js";


const route = express.Router();

route.post("/generate-caption", protect, generateCaption)

export default route;