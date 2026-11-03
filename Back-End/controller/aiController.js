import { generateCaption } from "../services/geminiService.js";

function withTimeout(promise, ms) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("AI request timed out")), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export const generateCaptionSuggestion = async (req, res) => {
  const { prompt } = req.body ?? {};

  const requestReceivedAt = Date.now();
  console.log("AI request received", requestReceivedAt); // TEMP timing log, remove later
  console.log(
    "Prompt length:",
    typeof prompt === "string" ? prompt.length : 0
  ); // TEMP timing log, remove later

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  if (prompt.length > 2000) {
    return res
      .status(400)
      .json({ message: "Prompt must be 2000 characters or fewer" });
  }

  try {
    const geminiStartedAt = Date.now();
    console.log("Calling Gemini", geminiStartedAt); // TEMP timing log, remove later
    const suggestion = await withTimeout(
      generateCaption({ prompt: prompt.trim() }),
      30000
    );
    console.log(
      "Gemini answered in",
      Date.now() - geminiStartedAt,
      "ms"
    ); // TEMP timing log, remove later
    return res.status(200).json({ suggestion });
  } catch (error) {
    if (error instanceof Error && error.message === "AI request timed out") {
      return res
        .status(504)
        .json({ message: "The AI took too long. Please try again." });
    }

    console.error(error);
    return res
      .status(500)
      .json({ message: "AI request failed. Please try again." });
  }
};
