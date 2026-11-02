import mongoose from "mongoose"
import User from "../models/userModel.js"

const ROLES = ["user", "admin"]
const PLANS = ["free", "starter", "pro", "business"]
const STATUSES = ["active", "inactive"]
const SORTS = ["createdAt", "-createdAt", "lastLoginAt", "-lastLoginAt", "email", "-email"]
const MAX_SEARCH_LENGTH = 100

// The only fields an admin may read (the password is never included).
// "fullName" is listed so it is picked up automatically once you add it to the model.
const USER_FIELDS = "fullName email role plan isActive isEmailVerified lastLoginAt createdAt"

// ---------- Helpers ----------

// Turn a database user into the shape the Manage Users page expects
const toAdminUser = (user) => ({
  _id: user._id,
  name: user.fullName?.trim() || user.email.split("@")[0],   // no name field yet, so use the start of the email
  email: user.email,
  role: user.role,
  plan: user.plan,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
})

// Make the search text safe: "." or "(" must be treated as plain characters
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// How many OTHER admins are still active
const countOtherActiveAdmins = (excludeId) =>
  User.countDocuments({ role: "admin", isActive: true, _id: { $ne: excludeId } })

// One place that turns errors into clean responses
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

// ---------- GET /api/admin/users ----------
// ?search=  ?role=  ?plan=  ?status=active|inactive  ?sort=  ?page=  ?limit=
export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50)
    const sort = SORTS.includes(req.query.sort) ? req.query.sort : "-createdAt"
    const { role, plan, status } = req.query
    const search = String(req.query.search || "").trim()

    const filter = {}

    if (role) {
      if (!ROLES.includes(role)) {
        return res.status(400).json({ message: "Invalid role..." })
      }
      filter.role = role
    }

    if (plan) {
      if (!PLANS.includes(plan)) {
        return res.status(400).json({ message: "Invalid plan..." })
      }
      filter.plan = plan
    }

    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status..." })
      }
      filter.isActive = status === "active"
    }

    if (search) {
      if (search.length > MAX_SEARCH_LENGTH) {
        return res.status(400).json({ message: "Search text is too long..." })
      }
      // The name shown on the page comes from the email, so searching the email covers both
      filter.email = new RegExp(escapeRegex(search), "i")
    }

    // "-createdAt" becomes field "createdAt" and direction -1.
    // _id is added as a tie-breaker so pages never repeat or skip a user.
    const sortField = sort.replace("-", "")
    const sortOrder = sort.startsWith("-") ? -1 : 1

    const [users, total, totalUsers] = await Promise.all([
      User.find(filter)
        .sort({ [sortField]: sortOrder, _id: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(USER_FIELDS)
        .lean(),
      User.countDocuments(filter),   // users matching the filters
      User.countDocuments({}),       // all users, for "Showing X of Y"
    ])

    res.status(200).json({
      users: users.map(toAdminUser),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      totalUsers,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// ---------- PATCH /api/admin/users/:id/role ----------
// body: { "role": "user" | "admin" }
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const role = req.body?.role

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Role must be user or admin..." })
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "User not found..." })
    }
    if (String(req.user._id) === id) {
      return res.status(400).json({ message: "You cannot change your own role..." })
    }

    const target = await User.findById(id).select(USER_FIELDS).lean()
    if (!target) {
      return res.status(404).json({ message: "User not found..." })
    }

    // Nothing to change
    if (target.role === role) {
      return res.status(200).json({ user: toAdminUser(target) })
    }

    // Safety net: the system must always keep an active admin
    if (target.role === "admin" && role === "user") {
      const others = await countOtherActiveAdmins(target._id)
      if (others === 0) {
        return res.status(400).json({ message: "At least one active admin is required..." })
      }
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { role } },
      { returnDocument: "after", runValidators: true }
    )
      .select(USER_FIELDS)
      .lean()

    if (!updated) {
      return res.status(404).json({ message: "User not found..." })
    }

    console.log(`[admin] ${req.user.email} changed the role of ${updated.email}: ${target.role} -> ${role}`)
    res.status(200).json({ user: toAdminUser(updated) })
  } catch (error) {
    handleError(error, res)
  }
}

// ---------- PATCH /api/admin/users/:id/status ----------
// body: { "isActive": true | false }
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const isActive = req.body?.isActive

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false..." })
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "User not found..." })
    }
    if (String(req.user._id) === id) {
      return res.status(400).json({ message: "You cannot change your own status..." })
    }

    const target = await User.findById(id).select(USER_FIELDS).lean()
    if (!target) {
      return res.status(404).json({ message: "User not found..." })
    }

    // Nothing to change
    if (target.isActive === isActive) {
      return res.status(200).json({ user: toAdminUser(target) })
    }

    // Safety net: do not switch off the last active admin
    if (!isActive && target.role === "admin") {
      const others = await countOtherActiveAdmins(target._id)
      if (others === 0) {
        return res.status(400).json({ message: "At least one active admin is required..." })
      }
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { returnDocument: "after", runValidators: true }
    )
      .select(USER_FIELDS)
      .lean()

    if (!updated) {
      return res.status(404).json({ message: "User not found..." })
    }

    console.log(`[admin] ${req.user.email} ${isActive ? "activated" : "deactivated"} ${updated.email}`)
    res.status(200).json({ user: toAdminUser(updated) })
  } catch (error) {
    handleError(error, res)
  }
}