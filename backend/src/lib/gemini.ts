import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

let conversationHistory: { role: 'user' | 'model', parts: { text: string }[] }[] = [
  {
    role: "user",
    parts: [
      { text: "You are an AI chatbot named 'Whisp Bot', built into an app called 'Whisp'. Your purpose is to have friendly, helpful conversations with users and assist them inside the app. Keep answers concise unless asked for more detail." }
    ]
  }
];

export async function getGeminiReply(prompt: string): Promise<string> {
  try {
    conversationHistory.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: conversationHistory,
    });

    let reply = (response.text || "Oops, I couldn’t think of a reply.").trim();

    // clean formatting
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, '$1') 
      .replace(/\*(.*?)\*/g, '$1')  
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1') 
      .replace(/^- /gm, '• ');        

    conversationHistory.push({
      role: "model",
      parts: [{ text: reply }]
    });

    return reply;
  } catch (err) {
    console.error("Gemini error:", err);
    return "Hmm, something went wrong while thinking.";
  }
}
