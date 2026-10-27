import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        contentType: {
        type: String,
        enum: ["social_post", "image", "video", "carousel", "reel"],
        default: "social_post",
        },

        caption: {
        type: String,
        trim: true,
        default: "",
        maxlength: [2200, "Caption cannot exceed 2200 characters"],
        },

        hashtags: {
        type: [String],
        default: [],
        validate: {
            validator: (list) => list.length <= 30,
            message: "You can add up to 30 hashtags",
        },
        },

        platforms: {
        type: [{ type: String, enum: ["instagram", "facebook", "linkedin", "tiktok", "x"] }],
        default: [],
        },

        status: {
        type: String,
        enum: ["draft", "scheduled", "publishing", "published", "failed"],
        default: "draft",
        },

        scheduledAt: { type: Date, default: null },
        publishedAt: { type: Date, default: null },
        publishError: { type:String, default:"" },
        publishAttempts: { type:Number, default:0 },
        usedAI: { type: Boolean, default: false },

        branding: {
        watermark: { type: Boolean, default: false },
        footer: { type: Boolean, default: false },
        },

        platformResults: [
            {
                platform: { type: String },
                status: { type: String, enum: ["success", "failed"] },
                error: { type: String, default: "" },
            },
        ],
    },
    { timestamps: true }  
)

postSchema.index({ owner: 1, status: 1, updatedAt: -1 })
postSchema.index({ status: 1, scheduledAt: 1 })

const Post = mongoose.model("Post", postSchema)

export default Post