/**
 * Real-time sentence-by-sentence Speech Synthesizer
 * 100% Unlimited, Free, Zero-latency browser speech synthesis
 * Speaks lines & sentences in real-time as they stream from the AI!
 */

export interface SpeechQueueCallbacks {
  onStart?: () => void;
  onSentence?: (sentence: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class SpeechQueueManager {
  private queue: string[] = [];
  private isPlaying = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private callbacks: SpeechQueueCallbacks = {};
  private resumeTimer: any = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private processedLength = 0;

  constructor() {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        this.initVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => this.initVoices();
        }
      }
    } catch (err) {
      console.warn("Speech synthesis initialization notice:", err);
    }
  }

  private initVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Prefer Hindi voice or Indian English voice for natural pronunciation
    const hindiVoice = voices.find(
      (v) =>
        v.lang.startsWith("hi") ||
        v.name.toLowerCase().includes("hindi") ||
        v.name.toLowerCase().includes("swara") ||
        v.name.toLowerCase().includes("lekha")
    );

    const indianEngVoice = voices.find(
      (v) =>
        v.lang === "en-IN" ||
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("heera") ||
        v.name.toLowerCase().includes("neerja") ||
        v.name.toLowerCase().includes("prabhat")
    );

    const englishVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("online"))
    );

    this.selectedVoice = hindiVoice || indianEngVoice || englishVoice || voices[0];
  }

  public setCallbacks(cbs: SpeechQueueCallbacks) {
    this.callbacks = cbs;
  }

  /**
   * Reset tracking for a new streaming response
   */
  public resetStream() {
    this.stop();
    this.processedLength = 0;
    this.queue = [];
  }

  /**
   * Cleans text for natural speech reading
   */
  private cleanForSpeech(text: string): string {
    return text
      .replace(/[*_#`~[\]()]/g, " ")
      .replace(/https?:\/\/\S+/g, "link")
      .replace(/[:\-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Called continuously as text streams in.
   * Extracts completed sentences and enqueues them for immediate speech!
   */
  public feedStream(fullText: string, isFinal = false) {
    if (!("speechSynthesis" in window)) return;

    const unprocessed = fullText.slice(this.processedLength);
    if (!unprocessed) return;

    // Sentence break regex: matches . ! ? । or newlines followed by space or end
    // Or commas if a segment is getting too long (> 80 chars)
    const sentenceDelimiters = /([.?!।\n]+)(\s+|$)/g;

    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = sentenceDelimiters.exec(unprocessed)) !== null) {
      const sentenceEnd = match.index + match[1].length;
      const sentence = unprocessed.slice(lastIndex, sentenceEnd).trim();

      if (sentence.length > 1) {
        const cleaned = this.cleanForSpeech(sentence);
        if (cleaned.length > 0) {
          this.enqueue(cleaned);
        }
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex > 0) {
      this.processedLength += lastIndex;
    }

    // If stream is finished, speak whatever remaining text is left
    if (isFinal) {
      const remaining = fullText.slice(this.processedLength).trim();
      if (remaining.length > 0) {
        const cleaned = this.cleanForSpeech(remaining);
        if (cleaned.length > 0) {
          this.enqueue(cleaned);
        }
      }
      this.processedLength = fullText.length;
    }
  }

  /**
   * Add a sentence to the speak queue and start playing if not already
   */
  public enqueue(sentence: string) {
    if (!sentence || !sentence.trim()) return;
    this.queue.push(sentence);
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  /**
   * Speak a standalone full text
   */
  public speakFull(text: string, cbs?: SpeechQueueCallbacks) {
    if (cbs) this.callbacks = cbs;
    this.resetStream();
    this.feedStream(text, true);
  }

  private playNext() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.clearResumeTimer();
      if (this.callbacks.onEnd) {
        this.callbacks.onEnd();
      }
      return;
    }

    const textToSpeak = this.queue.shift()!;
    this.isPlaying = true;

    if (!this.selectedVoice) {
      this.initVoices();
    }

    // Check if text has Devanagari Hindi characters
    const hasHindiChar = /[\u0900-\u097F]/.test(textToSpeak);
    const voices = window.speechSynthesis.getVoices();

    let voiceToUse = this.selectedVoice;
    if (hasHindiChar) {
      const hindiVoice = voices.find(
        (v) => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi")
      );
      if (hindiVoice) voiceToUse = hindiVoice;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (voiceToUse) {
        utterance.voice = voiceToUse;
        utterance.lang = voiceToUse.lang || (hasHindiChar ? "hi-IN" : "en-IN");
      } else {
        utterance.lang = hasHindiChar ? "hi-IN" : "en-IN";
      }

      utterance.rate = 1.05; // natural lively speed
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (this.callbacks.onStart) {
          this.callbacks.onStart();
        }
        if (this.callbacks.onSentence) {
          this.callbacks.onSentence(textToSpeak);
        }
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.playNext();
      };

      utterance.onerror = (e) => {
        // Interrupted errors happen normally when canceled, don't trigger fatal error
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("Speech synthesis notice:", e.error);
        }
        this.currentUtterance = null;
        this.playNext();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      this.startResumeTimer();
    } catch (err) {
      console.warn("Speech playback error:", err);
      this.playNext();
    }
  }

  /**
   * Browser Chrome bug workaround: speechSynthesis can pause after 15 seconds
   */
  private startResumeTimer() {
    this.clearResumeTimer();
    this.resumeTimer = setInterval(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  private clearResumeTimer() {
    if (this.resumeTimer) {
      clearInterval(this.resumeTimer);
      this.resumeTimer = null;
    }
  }

  /**
   * Immediately cancel speech and clear pending queue
   */
  public stop() {
    this.queue = [];
    this.isPlaying = false;
    this.clearResumeTimer();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.currentUtterance = null;
    if (this.callbacks.onEnd) {
      this.callbacks.onEnd();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isPlaying;
  }
}

export const speechQueue = new SpeechQueueManager();
