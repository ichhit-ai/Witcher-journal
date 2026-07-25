// Background Ambient Audio Manager for Witcher 3 Soundtrack

const WITCHER_SOUNDTRACK_URL = '/assets/witcher3_soundtrack.mp3';

let audioElement: HTMLAudioElement | null = null;

export function startBgAudio() {
  if (!audioElement) {
    audioElement = new Audio(WITCHER_SOUNDTRACK_URL);
    audioElement.loop = true;
    audioElement.volume = 0.4;
  }
  audioElement.play().catch((err) => {
    console.warn("Background audio play interrupted or restricted by browser:", err);
  });
}

export function stopBgAudio() {
  if (audioElement) {
    audioElement.pause();
  }
}

export function toggleBgAudio(play: boolean) {
  if (play) {
    startBgAudio();
  } else {
    stopBgAudio();
  }
}

export function getCurrentTrackName(): string {
  return 'The Witcher 3: Wild Hunt Official Soundtrack';
}
