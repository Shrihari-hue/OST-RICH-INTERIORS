const WELCOME_MESSAGE = "OST-RICH Interiors welcomes you.";
const MAX_WAIT_MS = 2500;

const synth = window.speechSynthesis;

const selectVoice = () => {
  const voices = synth?.getVoices?.() ?? [];

  if (voices.length === 0) {
    return null;
  }

  return (
    voices.find((voice) => voice.lang === "en-IN") ||
    voices.find((voice) => voice.lang.startsWith("en-")) ||
    voices[0]
  );
};

export const waitForWelcome = () =>
  new Promise((resolve) => {
    if (!synth) {
      resolve();
      return;
    }

    let finished = false;
    let hasAttempted = false;
    let timeoutId = null;

    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      removeFallbackListeners();

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      resolve();
    };

    const speakWelcome = () => {
      if (finished || hasAttempted) {
        return;
      }

      hasAttempted = true;

      if (synth.speaking || synth.pending) {
        synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(WELCOME_MESSAGE);
      const voice = selectVoice();

      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.92;
      utterance.pitch = 0.96;
      utterance.volume = 1;
      utterance.onend = finish;
      utterance.onerror = () => {
        hasAttempted = false;
        finish();
      };

      try {
        synth.speak(utterance);
      } catch {
        hasAttempted = false;
        finish();
      }
    };

    const fallbackSpeak = () => {
      window.setTimeout(speakWelcome, 120);
    };

    const removeFallbackListeners = () => {
      window.removeEventListener("pointerdown", fallbackSpeak);
      window.removeEventListener("keydown", fallbackSpeak);
      window.removeEventListener("scroll", fallbackSpeak);
    };

    window.addEventListener("pointerdown", fallbackSpeak, { once: true, passive: true });
    window.addEventListener("keydown", fallbackSpeak, { once: true });
    window.addEventListener("scroll", fallbackSpeak, { once: true, passive: true });

    timeoutId = window.setTimeout(finish, MAX_WAIT_MS);

    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", speakWelcome, { once: true });
    }

    speakWelcome();
  });
