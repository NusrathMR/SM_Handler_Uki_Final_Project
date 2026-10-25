import mongoose from "mongoose"
import Post from "../models/postModel.js"

// The ONLY fields a client may send. Anything else is ignored.
const ALLOWED_FIELDS = ["caption", "hashtags", "contentType", "platforms", "branding"]
const STATUSES = ["draft", "scheduled", "published"]

// Helper 1: copy only the allowed fields from the request body
const pickAllowedFields = (body = {}) => {
  const data = {}
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      data[field] = body[field]
    }
  }
  return data
}

// Helper 2: find a post by id that belongs to THIS user (or return null)
const findMyPost = async (id, userId) => {
  if (!mongoose.isValidObjectId(id)) return null
  return Post.findOne({ _id: id, owner: userId })
}

// Helper 3: one place that turns errors into clean responses
const handleError = (error, res) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((e) => e.message).join(", ")
    return res.status(400).json({ message })
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid value sent..." })
  }
  console.error(error)
  res.status(500).json({ error: "Internal server error..." })
}

// POST /api/posts  -> create a draft
export const createPost = async (req, res) => {
  try {
    const data = pickAllowedFields(req.body)
    const post = await Post.create({ ...data, owner: req.user._id })
    res.status(201).json({ post })
  } catch (error) {
    handleError(error, res)
  }
}

// GET /api/posts  -> list my posts (newest first)
export const getMyPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50)

    const filter = { owner: req.user._id }
    if (req.query.status) {
      if (!STATUSES.includes(req.query.status)) {
        return res.status(400).json({ message: "Invalid status..." })
      }
      filter.status = req.query.status
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("contentType caption status platforms scheduledAt updatedAt")
        .lean(),
      Post.countDocuments(filter),
    ])

    // Send only a short preview of the caption in the list
    const list = posts.map((p) => ({ ...p, caption: p.caption.slice(0, 100) }))

    res.status(200).json({ posts: list, page, limit, total })
  } catch (error) {
    handleError(error, res)
  }
}

// GET /api/posts/:id  -> get one of my posts
export const getPostById = async (req, res) => {
  try {
    const post = await findMyPost(req.params.id, req.user._id)
    if (!post) {
      return res.status(404).json({ message: "Post not found..." })
    }
    res.status(200).json({ post })
  } catch (error) {
    handleError(error, res)
  }
}

// PUT /api/posts/:id  -> update one of my posts
export const updatePost = async (req, res) => {
  try {
    const post = await findMyPost(req.params.id, req.user._id)
    if (!post) {
      return res.status(404).json({ message: "Post not found..." })
    }
    if (post.status === "published") {
      return res.status(400).json({ message: "Published posts cannot be edited..." })
    }

    post.set(pickAllowedFields(req.body))
    await post.save()          // save() runs the model's validation rules
    res.status(200).json({ post })
  } catch (error) {
    handleError(error, res)
  }
}

// DELETE /api/posts/:id  -> delete one of my posts
export const deletePost = async (req, res) => {
  try {
    const post = await findMyPost(req.params.id, req.user._id)
    if (!post) {
      return res.status(404).json({ message: "Post not found..." })
    }
    await post.deleteOne()
    res.status(200).json({ message: "Post deleted successfully..." })
  } catch (error) {
    handleError(error, res)
  }
}