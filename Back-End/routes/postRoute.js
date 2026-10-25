import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import {
  createPost,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controller/postController.js"

const route = express.Router()

// Every route below this line requires a logged-in user
route.use(protect)

route.post("/", createPost)
route.get("/", getMyPosts)
route.get("/:id", getPostById)
route.put("/:id", updatePost)
route.delete("/:id", deletePost)

export default route