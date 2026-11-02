import SystemSettings from "../models/systemSettingsModel.js.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const planList = ["free", "starter", "pro", "business"];

// Check the values sent by the admin. Returns an object of errors (empty = valid)
function validateSettings(body) {
  const errors = {};

  if (typeof body.platformName !== "string" || !body.platformName.trim()) {
    errors.platformName = "Platform name is required.";
  }

  if (typeof body.supportEmail !== "string" || !emailPattern.test(body.supportEmail.trim())) {
    errors.supportEmail = "Support email must be a valid email.";
  }

  if (!planList.includes(body.defaultPlan)) {
    errors.defaultPlan = "Default plan is not valid.";
  }

  const dailyAiRequests = Number(body.dailyAiRequests);
  if (!Number.isFinite(dailyAiRequests) || dailyAiRequests <= 0) {
    errors.dailyAiRequests = "Daily AI requests must be greater than 0.";
  }

  const maxImageUploadSize = Number(body.maxImageUploadSize);
  if (!Number.isFinite(maxImageUploadSize) || maxImageUploadSize <= 0) {
    errors.maxImageUploadSize = "Image upload size must be greater than 0.";
  } else if (maxImageUploadSize > 25) {
    // The upload middleware has a 25MB hard limit
    errors.maxImageUploadSize = "Image upload size cannot be more than 25 MB.";
  }

  const types = body.allowedImageTypes;
  if (!types || typeof types !== "object") {
    errors.allowedImageTypes = "Allowed image types are required.";
  } else if (!types.jpg && !types.png && !types.webp) {
    errors.allowedImageTypes = "Select at least one image type.";
  }

  const booleanFields = [
    "allowNewSignUps",
    "requireEmailVerification",
    "enableAiAssistant",
    "maintenanceMode",
  ];
  booleanFields.forEach((field) => {
    if (typeof body[field] !== "boolean") {
      errors[field] = "Must be true or false.";
    }
  });

  return errors;
}

// GET /api/admin/settings
export const getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.status(200).json({ settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load settings" });
  }
};

// PUT /api/admin/settings
export const updateSettings = async (req, res) => {
  try {
    const errors = validateSettings(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Please fix the highlighted fields.", errors });
    }

    const settings = await SystemSettings.getSettings();

    // Copy only the allowed fields (never copy req.body directly)
    settings.platformName = req.body.platformName.trim();
    settings.supportEmail = req.body.supportEmail.trim();
    settings.allowNewSignUps = req.body.allowNewSignUps;
    settings.requireEmailVerification = req.body.requireEmailVerification;
    settings.defaultPlan = req.body.defaultPlan;
    settings.enableAiAssistant = req.body.enableAiAssistant;
    settings.dailyAiRequests = Number(req.body.dailyAiRequests);
    settings.maxImageUploadSize = Number(req.body.maxImageUploadSize);
    settings.allowedImageTypes = {
      jpg: Boolean(req.body.allowedImageTypes.jpg),
      png: Boolean(req.body.allowedImageTypes.png),
      webp: Boolean(req.body.allowedImageTypes.webp),
    };
    settings.maintenanceMode = req.body.maintenanceMode;
    settings.updatedBy = req.user.id; // use the same name as in adminUserController.js

    await settings.save();

    res.status(200).json({ message: "Settings saved successfully", settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not save settings" });
  }
};