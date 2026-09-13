export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  audioBase64?: string;
  audioMimeType?: string;
  isAudioLoading?: boolean;
  audioError?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

export type VoiceName = "Kore" | "Puck" | "Zephyr" | "Fenrir" | "Charon";

export interface VoiceOption {
  name: VoiceName;
  label: string;
  gender: "Female" | "Male" | "Neutral";
  description: string;
}

export interface OwnerProfile {
  name: string;
  title: string;
  status: string;
}
