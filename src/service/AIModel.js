// src/service/AIModel.js

// ─── .env setup ───────────────────────────────────────────────────────────────
// Add to your .env file:
// VITE_GROQ_API_KEY=your_groq_api_key   (from https://console.groq.com/keys)
// Free tier: 30+ requests per SECOND! (Much better than Gemini's 60/minute limit)
// ──────────────────────────────────────────────────────────────────────────────

import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const configuredModel = import.meta.env.VITE_GROQ_MODEL?.trim();
const models = [
  configuredModel,
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
].filter((value, index, list) => value && list.indexOf(value) === index);

if (!apiKey) {
  console.error("❌ VITE_GROQ_API_KEY is not set in .env file");
  console.error("ℹ️ Get your FREE Groq API key from: https://console.groq.com/keys");
  console.error("ℹ️ Then add it to your .env file: VITE_GROQ_API_KEY=your_key_here");
}

const groq = new Groq({
  apiKey: apiKey || "",
  dangerouslyAllowBrowser: true,
});

export const chatSession = {
  generateContent: async (prompt) => {
    let lastError;

    for (const model of models) {
      try {
        const response = await groq.chat.completions.create({
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 8192,
          response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content || "{}";
        return {
          response: {
            text: () => content,
          },
        };
      } catch (error) {
        lastError = error;
        const errorText = `${error?.message || ""}`.toLowerCase();
        const modelUnavailable = error?.status === 404 || errorText.includes("decommissioned") || (errorText.includes("model") && errorText.includes("not found"));
        if (!modelUnavailable) throw error;
        console.warn(`Groq model unavailable: ${model}. Trying the next model.`);
      }
    }

    throw lastError;
  },
};
