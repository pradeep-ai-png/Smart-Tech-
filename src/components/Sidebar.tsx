import React from "react";
import { Plus, MessageSquare, Trash2, X, Clock, Sparkles } from "lucide-react";
import { ChatSession } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="chat-history-sidebar"
        aria-label="Chat History"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:hidden"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Chat History</h2>
              <p className="text-[11px] text-slate-400">Past conversations</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg md:hidden"
              title="Close history"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Chat Action Button */}
        <div className="p-3">
          <button
            id="new-chat-btn"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/15 transition-all"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 no-scrollbar">
          {sessions.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-500 text-xs">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-medium text-slate-400">No chat history yet</p>
              <p className="text-[11px] mt-1 text-slate-500">
                Start typing or speaking to save conversations.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const dateStr = new Date(session.createdAt).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });
              const timeStr = new Date(session.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer border transition-all ${
                    isActive
                      ? "bg-slate-800/90 text-amber-300 border-amber-500/40 shadow-sm"
                      : "bg-slate-900/60 hover:bg-slate-800/60 text-slate-300 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-2.5 overflow-hidden flex-1 mr-2">
                    <MessageSquare
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-400"
                      }`}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate text-slate-200 group-hover:text-white">
                        {session.title || "Untitled conversation"}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        {dateStr} • {timeStr} ({session.messages.length} msgs)
                      </span>
                    </div>
                  </div>

                  {/* Delete session button */}
                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all flex-shrink-0"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300">Smart Tech AI</span>
          </div>

          {sessions.length > 1 && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
