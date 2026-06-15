import { useEffect, useRef, useState } from "react";
import { AlertCircle, Mic, Send, Square, Sparkles, Brain, Languages, Search, FileJson, FileText } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { useRecorder } from "../hooks/useRecorder";

export default function ChatPanel({ messages, busy, error, disabled, onAsk, onVoice, language, isDark }) {
  const [text, setText] = useState("");
  const endRef = useRef(null);
  const { recording, start, stop } = useRecorder();
  const d = isDark;

  const QUICK_ACTIONS = [
    { label: "Summarize", icon: FileText, query: "Summarize this document in 5-7 bullet points.",
      dark: "from-indigo-600/20 to-purple-600/20 border-indigo-500/20 text-indigo-300 hover:border-indigo-500/40",
      light: "from-amber-50 to-orange-50 border-amber-300/40 text-amber-700 hover:border-amber-400 hover:shadow-md" },
    { label: "Extract Fields", icon: FileJson, query: "Extract all key fields (names, dates, amounts, IDs) as JSON.",
      dark: "from-cyan-600/20 to-teal-600/20 border-cyan-500/20 text-cyan-300 hover:border-cyan-500/40",
      light: "from-teal-50 to-emerald-50 border-teal-300/40 text-teal-700 hover:border-teal-400 hover:shadow-md" },
    { label: "Search", icon: Search, query: "", isSearch: true,
      dark: "from-emerald-600/20 to-green-600/20 border-emerald-500/20 text-emerald-300 hover:border-emerald-500/40",
      light: "from-rose-50 to-pink-50 border-rose-300/40 text-rose-700 hover:border-rose-400 hover:shadow-md" },
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function send() {
    if (!text.trim() || disabled) return;
    onAsk(text.trim());
    setText("");
  }

  function handleQuickAction(action) {
    if (action.isSearch) {
      setText("Search: ");
      return;
    }
    onAsk(action.query);
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Messages area */}
      <div className="flex-1 space-y-5 overflow-y-auto p-6 themed-grid">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center animate-fade-in-up">
            {/* Animated brain icon */}
            <div className="relative">
              <div className={`flex h-20 w-20 items-center justify-center rounded-3xl border animate-float
                ${d ? "bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-cyan-500/10 border-indigo-500/15"
                     : "bg-gradient-to-br from-amber-100/80 via-orange-100/60 to-rose-100/40 border-orange-200/40 shadow-[0_8px_30px_rgba(234,88,12,0.08)]"}`}>
                <Brain className={d ? "text-indigo-400" : "text-orange-500"} size={36} />
              </div>
              <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full blur-[1px] animate-float-delay
                ${d ? "bg-cyan-400/60" : "bg-amber-400/60"}`} />
              <div className={`absolute -bottom-1 -left-2 h-2 w-2 rounded-full blur-[1px] animate-float
                ${d ? "bg-indigo-400/60" : "bg-rose-400/60"}`} />
            </div>

            <div>
              <p className={`text-lg font-semibold ${d ? "text-slate-300" : "text-stone-700"}`}>
                {disabled ? "Upload a document to begin" : "Ready to analyze your document"}
              </p>
              <p className={`mt-2 text-sm max-w-xs mx-auto leading-relaxed ${d ? "text-slate-500" : "text-stone-500"}`}>
                {disabled
                  ? "Drop a PDF, scanned page, or photo in the sidebar to get started"
                  : "Use a quick action below or type your own question"}
              </p>
            </div>

            {/* Feature pills (no doc) */}
            {disabled && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {[
                  { icon: Sparkles, label: "AI Agent" },
                  { icon: Languages, label: "Telugu + English" },
                  { icon: Mic, label: "Voice Input" },
                ].map((f, i) => (
                  <div key={i} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px]
                    ${d ? "border-slate-700/60 bg-slate-800/40 text-slate-400"
                         : "border-stone-200 bg-white/60 text-stone-500 shadow-sm"}`}>
                    <f.icon size={12} className={d ? "text-indigo-400" : "text-orange-400"} />
                    {f.label}
                  </div>
                ))}
              </div>
            )}

            {/* Quick actions (doc loaded) */}
            {!disabled && (
              <div className="flex flex-wrap justify-center gap-2.5 mt-2">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action)}
                    disabled={busy}
                    className={`group flex items-center gap-2 rounded-xl border bg-gradient-to-br px-4 py-2.5 text-xs font-medium
                      transition-all duration-300 hover:scale-[1.03] disabled:opacity-40
                      ${d ? action.dark : action.light}`}
                  >
                    <action.icon size={14} />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} who={m.who} text={m.text} isDark={d} />
        ))}

        {/* Typing indicator */}
        {busy && (
          <div className="flex items-center gap-3 pl-12 animate-fade-in-up">
            <div className="flex items-center gap-1.5 rounded-full glass-card px-4 py-2">
              <span className={`typing-dot h-1.5 w-1.5 rounded-full ${d ? "bg-cyan-400" : "bg-orange-400"}`} />
              <span className={`typing-dot h-1.5 w-1.5 rounded-full ${d ? "bg-cyan-400" : "bg-orange-400"}`} />
              <span className={`typing-dot h-1.5 w-1.5 rounded-full ${d ? "bg-cyan-400" : "bg-orange-400"}`} />
              <span className={`ml-2 text-[10px] uppercase tracking-wider ${d ? "text-slate-500" : "text-stone-400"}`}>Thinking</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Error */}
      {error && (
        <div className={`mx-6 mb-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm animate-fade-in-up border
          ${d ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
               : "bg-red-50 border-red-200/60 text-red-600"}`}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Separator */}
      <div className="themed-line" />

      {/* Input bar */}
      <div className={`backdrop-blur-xl p-4 ${d ? "bg-[#0d1221]/90" : "bg-white/80"}`}>
        <div className="flex items-center gap-2.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={disabled || busy}
            placeholder={disabled ? "Upload a document first…" : `Ask in ${language === "te" ? "Telugu" : language === "en" ? "English" : "Telugu or English"}…`}
            className={`glow-border flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300
              ${d ? "border-slate-700/60 bg-slate-800/50 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/60 focus:bg-slate-800/80 disabled:bg-slate-900/50 disabled:text-slate-600"
                   : "border-stone-200 bg-white/70 text-stone-800 placeholder:text-stone-400 focus:border-orange-400/60 focus:bg-white disabled:bg-stone-100/50 disabled:text-stone-400"}`}
          />

          {/* Mic */}
          <button
            onClick={() => (recording ? stop() : start(onVoice))}
            disabled={disabled || busy}
            title={recording ? "Stop recording" : "Record voice"}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all duration-300 disabled:opacity-30
              ${recording
                ? (d ? "bg-gradient-to-br from-rose-500 to-rose-600 animate-pulse-ring shadow-[0_0_20px_rgba(251,113,133,0.3)]"
                     : "bg-gradient-to-br from-red-500 to-orange-500 animate-pulse-ring shadow-[0_4px_15px_rgba(234,88,12,0.3)]")
                : (d ? "bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/40 hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.12)]"
                     : "bg-gradient-to-br from-stone-600 to-stone-700 border border-stone-500/30 hover:from-orange-500 hover:to-amber-600 hover:shadow-[0_4px_12px_rgba(234,88,12,0.2)]")}`}
          >
            {recording ? <Square size={14} /> : <Mic size={17} />}
          </button>

          {/* Send */}
          <button
            onClick={send}
            disabled={disabled || busy || !text.trim()}
            className={`flex h-11 items-center gap-2 rounded-xl border px-5 text-sm font-medium text-white transition-all duration-300 disabled:opacity-30 disabled:shadow-none
              ${d ? "bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-500/30 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]"
                   : "bg-gradient-to-r from-orange-500 to-amber-600 border-orange-400/30 hover:from-orange-400 hover:to-amber-500 hover:shadow-[0_4px_20px_rgba(234,88,12,0.25)]"}`}
          >
            <Send size={15} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
