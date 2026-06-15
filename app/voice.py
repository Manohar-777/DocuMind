import uuid
from pathlib import Path

from faster_whisper import WhisperModel
from gtts import gTTS

_model = WhisperModel("small", device="cpu", compute_type="int8")
AUDIO_OUT = Path("audio_out")
AUDIO_OUT.mkdir(exist_ok=True)


def transcribe(audio_path: str) -> tuple[str, str]:
    """Returns (text, language_code)."""
    segments, info = _model.transcribe(audio_path)
    text = " ".join(seg.text for seg in segments).strip()
    return text, info.language


def speak(text: str, lang: str = "te") -> str:
    """Telugu='te', English='en'. Returns path to an mp3."""
    out = AUDIO_OUT / f"{uuid.uuid4().hex}.mp3"
    gTTS(text=text, lang="te" if lang.startswith("te") else "en").save(str(out))
    return str(out)
