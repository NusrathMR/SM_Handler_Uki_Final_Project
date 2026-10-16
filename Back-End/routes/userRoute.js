import express from "express"
import { registerUser, userSignIn } from "../controller/userController.js"

const routes = express.Router()

routes.post("/signup", registerUser)
routes.post("/signin", userSignIn)

export default routes