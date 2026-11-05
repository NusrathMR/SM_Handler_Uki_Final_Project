
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
  vertexai: false,
  httpOptions: {
    timeout: 10000,
  },
});

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite" || Gemini-3.6-Flash;

const TIMEOUT_MS = 10000;

function isTemporaryError(error) {
  const status = Number(error?.status);

  return (
    [408, 429, 500, 502, 503, 504].includes(status) ||
    error?.name === "AbortError" ||
    error?.name === "TimeoutError" ||
    /timeout|temporarily unavailable|overloaded|fetch failed|econnreset/i
      .test(error?.message || "")
  );
}

async function generateWithModel(model, prompt) {
  const start = Date.now();

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
        automaticContinuation: false,
        abortSignal: AbortSignal.timeout(TIMEOUT_MS),
      },
    });

    const result = response.text?.trim();

    if (!result) {
      throw new Error("Gemini returned an empty response");
    }

    console.log(
      `${model} completed in ${Date.now() - start}ms`
    );

    return result;
  } catch (error) {
    console.error(
      `${model} failed after ${Date.now() - start}ms:`,
      error.message
    );

    throw error;
  }
}

export async function generateCaption({ prompt } = {}) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    const error = new Error("Prompt is missing");
    error.status = 400;
    throw error;
  }

  const models = [
    PRIMARY_MODEL,
    ...(FALLBACK_MODEL !== PRIMARY_MODEL
      ? [FALLBACK_MODEL]
      : []),
  ];

  let lastError;

  for (const model of models) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      return await generateWithModel(model, prompt.trim());

    } catch (error) {
      lastError = error;

      if (!isTemporaryError(error)) {
        throw error;
      }

      console.log("Trying backup model...");
    }
  }

  const error = new Error(
    "AI service is busy. Please try again in a moment."
  );

  error.status = 503;
  error.cause = lastError;

  throw error;
}
