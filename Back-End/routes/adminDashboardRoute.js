import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { adminOnly } from "../middleware/adminOnly.js"
import { getAdminDashboard } from "../controller/adminDashboardController.js"

const route = express.Router()

route.use(protect, adminOnly)
route.get("/", getAdminDashboard)

export default route
