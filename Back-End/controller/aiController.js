import { generateCaption } from "../services/geminiService.js";

export const generateCaptionSuggestion = async (req, res) => {
  const { prompt } = req.body ?? {};

  if (
    typeof prompt !== "string" ||
    !prompt.trim()
  ) {
    return res.status(400).json({
      message: "Prompt is required.",
    });
  }

  console.log({prompt})

  try {
    const suggestion = await generateCaption({prompt});
    return res.status(200).json({ suggestion });
  } catch (error) {
    console.error("Caption generation failed:", error);
    return res.status(500).json({ message: "Unable to generate a caption." });
  }
};