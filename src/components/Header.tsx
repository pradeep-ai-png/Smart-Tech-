import React from "react";
import { Volume2, VolumeX, Menu, Plus } from "lucide-react";
import { VoiceName, VoiceOption } from "../types";
import { SmartTechLogo } from "./SmartTechLogo";

interface HeaderProps {
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  selectedVoice: VoiceName;
  onSelectVoice: (voice: VoiceName) => void;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const VOICES: VoiceOption[] = [
  { name: "Kore", label: "Kore", gender: "Female", description: "Warm & natural" },
  { name: "Puck", label: "Puck", gender: "Male", description: "Energetic & youthful" },
  { name: "Zephyr", label: "Zephyr", gender: "Female", description: "Clear & polite" },
  { name: "Fenrir", label: "Fenrir", gender: "Male", description: "Deep & confident" },
  { name: "Charon", label: "Charon", gender: "Male", description: "Calm & steady" },
];

export const Header: React.FC<HeaderProps> = ({
  autoSpeak,
  onToggleAutoSpeak,
  selectedVoice,
  onSelectVoice,
  onToggleSidebar,
  onNewChat,
  isSpeaking,
  onStopSpeaking,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 px-3 sm:px-5 py-2.5 transition-all"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Sidebar Toggle & Smart Tech Branding */}
        <div className="flex items-center gap-2.5">
          {/* Chat History Drawer Toggle Button */}
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all flex items-center gap-1.5"
            title="Chat History"
            aria-label="Toggle chat history"
          >
            <Menu className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline text-xs font-medium text-slate-200">History</span>
          </button>

          {/* New Chat quick button */}
          <button
            id="quick-new-chat-btn"
            onClick={onNewChat}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all sm:hidden"
            title="New Chat"
          >
            <Plus className="w-4 h-4 text-amber-400" />
          </button>

          {/* Smart Tech Emblem & Title */}
          <div className="flex items-center gap-2.5">
            <SmartTechLogo size="sm" isSpeaking={isSpeaking} />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Smart Tech
                <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-950/80 border border-amber-600/50 px-1.5 py-0.2 rounded">
                  AI
                </span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Computer Education Assistant
              </span>
            </div>
          </div>
        </div>

        {/* Right: Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Active Speaking Indicator with Stop Button */}
          {isSpeaking && (
            <button
              id="stop-speaking-btn"
              onClick={onStopSpeaking}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg hover:bg-rose-500/30 transition-colors animate-pulse"
              title="Stop voice speech"
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              <span className="hidden xs:inline">Stop Voice</span>
            </button>
          )}

          {/* Voice Selector */}
          <div className="hidden sm:flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400 mr-1.5">Voice:</span>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => onSelectVoice(e.target.value as VoiceName)}
              className="bg-transparent text-xs font-medium text-slate-200 outline-none cursor-pointer pr-1"
            >
              {VOICES.map((v) => (
                <option key={v.name} value={v.name} className="bg-slate-800 text-slate-100">
                  {v.label} ({v.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Speak Toggle */}
          <button
            id="toggle-autospeak-btn"
            onClick={onToggleAutoSpeak}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              autoSpeak
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}
            title={autoSpeak ? "Voice Speech ON (Speaks responses aloud)" : "Voice Speech OFF"}
          >
            {autoSpeak ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Auto-Voice: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Auto-Voice: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
