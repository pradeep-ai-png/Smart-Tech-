import React from "react";
import { Sparkles, Volume2, Mic } from "lucide-react";

interface VisualizerProps {
  isSpeaking: boolean;
  isThinking: boolean;
  isListening: boolean;
  onStop: () => void;
  onQuickAskOwner: () => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  isSpeaking,
  isThinking,
  isListening,
  onStop,
  onQuickAskOwner,
}) => {
  return (
    <div
      id="voice-visualizer-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-950 border border-slate-700/60 p-5 shadow-xl shadow-black/20 transition-all text-center"
    >
      {/* Background glow when active */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 transition-opacity duration-700 ${
          isSpeaking || isListening ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Animated Avatar Orb */}
        <div className="relative mb-3 flex items-center justify-center">
          {/* Outer ripples when speaking */}
          {isSpeaking && (
            <>
              <div className="absolute w-24 h-24 rounded-full bg-amber-400/20 animate-ping" />
              <div className="absolute w-28 h-28 rounded-full border border-amber-400/40 animate-pulse" />
            </>
          )}

          {/* Glowing pulse ring */}
          <div
            className={`relative w-18 h-18 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isSpeaking
                ? "bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/40 scale-105"
                : isThinking
                ? "bg-gradient-to-tr from-sky-500 to-indigo-500 shadow-sky-500/30 animate-spin"
                : isListening
                ? "bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/40 scale-105 animate-pulse"
                : "bg-gradient-to-tr from-slate-700 to-slate-800 shadow-slate-900/50"
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="w-8 h-8 text-slate-950 animate-bounce" />
            ) : isThinking ? (
              <Sparkles className="w-7 h-7 text-white" />
            ) : isListening ? (
              <Mic className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-7 h-7 text-amber-300" />
            )}
          </div>
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isSpeaking
                ? "bg-amber-400 animate-pulse"
                : isThinking
                ? "bg-sky-400 animate-ping"
                : isListening
                ? "bg-emerald-400 animate-ping"
                : "bg-emerald-400"
            }`}
          />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            {isSpeaking
              ? "Speaking with Gemini TTS Voice..."
              : isThinking
              ? "Generating Response..."
              : isListening
              ? "Listening to your voice..."
              : "Personal AI Ready • Owner: Pradeep Shaw"}
          </h2>
        </div>

        {/* Audio Equalizer Bars when speaking */}
        {isSpeaking ? (
          <div className="flex items-center justify-center gap-1.5 h-6 my-2">
            {[40, 80, 60, 100, 75, 90, 50, 85, 65, 95].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-amber-500 to-yellow-300 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDuration: `${0.3 + (i % 5) * 0.15}s`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 max-w-md mx-auto line-clamp-2">
            Pucho: "Aapka malik kaun hai?" ya bol kar baat karo — AI voice me jawaab dega!
          </p>
        )}

        {/* Quick action trigger */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {isSpeaking ? (
            <button
              onClick={onStop}
              className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-full border border-rose-500/30 transition-colors"
            >
              Mute / Stop Voice
            </button>
          ) : (
            <button
              onClick={onQuickAskOwner}
              className="text-xs px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 transition-colors flex items-center gap-1"
            >
              👑 Ask: "Aapka malik kaun hai?"
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
