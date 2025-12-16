import { GoogleGenAI, Content } from "@google/genai";
import { MODEL_ID, SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts internal Message history to the format expected by the Gemini API (Content[]).
 */
const formatHistory = (messages: Message[]): Content[] => {
  return messages.map((msg) => {
    const parts: any[] = [];
    
    // Add text part if exists
    if (msg.text) {
      parts.push({ text: msg.text });
    }

    // Add image part if exists (we need to be careful with history images)
    // In a real app, you might want to limit sending heavy base64 history images 
    // repeatedly if the session gets long, but for this demo, we include them 
    // to maintain context of what was looked at.
    if (msg.image) {
        // msg.image is a data URL "data:image/png;base64,..."
        // We need to extract the base64 data and mime type
        const [header, base64Data] = msg.image.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: base64Data
            }
        });
    }

    return {
      role: msg.role,
      parts: parts,
    };
  });
};

export const generateResponse = async (
  currentHistory: Message[],
  newText: string,
  newImageBase64?: string
): Promise<string> => {
  try {
    // 1. Prepare history
    // We do not add the *current* new message to the history array passed to generateContent
    // because we pass the new content in the `contents` parameter of the call, 
    // or we can append it to history and pass the whole chain. 
    // The SDK often expects `contents` to be the *full* conversation for `generateContent` in a stateless way,
    // OR we use chat mode. 
    // Given the multimodal requirement + text restriction on chat.sendMessage, 
    // we will construct the FULL `contents` array including the new message.
    
    const formattedHistory = formatHistory(currentHistory);
    
    // 2. Prepare the new user content
    const newParts: any[] = [];
    if (newImageBase64) {
      // Assume JPEG or PNG based on detection, defaulting to generic image type if unknown,
      // but usually the caller passes valid base64. 
      // For simplicity in this demo, we assume the input component handles mime types or we default to png/jpeg.
      // The prompt logic in App.tsx passes raw base64.
      newParts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Defaulting for the upload
          data: newImageBase64
        }
      });
    }
    if (newText) {
      newParts.push({ text: newText });
    }

    const newContent: Content = {
      role: 'user',
      parts: newParts
    };

    const fullContents = [...formattedHistory, newContent];

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: fullContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: {
            thinkingBudget: 32768, // Max reasoning for complex math
        },
        // We intentionally do NOT set maxOutputTokens to allow full reasoning output
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};