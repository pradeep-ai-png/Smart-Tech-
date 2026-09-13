import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, Sparkles, Loader2 } from "lucide-react";

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onListeningChange?: (isListening: boolean) => void;
}

const QUICK_PROMPTS = [
  "Smart Tech ke baare mein batao",
  "Computer courses kya hain?",
  "Tumhe kisne banaya?",
  "Programming kaise seekhein?",
];

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  isLoading,
  onListeningChange,
}) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Recognition support in browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "hi-IN"; // Supports Hindi & Hinglish recognition smoothly

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
        onListeningChange?.(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
        onListeningChange?.(false);
        if (event.error !== "no-speech") {
          setSpeechError("Mic error: " + event.error);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        onListeningChange?.(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onListeningChange]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition not supported in this browser. Please type your message.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      onListeningChange?.(false);
    } else {
      try {
        setSpeechError(null);
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      onListeningChange?.(false);
    }
    const textToSend = inputText.trim();
    setInputText("");
    onSendMessage(textToSend);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-3 sm:p-4 transition-all">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1 bg-slate-800/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700/80 hover:border-amber-500/40 rounded-full transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
              isRecording
                ? "bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title={isRecording ? "Listening... click to stop" : "Speak via microphone (Hindi / English)"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-amber-400" />}
          </button>

          {/* Text input */}
          <div className="relative flex-1">
            <input
              id="message-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isRecording
                  ? "Listening... bolte rahiye (Hindi ya English)..."
                  : "Type or speak: Koi bhi sawal poochhiye..."
              }
              disabled={isLoading}
              className="w-full bg-slate-800/90 border border-slate-700/80 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all pr-10"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Send button */}
          <button
            id="send-message-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 transition-all flex-shrink-0"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        {/* Speech Recognition Error Notice */}
        {speechError && (
          <p className="text-[11px] text-amber-400/90 px-1">{speechError}</p>
        )}
      </div>
    </div>
  );
};
