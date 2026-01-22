
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { GroundingSource } from "../types";

const MODELS = {
  CHAT_PRO: "gemini-3-pro-preview",
  FAST_FLASH: "gemini-3-flash-preview",
};

const SYSTEM_INSTRUCTION = `
You are the Nexlyn AI Master Architect ("Grid Expert"). 
Your Expertise: 
1. MikroTik® Hardware (CCR, CRS, hAP, Chateau, etc.)
2. RouterOS v7 configurations (BGP, OSPF, MPLS, WireGuard, Container support)
3. Global Distribution Logistics (MENA region, Dubai hub, export compliance)
4. ISP & Enterprise Network Design.

Your Persona: 
Professional, engineering-focused, concise, and highly knowledgeable. 
You assist B2B customers with technical specs and deployment planning. 
Always recommend official MikroTik® documentation for complex CLI tasks.
If a user asks about pricing, direct them to use the "B2B Quote" or WhatsApp buttons.
`;

export class GeminiService {
  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.');
    }
    return new GoogleGenAI({ apiKey });
  }

  async *streamTech(prompt: string) {
    try {
      const ai = this.getAI();
      const responseStream = await ai.models.generateContentStream({
        model: MODELS.FAST_FLASH,
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        yield {
          text: c.text || "",
          sources: c.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.filter(chunk => chunk.web)
            .map(chunk => ({ 
              title: chunk.web?.title || "Source", 
              uri: chunk.web?.uri || "" 
            })) || []
        };
      }
    } catch (error) {
      console.error('Error in streamTech:', error);
      yield {
        text: 'I apologize, but I encountered an error processing your request. Please ensure your API key is configured correctly.',
        sources: []
      };
    }
  }

  // Fallback for non-streaming needs
  async searchTech(prompt: string): Promise<{ text: string; sources: GroundingSource[] }> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
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
    } catch (error) {
      console.error('Error in searchTech:', error);
      return { 
        text: 'I apologize, but I encountered an error processing your request. Please ensure your API key is configured correctly.', 
        sources: [] 
      };
    }
  }
}

export const gemini = new GeminiService();
