import { GoogleGenAI } from "@google/genai";

export async function generateCaption({prompt}) {
  const { GEMINI_API_KEY, GEMINI_MODEL } = process.env;

  if (!GEMINI_API_KEY || !GEMINI_MODEL) {
    throw new Error("GEMINI_API_KEY and GEMINI_MODEL must be set");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const interaction = await ai.interactions.create({
    model: GEMINI_MODEL,
    input: `${prompt}`,
  });

  const suggestion = interaction.output_text?.trim();

  if (!suggestion) {
    throw new Error("Gemini returned an empty caption");
  }

  return suggestion;
}
