import { useState } from "react";
import { FileText, UploadCloud, CheckCircle2, Loader2, FileImage, FileSearch } from "lucide-react";

export default function UploadZone({ onFile, currentDoc, status, uploading, isDark }) {
  const [drag, setDrag] = useState(false);
  const d = isDark;

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        className={`group relative flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed
          p-8 text-center transition-all duration-500 overflow-hidden
          ${drag
            ? (d ? "border-indigo-400 bg-indigo-500/10 scale-[1.02]"
                 : "border-orange-400 bg-orange-50 scale-[1.02]")
            : (d ? "border-slate-600/40 hover:border-indigo-500/50 hover:bg-indigo-500/5"
                 : "border-stone-300/80 hover:border-orange-400/60 hover:bg-orange-50/40")}
          ${uploading ? "pointer-events-none" : ""}`}
      >
        {/* Background orbs */}
        <div className={`pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0
          ${d ? "bg-indigo-600/10" : "bg-orange-400/10"}`} />
        <div className={`pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0
          ${d ? "bg-cyan-500/10" : "bg-teal-400/10"}`} />

        {uploading ? (
          <div className="relative">
            <Loader2 className={`animate-spin ${d ? "text-indigo-400" : "text-orange-500"}`} size={36} />
            <div className="absolute inset-0 animate-ping opacity-20">
              <Loader2 className={d ? "text-indigo-400" : "text-orange-500"} size={36} />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110
              ${d ? "bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/20 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                   : "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200/60 group-hover:shadow-[0_4px_20px_rgba(234,88,12,0.12)]"}`}>
              <UploadCloud className={`transition-transform duration-300 group-hover:-translate-y-0.5
                ${d ? "text-indigo-400" : "text-orange-500"}`} size={28} />
            </div>
          </div>
        )}

        <div>
          <span className={`text-sm font-semibold ${d ? "text-slate-300" : "text-stone-700"}`}>
            {uploading ? "Extracting & indexing…" : "Drop a document or click to browse"}
          </span>
          <div className={`mt-2 flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest ${d ? "text-slate-500" : "text-stone-400"}`}>
            <span className="flex items-center gap-1"><FileText size={10} /> PDF</span>
            <span className={d ? "text-slate-700" : "text-stone-300"}>•</span>
            <span className="flex items-center gap-1"><FileImage size={10} /> Image</span>
            <span className={d ? "text-slate-700" : "text-stone-300"}>•</span>
            <span className="flex items-center gap-1"><FileSearch size={10} /> Scan</span>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
          onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
        />

        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl">
            <div className="h-full animate-shimmer" style={{ width: '200%' }} />
          </div>
        )}
      </label>

      {currentDoc && (
        <div className={`mt-3 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm animate-scale-in border
          ${d ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
               : "bg-teal-50 border-teal-200/60 text-teal-700"}`}>
          <CheckCircle2 size={16} className={d ? "text-emerald-400" : "text-teal-500"} />
          <span className="truncate font-medium">{currentDoc}</span>
        </div>
      )}
      {status && !uploading && (
        <p className={`mt-2 text-xs text-center ${d ? "text-slate-500" : "text-stone-500"}`}>{status}</p>
      )}
    </div>
  );
}
