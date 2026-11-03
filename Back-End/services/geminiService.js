import { GoogleGenAI } from "@google/genai";

export async function generateCaption({ prompt } = {}) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    const error = new Error("Prompt is missing");
    error.status = 400;
    throw error;
  }

  const { GEMINI_API_KEY } = process.env;
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  if (!GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY must be set");
    error.status = 500; // was 401
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const suggestion = response.text?.trim();


  // Stop here if Gemini sent no text
  if (!suggestion) {
    const error = new Error("Gemini returned an empty answer");
    error.status = 502;
    throw error;
  }

  return suggestion;
}