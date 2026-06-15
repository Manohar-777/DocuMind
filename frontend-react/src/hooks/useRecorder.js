import { useRef, useState } from "react";

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const recRef = useRef(null);
  const chunksRef = useRef([]);

  async function start(onComplete) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    chunksRef.current = [];
    rec.ondataavailable = (e) => chunksRef.current.push(e.data);
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      onComplete(new Blob(chunksRef.current, { type: "audio/webm" }));
      setRecording(false);
    };
    recRef.current = rec;
    rec.start();
    setRecording(true);
  }

  const stop = () => recRef.current?.stop();
  return { recording, start, stop };
}
