const API = import.meta.env.VITE_API_URL;

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${API}/upload`, { method: "POST", body: fd });
  if (!r.ok) throw new Error("Upload failed");
  return r.json();
}

export async function listDocuments() {
  const r = await fetch(`${API}/documents`);
  if (!r.ok) throw new Error("Failed to list documents");
  return r.json(); // [{ id, filename, created_at }]
}

export async function askQuestion(documentId, question, language = "auto") {
  const r = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, question, language }),
  });
  if (!r.ok) throw new Error("Chat failed");
  return r.json();
}

export async function askByVoice(documentId, audioBlob) {
  const fd = new FormData();
  fd.append("document_id", documentId);
  fd.append("audio", audioBlob, "q.webm");
  const r = await fetch(`${API}/voice`, { method: "POST", body: fd });
  if (!r.ok) throw new Error("Voice failed");
  return r.blob();
}

export async function checkHealth() {
  try {
    const r = await fetch(`${API}/health`);
    return r.ok;
  } catch {
    return false;
  }
}
