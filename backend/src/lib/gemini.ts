import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getGeminiReply(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
    });

    return (response.text || "Oops, I couldn’t think of a reply.").trim();
  } catch (err) {
    console.error("Gemini error:", err);
    return "Hmm, something went wrong while thinking.";
  }
}
