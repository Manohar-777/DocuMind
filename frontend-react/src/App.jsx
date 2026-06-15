import { useState, useEffect } from "react";
import {
  Brain, FileText, Sparkles, Cpu, Database, Eye, Mic, Zap,
  Sun, Moon, Globe, FolderOpen, Settings, ChevronDown
} from "lucide-react";
import { askByVoice, askQuestion, uploadFile, listDocuments, checkHealth } from "./api";
import UploadZone from "./components/UploadZone";
import ChatPanel from "./components/ChatPanel";
import DocumentList from "./components/DocumentList";
import SettingsPanel from "./components/SettingsPanel";

const LANGUAGES = [
  { code: "auto", label: "Auto Detect", flag: "🌐" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
];

export default function App() {
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("auto");
  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("dm_api_key") || "");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDocs, setShowDocs] = useState(true);

  const d = darkMode;
  const add = (who, text) => setMessages((m) => [...m, { who, text }]);

  useEffect(() => {
    checkHealth().then(setApiOnline);
    const interval = setInterval(() => checkHealth().then(setApiOnline), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (apiOnline) listDocuments().then(setDocuments).catch(() => {});
  }, [apiOnline]);

  function handleApiKeyChange(key) {
    setApiKey(key);
    localStorage.setItem("dm_api_key", key);
  }

  async function handleFile(file) {
    setUploading(true); setStatus(""); setError("");
    try {
      const res = await uploadFile(file);
      setDocId(res.document_id);
      setDocName(res.filename);
      setStatus("Ready — ask anything about this document.");
      setMessages([]);
      listDocuments().then(setDocuments).catch(() => {});
    } catch { setError("Upload failed. Check the file and that the API is running."); }
    finally { setUploading(false); }
  }

  function handleDocSelect(doc) {
    setDocId(doc.id); setDocName(doc.filename);
    setStatus("Switched to: " + doc.filename); setMessages([]);
  }

  async function handleAsk(question) {
    add("You", question); setBusy(true); setError("");
    try { const res = await askQuestion(docId, question, language); add("DocuMind", res.answer); }
    catch { setError("Couldn't get an answer. Is the backend running?"); }
    finally { setBusy(false); }
  }

  async function handleVoice(blob) {
    add("You", "\uD83C\uDFA4 Voice question"); setBusy(true); setError("");
    try {
      const mp3 = await askByVoice(docId, blob);
      new Audio(URL.createObjectURL(mp3)).play();
      add("DocuMind", "\uD83D\uDD0A Spoken answer played");
    } catch { setError("Voice request failed."); }
    finally { setBusy(false); }
  }

  const currentLang = LANGUAGES.find((l) => l.code === language);
  const techStack = [
    { icon: Cpu, label: "LangGraph" },
    { icon: Eye, label: "Gemini Vision" },
    { icon: Database, label: "pgvector" },
    { icon: Mic, label: "Whisper" },
  ];

  return (
    <div className={`${d ? "theme-dark" : "theme-light"} flex h-screen flex-col transition-colors duration-500
      ${d ? "bg-[#0a0e1a] text-slate-200"
           : "bg-[#fef7f0] text-stone-900"}`}>

      {/* ═══════════ HEADER ═══════════ */}
      <header className={`relative flex items-center gap-3 border-b backdrop-blur-xl px-6 py-3 transition-colors duration-500
        ${d ? "border-indigo-500/10 bg-[#0d1221]/80"
             : "border-orange-200/60 bg-white/90 shadow-sm"}`}>

        <div className="absolute top-0 left-0 right-0 h-[2px] themed-topline" />

        {/* Logo */}
        <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-white
          ${d ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
               : "bg-gradient-to-br from-orange-500 to-rose-500 shadow-[0_4px_15px_rgba(234,88,12,0.3)]"}`}>
          <Brain size={20} />
        </div>

        <div>
          <h1 className="text-lg font-bold leading-none tracking-tight glow-text">DocuMind</h1>
          <p className={`text-[10px] font-semibold tracking-[0.2em] uppercase
            ${d ? "text-indigo-400/70" : "text-orange-600"}`}>
            Agentic Document Intelligence
          </p>
        </div>

        {/* Header controls */}
        <div className="ml-auto flex items-center gap-3">
          {/* Tech badges */}
          <div className="hidden xl:flex items-center gap-1.5">
            {techStack.map((t, i) => (
              <div key={i} className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium transition-colors
                ${d ? "border-slate-700/50 bg-slate-800/30 text-slate-500"
                     : "border-orange-200 bg-orange-50 text-orange-700"}`}>
                <t.icon size={9} className={d ? "text-indigo-400/60" : "text-orange-500"} />
                {t.label}
              </div>
            ))}
          </div>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all
                ${d ? "border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-indigo-500/30"
                     : "border-orange-200 bg-white text-stone-700 hover:border-orange-400 shadow-sm"}`}
            >
              <Globe size={13} className={d ? "text-indigo-400" : "text-orange-500"} />
              <span>{currentLang.flag} {currentLang.label}</span>
              <ChevronDown size={12} className={`transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
            </button>

            {showLangDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangDropdown(false)} />
                <div className={`absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border shadow-xl overflow-hidden animate-fade-in-up
                  ${d ? "border-slate-700/50 bg-[#1a2035]"
                       : "border-orange-200 bg-white shadow-orange-200/40"}`}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setShowLangDropdown(false); }}
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition
                        ${language === lang.code
                          ? (d ? "bg-indigo-600/15 text-indigo-300"
                               : "bg-orange-100 text-orange-800 font-semibold")
                          : (d ? "text-slate-400 hover:bg-slate-800/60"
                               : "text-stone-700 hover:bg-orange-50")}`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!d)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300
              ${d ? "border-slate-700/50 bg-slate-800/40 text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10"
                   : "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm"}`}
            title={d ? "Switch to Warm Sunset" : "Switch to Neural Midnight"}
          >
            {d ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full transition-colors
              ${apiOnline
                ? (d ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                     : "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]")
                : (d ? "bg-rose-500 shadow-[0_0_8px_rgba(251,113,133,0.3)]"
                     : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]")}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider
              ${d ? "text-slate-500" : (apiOnline ? "text-emerald-700" : "text-red-600")}`}>
              {apiOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ═══════════ SIDEBAR ═══════════ */}
        <aside className={`hidden w-80 flex-col gap-4 border-r p-5 md:flex overflow-y-auto transition-colors duration-500
          ${d ? "border-indigo-500/10 bg-[#0d1221]/60 backdrop-blur-sm"
               : "border-orange-200/50 bg-white/80"}`}>

          {/* Upload */}
          <div>
            <h2 className={`mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]
              ${d ? "text-slate-500" : "text-orange-700"}`}>
              <FileText size={12} className={d ? "text-indigo-400/60" : "text-orange-500"} /> Upload
            </h2>
            <UploadZone onFile={handleFile} currentDoc={docName} status={status} uploading={uploading} isDark={d} />
          </div>

          <div className="themed-line" />

          {/* Documents */}
          <div>
            <button onClick={() => setShowDocs(!showDocs)}
              className={`mb-2 flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]
                ${d ? "text-slate-500" : "text-teal-700"}`}>
              <span className="flex items-center gap-2">
                <FolderOpen size={12} className={d ? "text-cyan-400/60" : "text-teal-600"} /> Documents ({documents.length})
              </span>
              <ChevronDown size={12} className={`transition-transform ${showDocs ? "" : "-rotate-90"}`} />
            </button>
            {showDocs && <DocumentList documents={documents} activeDocId={docId} onSelect={handleDocSelect} isDark={d} />}
          </div>

          <div className="themed-line" />

          {/* Settings */}
          <div>
            <button onClick={() => setShowSettings(!showSettings)}
              className={`mb-2 flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]
                ${d ? "text-slate-500" : "text-rose-700"}`}>
              <span className="flex items-center gap-2">
                <Settings size={12} className={d ? "text-amber-400/60" : "text-rose-500"} /> Settings
              </span>
              <ChevronDown size={12} className={`transition-transform ${showSettings ? "" : "-rotate-90"}`} />
            </button>
            {showSettings && <SettingsPanel apiKey={apiKey} onApiKeyChange={handleApiKeyChange} isDark={d} />}
          </div>

          {/* Pipeline card */}
          <div className={`mt-auto rounded-2xl p-5 border transition-colors duration-500
            ${d ? "bg-gradient-to-b from-indigo-600/8 to-transparent border-indigo-500/10"
                 : "bg-gradient-to-b from-orange-50 to-amber-50/50 border-orange-200/60 shadow-sm"}`}>
            <h3 className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-4
              ${d ? "text-indigo-400/80" : "text-orange-700"}`}>
              <Zap size={12} /> Pipeline
            </h3>
            <div className="space-y-3">
              {[
                { step: "01", label: "Upload PDF, scan, or photo", dark: "text-indigo-400", light: "text-orange-600" },
                { step: "02", label: "OCR + Vision extracts text", dark: "text-cyan-400", light: "text-teal-600" },
                { step: "03", label: "Chunk → embed → pgvector", dark: "text-purple-400", light: "text-rose-600" },
                { step: "04", label: "Agent reasons & answers", dark: "text-emerald-400", light: "text-amber-700" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`text-[10px] font-mono font-bold mt-0.5 ${d ? item.dark : item.light}`}>{item.step}</span>
                  <p className={`text-xs leading-relaxed ${d ? "text-slate-400" : "text-stone-700"}`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile upload */}
        <div className={`md:hidden border-b p-4 ${d ? "border-indigo-500/10 bg-[#0d1221]/60" : "border-orange-200/50 bg-white/80"}`}>
          <UploadZone onFile={handleFile} currentDoc={docName} status={status} uploading={uploading} isDark={d} />
        </div>

        {/* ═══════════ CHAT ═══════════ */}
        <main className={`flex flex-1 flex-col transition-colors duration-500
          ${d ? "bg-[#0a0e1a]" : "bg-[#fffbf5]"}`}>
          <ChatPanel
            messages={messages} busy={busy} error={error} disabled={!docId}
            onAsk={handleAsk} onVoice={handleVoice} language={language} isDark={d}
          />
        </main>
      </div>
    </div>
  );
}
