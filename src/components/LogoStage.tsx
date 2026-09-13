import React from "react";
import { SmartTechLogo } from "./SmartTechLogo";
import { Volume2, Mic, Sparkles } from "lucide-react";

interface LogoStageProps {
  isSpeaking: boolean;
  isThinking: boolean;
  isListening: boolean;
  onStopVoice: () => void;
  onPlayGreetingVoice: () => void;
}

export const LogoStage: React.FC<LogoStageProps> = ({
  isSpeaking,
  isThinking,
  isListening,
  onStopVoice,
  onPlayGreetingVoice,
}) => {
  return (
    <div
      id="smart-tech-stage"
      className="relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/80 shadow-2xl text-center overflow-hidden transition-all"
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none transition-opacity duration-700 ${
          isSpeaking || isListening ? "opacity-100" : "opacity-40"
        }`}
      />

      {/* Prominent Smart Tech Circular Logo Emblem */}
      <div className="relative mb-3 flex items-center justify-center cursor-pointer group" onClick={isSpeaking ? onStopVoice : onPlayGreetingVoice} title={isSpeaking ? "Click to stop voice" : "Click to hear voice introduction"}>
        <SmartTechLogo
          size="lg"
          isSpeaking={isSpeaking}
          isListening={isListening}
          isThinking={isThinking}
        />
      </div>

      {/* Title & Status */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isSpeaking
                ? "bg-amber-400 animate-ping"
                : isListening
                ? "bg-emerald-400 animate-ping"
                : isThinking
                ? "bg-sky-400 animate-ping"
                : "bg-emerald-400"
            }`}
          />
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
            Smart Tech AI
          </h1>
        </div>

        {/* Dynamic Voice Status */}
        {isSpeaking ? (
          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="flex items-center gap-1 text-xs text-amber-300 font-medium">
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span>Speaking response in voice...</span>
            </div>
            {/* Audio Waveform Bars */}
            <div className="flex items-center justify-center gap-1 h-5 my-1">
              {[35, 75, 55, 95, 70, 85, 45, 90, 60, 80].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-amber-500 to-yellow-300 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.3 + (i % 4) * 0.15}s`,
                    animationDelay: `${i * 0.07}s`,
                  }}
                />
              ))}
            </div>
            <button
              onClick={onStopVoice}
              className="mt-1 text-[11px] px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-full border border-rose-500/30 transition-colors"
            >
              Stop Voice
            </button>
          </div>
        ) : isListening ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span>Listening to your voice (Hindi / English)...</span>
          </div>
        ) : isThinking ? (
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium mt-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Smart Tech AI is generating answer...</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 max-w-sm font-normal mt-0.5">
            Aap mujhse koi bhi sawal pooch sakte hain. Voice me sunne ke liye taiyar!
          </p>
        )}
      </div>
    </div>
  );
};
