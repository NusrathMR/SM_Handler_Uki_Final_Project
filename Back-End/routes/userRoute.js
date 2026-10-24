import express from "express"
import { registerUser, userSignIn } from "../controller/userController.js"
import {protect} from "../middleware/authMiddleware.js"
import { getMe } from "../controller/userController.js"


const routes = express.Router()

routes.post("/signup", registerUser)
routes.post("/signin", userSignIn)
routes.get("/me", protect, getMe)

export default routes