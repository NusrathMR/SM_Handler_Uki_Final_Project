// The service function has the same name as my controller, so I rename it here
import { generateCaption as generateCaptionFromGemini } from "../services/geminiService.js";

export const generateCaption = async (req, res) => {
  try {
    const { prompt } = req.body ?? {};
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    if (prompt.length > 2000) {
      return res.status(400).json({ message: "Prompt must be 2000 characters or fewer" });
    }

    const caption = await generateCaptionFromGemini({ prompt: prompt.trim() });

    res.status(200).json({ caption });

  } catch (error) {
    console.error("AI error:", error?.status, error?.message);

    if (error.status === 400) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (error.status === 503 || error.status === 429) {
      return res.status(503).json({
        message: "The AI is very busy right now. Please try again in a moment.",
      });
    }

    return res.status(500).json({ message: "AI request failed. Please try again." });
  }
};