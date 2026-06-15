import { useState } from "react";
import { Key, Eye, EyeOff, Save, Check } from "lucide-react";

export default function SettingsPanel({ apiKey, onApiKeyChange, isDark }) {
  const [key, setKey] = useState(apiKey);
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const d = isDark;

  function handleSave() {
    onApiKeyChange(key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={`rounded-2xl border p-4
      ${d ? "border-indigo-500/10 bg-[#111827]/60" : "border-stone-200/50 bg-white/50 shadow-sm"}`}>
      <h3 className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-3
        ${d ? "text-slate-500" : "text-stone-400"}`}>
        <Key size={12} className={d ? "text-amber-400/60" : "text-rose-400/60"} /> API Key
      </h3>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={show ? "text" : "password"}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter Gemini API key…"
            className={`glow-border w-full rounded-lg border px-3 py-2 pr-9 text-xs outline-none
              ${d ? "border-slate-700/50 bg-slate-800/60 text-slate-300 placeholder:text-slate-600 focus:border-indigo-500/50"
                   : "border-stone-200 bg-white/70 text-stone-700 placeholder:text-stone-400 focus:border-orange-400/50"}`}
          />
          <button
            onClick={() => setShow(!show)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 transition
              ${d ? "text-slate-500 hover:text-slate-300" : "text-stone-400 hover:text-stone-600"}`}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!key.trim()}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300
            ${saved
              ? (d ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                   : "bg-teal-50 text-teal-600 border border-teal-300/40")
              : (d ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 disabled:opacity-30"
                   : "bg-orange-50 text-orange-600 border border-orange-300/40 hover:bg-orange-100 disabled:opacity-30")}`}
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
        </button>
      </div>

      {apiKey && (
        <p className={`mt-2 text-[10px] flex items-center gap-1
          ${d ? "text-emerald-400/70" : "text-teal-600/70"}`}>
          <Check size={10} /> Key configured
        </p>
      )}
    </div>
  );
}
