/**
 * Audio playback and speech synthesis utilities
 */

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;

export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Plays base64 WAV/PCM audio using an HTML Audio element for high compatibility
 */
export async function playBase64Audio(
  base64Data: string,
  mimeType: string = "audio/wav",
  onEnded?: () => void,
  onError?: (err: any) => void
): Promise<() => void> {
  stopCurrentAudio();

  try {
    // Decode base64 to Blob
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    currentAudioUrl = url;

    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
        currentAudioUrl = null;
      }
      currentAudio = null;
      onEnded?.();
    };

    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
        currentAudioUrl = null;
      }
      currentAudio = null;
      onError?.(e);
    };

    await audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
        currentAudioUrl = null;
      }
      currentAudio = null;
    };
  } catch (err) {
    console.error("Failed to start audio playback:", err);
    onError?.(err);
    throw err;
  }
}

/**
 * Browser fallback speech synthesis if API is unavailable or offline
 */
export function playFallbackSpeech(
  text: string,
  onEnded?: () => void,
  onError?: (err: any) => void
): () => void {
  stopCurrentAudio();

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError?.(new Error("Speech synthesis is not supported in this browser"));
    return () => {};
  }

  const cleanText = text.replace(/[*_#`~[\]()]/g, " ").trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Try to find a Hindi or Indian English voice if possible
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find((v) => v.lang.startsWith("hi") || v.lang.includes("IN")) ||
    voices.find((v) => v.lang.startsWith("en"));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onend = () => onEnded?.();
  utterance.onerror = (e) => onError?.(e);

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
