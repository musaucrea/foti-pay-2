import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const getTravelAdvice = async (
  query: string, 
  location: string
): Promise<string> => {
  try {
    const ai = getClient();
    const systemPrompt = `
      You are FoTI (Future of Tourism Innovation) Guide, a smart, local African travel companion.
      Your user is currently in ${location}.
      
      Your goal is to provide:
      1. Safe, verified recommendations.
      2. Cultural context (e.g., tipping norms, etiquette).
      3. Safety tips regarding payments (encourage digital over cash).
      
      Keep answers concise (under 100 words), friendly, and practical for a tourist on the go.
      Format with clear bullet points if listing items.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "I'm having trouble connecting to the travel grid. Try again in a moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline or experiencing issues. Please check your connection.";
  }
};