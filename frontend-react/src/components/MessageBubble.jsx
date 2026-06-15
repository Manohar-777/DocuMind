import { Sparkles, User } from "lucide-react";

export default function MessageBubble({ who, text, isDark }) {
  const isUser = who === "You";
  const d = isDark;

  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white
          ${isUser
            ? (d ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 shadow-[0_0_15px_rgba(129,140,248,0.3)]"
                 : "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-[0_4px_12px_rgba(234,88,12,0.25)]")
            : (d ? "bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                 : "bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 shadow-[0_4px_12px_rgba(20,184,166,0.25)]")}`}
      >
        {isUser ? <User size={15} /> : <Sparkles size={15} />}
      </div>

      {/* Bubble */}
      <div className="max-w-[78%]">
        <span className={`mb-1 block text-[10px] font-semibold uppercase tracking-widest
          ${isUser
            ? (d ? "text-right text-indigo-400/70" : "text-right text-amber-600/60")
            : (d ? "text-cyan-400/70" : "text-teal-600/60")}`}>
          {isUser ? "You" : "DocuMind"}
        </span>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? (d ? "rounded-tr-sm bg-gradient-to-br from-indigo-600/90 to-indigo-800/90 text-indigo-50 shadow-lg shadow-indigo-900/20 border border-indigo-500/20"
                   : "rounded-tr-sm bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/15 border border-amber-400/20")
              : (d ? "rounded-tl-sm glass-card text-slate-200 shadow-lg shadow-black/10"
                   : "rounded-tl-sm glass-card text-stone-800 shadow-md")}`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
