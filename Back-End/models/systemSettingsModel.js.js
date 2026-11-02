import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    // Always "main", so only one settings document can exist
    key: { type: String, default: "main", unique: true },

    // General
    platformName: { type: String, default: "Socialynk", trim: true },
    supportEmail: { type: String, default: "support@socialynk.io", trim: true, lowercase: true },

    // Registration
    allowNewSignUps: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: true },
    defaultPlan: {
      type: String,
      enum: ["free", "starter", "pro", "business"],
      default: "starter",
    },

    // AI assistant
    enableAiAssistant: { type: Boolean, default: true },
    dailyAiRequests: { type: Number, default: 40, min: 1 },

    // Media
    maxImageUploadSize: { type: Number, default: 10, min: 1 }, // in MB
    allowedImageTypes: {
      jpg: { type: Boolean, default: true },
      png: { type: Boolean, default: true },
      webp: { type: Boolean, default: true },
    },

    // Maintenance
    maintenanceMode: { type: Boolean, default: false },

    // Who changed it last
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Get the settings. If none exist yet, create them with the default values.
systemSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ key: "main" });
  if (!settings) {
    settings = await this.create({ key: "main" });
  }
  return settings;
};

export default mongoose.model("SystemSettings", systemSettingsSchema);