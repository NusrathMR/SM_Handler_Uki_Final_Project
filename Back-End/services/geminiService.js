import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export async function generateCaption({prompt}) {
  const { GEMINI_API_KEY, GEMINI_MODEL } = process.env;

  if (!GEMINI_API_KEY || !GEMINI_MODEL) {
    throw new Error("GEMINI_API_KEY and GEMINI_MODEL must be set");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction:
        "You write social media captions. Keep answers short (under 120 words) unless the user asks for more. Reply with the caption text only, with hashtags at the end when useful.",
      maxOutputTokens: 1024,
    },
  });

  const suggestion = response.text?.trim();

  return suggestion;
}
