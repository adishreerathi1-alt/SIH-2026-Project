export type SimpleMood =
  | "Calm"
  | "Positive"
  | "Tired"
  | "Tense"
  | "Stressed";

export interface FaceReading {
  mood: SimpleMood;
  confidence: number;
  smile: number;
  tension: number;
  tiredness: number;
  faceFound: boolean;
}

export interface VoiceReading {
  mood: SimpleMood;
  energy: number;
  strain: number;
  pitchHz: number;
  speaking: boolean;
}

export interface NlpReading {
  mood: SimpleMood;
  distress: number;
  fatigue: number;
  anxiety: number;
  positivity: number;
  crisisFlag: boolean;
  wordCount: number;
  cues: string[];
}

export interface CombinedScan {
  overallMood: SimpleMood;
  stressScore: number;
  advice: string;
  face: FaceReading;
  voice: VoiceReading;
  nlp: NlpReading;
  at: string;
}

export const LAST_SCAN_KEY = "rakshak-last-scan";
export const SCAN_HISTORY_KEY = "rakshak-scan-history";

export const EMPTY_FACE: FaceReading = {
  mood: "Calm",
  confidence: 0,
  smile: 0,
  tension: 0,
  tiredness: 0,
  faceFound: false,
};

export const EMPTY_VOICE: VoiceReading = {
  mood: "Calm",
  energy: 0,
  strain: 0,
  pitchHz: 0,
  speaking: false,
};

export const EMPTY_NLP: NlpReading = {
  mood: "Calm",
  distress: 0,
  fatigue: 0,
  anxiety: 0,
  positivity: 0,
  crisisFlag: false,
  wordCount: 0,
  cues: [],
};

export function adviceFor(mood: SimpleMood, stress: number, crisis = false): string {
  if (crisis) {
    return "If you feel unsafe, call 988 now. A counselor is available 24/7. You do not have to handle this alone.";
  }
  if (stress >= 70 || mood === "Stressed") {
    return "Take a short break. Drink water, then do 2 minutes of slow breathing.";
  }
  if (mood === "Tired" || stress >= 55) {
    return "Energy looks low. A 10-minute rest and a snack will help more than pushing on.";
  }
  if (mood === "Tense") {
    return "Shoulders look tight. Drop them, unclench your jaw, and take 5 slow breaths.";
  }
  if (mood === "Positive") {
    return "You look steady. Keep the same rest and water routine.";
  }
  return "You look reasonably calm. Stay hydrated and check in again after the next task.";
}

export function pickMood(scores: Record<SimpleMood, number>): SimpleMood {
  let best: SimpleMood = "Calm";
  let max = -1;
  (Object.keys(scores) as SimpleMood[]).forEach((key) => {
    if (scores[key] > max) {
      max = scores[key];
      best = key;
    }
  });
  return best;
}

export function combineReadings(
  face: FaceReading,
  voice: VoiceReading,
  nlp: NlpReading = EMPTY_NLP
): CombinedScan {
  const faceStress = face.faceFound ? face.tension * 55 + face.tiredness * 25 : 32;
  const voiceStress = voice.strain * 70 + (voice.speaking ? 0 : 6);
  const nlpStress =
    nlp.wordCount > 0
      ? nlp.distress * 55 + nlp.anxiety * 30 + nlp.fatigue * 20 - nlp.positivity * 18
      : 0;
  const hasNlp = nlp.wordCount > 0;
  const stressScore = Math.round(
    Math.min(
      95,
      Math.max(
        8,
        hasNlp
          ? faceStress * 0.38 + voiceStress * 0.32 + nlpStress * 0.3
          : faceStress * 0.58 + voiceStress * 0.42
      )
    )
  );

  const moodVotes: Record<SimpleMood, number> = {
    Calm: 0,
    Positive: 0,
    Tired: 0,
    Tense: 0,
    Stressed: 0,
  };
  moodVotes[face.mood] += face.faceFound ? 1.1 : 0.2;
  moodVotes[voice.mood] += 1;
  if (hasNlp) moodVotes[nlp.mood] += 1.15;
  const overallMood = (Object.keys(moodVotes) as SimpleMood[]).sort(
    (a, b) => moodVotes[b] - moodVotes[a]
  )[0];

  const safeNlp: NlpReading = {
    ...nlp,
    cues: nlp.cues.slice(0, 4),
  };

  return {
    overallMood,
    stressScore,
    advice: adviceFor(overallMood, stressScore, nlp.crisisFlag),
    face,
    voice,
    nlp: safeNlp,
    at: new Date().toISOString(),
  };
}

export function persistScan(scan: CombinedScan) {
  try {
    sessionStorage.setItem(LAST_SCAN_KEY, JSON.stringify(scan));
    const raw = sessionStorage.getItem(SCAN_HISTORY_KEY);
    const history: CombinedScan[] = raw ? JSON.parse(raw) : [];
    history.unshift(scan);
    sessionStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(history.slice(0, 7)));
  } catch {
    /* private storage full or blocked */
  }
}

export function readLastScan(): CombinedScan | null {
  try {
    const raw = sessionStorage.getItem(LAST_SCAN_KEY);
    return raw ? (JSON.parse(raw) as CombinedScan) : null;
  } catch {
    return null;
  }
}

export function readScanHistory(): CombinedScan[] {
  try {
    const raw = sessionStorage.getItem(SCAN_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as CombinedScan[]) : [];
  } catch {
    return [];
  }
}
