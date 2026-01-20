
import { GoogleGenAI, GenerateContentResponse, Type, Modality, LiveServerMessage } from "@google/genai";
import { GroundingSource } from "../types";

const MODELS = {
  CHAT_PRO: "gemini-3-pro-preview",
  FAST_FLASH: "gemini-3-flash-preview",
};

const SYSTEM_INSTRUCTION = `
You are the Nexlyn AI Master Architect. Expertise: MikroTik hardware, RouterOS v7, global distribution, and high-density networking.
You assist customers with technical specifications, deployment advice, and regional availability.
Maintain a premium, helpful, and professional persona.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Search Grounding for Latest Tech Data - Efficient & Powerful
  async searchTech(prompt: string): Promise<{ text: string; sources: GroundingSource[] }> {
    const response = await this.ai.models.generateContent({
      model: MODELS.FAST_FLASH,
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(c => c.web)
      .map(c => ({ title: c.web?.title || "Source", uri: c.web?.uri || "" })) || [];
      
    return { text: response.text || "Connection stable, awaiting next transmission.", sources };
  }
}

export const gemini = new GeminiService();
