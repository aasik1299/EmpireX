export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string; // Data URL for display
  timestamp: number;
}

export interface ImageData {
  base64: string; // Raw base64 for API
  preview: string; // Data URL for UI
  mimeType: string;
}

export interface UserParams {
  text: string;
  image?: ImageData;
}

// Internal representation for the Gemini Service history
export interface HistoryItem {
  role: Role;
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
}