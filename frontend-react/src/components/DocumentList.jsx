import { FileText, Clock, ChevronRight } from "lucide-react";

export default function DocumentList({ documents, activeDocId, onSelect, isDark }) {
  const d = isDark;

  if (!documents || documents.length === 0) {
    return (
      <div className={`rounded-2xl border p-4 text-center
        ${d ? "border-slate-700/30 bg-slate-800/20" : "border-stone-200/50 bg-white/30"}`}>
        <p className={`text-xs ${d ? "text-slate-600" : "text-stone-400"}`}>No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
      {documents.map((doc) => {
        const isActive = doc.id === activeDocId;
        const timeAgo = formatTimeAgo(doc.created_at);

        return (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200
              ${isActive
                ? (d ? "bg-indigo-600/15 border border-indigo-500/25 shadow-[0_0_10px_rgba(99,102,241,0.08)]"
                     : "bg-orange-50 border border-orange-300/40 shadow-[0_2px_8px_rgba(234,88,12,0.06)]")
                : (d ? "border border-transparent hover:bg-slate-800/40 hover:border-slate-700/30"
                     : "border border-transparent hover:bg-orange-50/40 hover:border-stone-200/50")}`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition
              ${isActive
                ? (d ? "bg-indigo-600/20 text-indigo-400" : "bg-orange-100 text-orange-600")
                : (d ? "bg-slate-800/60 text-slate-500 group-hover:text-slate-400"
                     : "bg-stone-100/60 text-stone-400 group-hover:text-stone-600")}`}>
              <FileText size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate
                ${isActive
                  ? (d ? "text-indigo-300" : "text-orange-700")
                  : (d ? "text-slate-400" : "text-stone-600")}`}>
                {doc.filename}
              </p>
              <p className={`flex items-center gap-1 text-[10px] mt-0.5 ${d ? "text-slate-600" : "text-stone-400"}`}>
                <Clock size={9} /> {timeAgo}
              </p>
            </div>
            <ChevronRight size={12} className={`shrink-0 transition-transform
              ${isActive
                ? (d ? "text-indigo-400" : "text-orange-500")
                : (d ? "text-slate-700 group-hover:text-slate-500" : "text-stone-300 group-hover:text-stone-500")}
              group-hover:translate-x-0.5`} />
          </button>
        );
      })}
    </div>
  );
}

function formatTimeAgo(isoStr) {
  if (!isoStr) return "";
  try {
    const date = new Date(isoStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  } catch { return ""; }
}
