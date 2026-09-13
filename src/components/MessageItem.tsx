import React, { useState } from "react";
import { Play, Square, Loader2, Copy, Check, User } from "lucide-react";
import { ChatMessage } from "../types";
import { SmartTechLogo } from "./SmartTechLogo";

interface MessageItemProps {
  message: ChatMessage;
  isPlayingThis: boolean;
  onPlayVoice: (message: ChatMessage) => void;
  onStopVoice: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isPlayingThis,
  onPlayVoice,
  onStopVoice,
}) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to highlight "Pradeep Shaw" if present in assistant text
  const renderFormattedText = (text: string) => {
    if (!isAssistant || !text.includes("Pradeep Shaw")) {
      return text;
    }

    const parts = text.split(/(Pradeep Shaw)/gi);
    return (
      <>
        {parts.map((part, index) => {
          if (part.toLowerCase() === "pradeep shaw") {
            return (
              <span
                key={index}
                className="font-semibold text-amber-300 bg-amber-950/70 border border-amber-600/50 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 mx-0.5 shadow-sm"
              >
                👑 {part}
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} mb-4 transition-all`}
    >
      <div
        className={`flex items-end gap-2.5 max-w-[90%] sm:max-w-[82%] ${
          isAssistant ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* Avatar */}
        {isAssistant ? (
          <div className="flex-shrink-0 mb-1">
            <SmartTechLogo size="sm" isSpeaking={isPlayingThis} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md bg-slate-700 text-slate-200 mb-1">
            <User className="w-4 h-4 text-slate-200" />
          </div>
        )}

        {/* Message Bubble Container */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all ${
            isAssistant
              ? "bg-slate-800/95 text-slate-100 border border-slate-700/80 rounded-bl-sm"
              : "bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-sm shadow-amber-900/20"
          }`}
        >
          {/* Header metadata inside assistant card */}
          {isAssistant && (
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-700/50 text-[11px] text-slate-400">
              <span className="font-semibold text-amber-400">Smart Tech AI</span>
              <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          )}

          {/* Message Text */}
          <div className="whitespace-pre-wrap leading-6">
            {renderFormattedText(message.text)}
          </div>

          {/* Audio Action Footer for Assistant */}
          {isAssistant && (
            <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {isPlayingThis ? (
                  <button
                    onClick={onStopVoice}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors font-medium"
                    title="Stop audio playback"
                  >
                    <Square className="w-3 h-3 fill-rose-300" />
                    <span>Stop</span>
                    <span className="flex gap-0.5 ml-1">
                      <span className="w-1 h-3 bg-rose-400 animate-pulse rounded-full" />
                      <span className="w-1 h-3 bg-rose-400 animate-pulse delay-75 rounded-full" />
                      <span className="w-1 h-3 bg-rose-400 animate-pulse delay-150 rounded-full" />
                    </span>
                  </button>
                ) : message.isAudioLoading ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/60 text-amber-300 border border-slate-600 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Loading Voice...</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onPlayVoice(message)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 transition-colors font-medium"
                    title="Speak message aloud in voice"
                  >
                    <Play className="w-3 h-3 fill-amber-300" />
                    <span>Speak Voice</span>
                  </button>
                )}
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                title="Copy text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
