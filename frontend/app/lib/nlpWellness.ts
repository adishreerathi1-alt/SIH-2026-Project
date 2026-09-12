import { pickMood, type NlpReading, type SimpleMood } from "./scanTypes";

const CRISIS = [
  "suicide",
  "kill myself",
  "end it",
  "want to die",
  "self harm",
  "self-harm",
  "no reason to live",
];

const DISTRESS = [
  "stress",
  "stressed",
  "panic",
  "panicking",
  "overwhelmed",
  "breakdown",
  "hurt",
  "angry",
  "rage",
  "hopeless",
  "helpless",
  "crying",
  "can't cope",
  "cannot cope",
  "pareshan",
  "dukhi",
  "dard",
];

const ANXIETY = [
  "anxious",
  "anxiety",
  "worried",
  "worry",
  "nervous",
  "scared",
  "fear",
  "restless",
  "on edge",
  "tension",
  "tense",
  "tight",
  "ghabrahat",
  "dar",
];

const FATIGUE = [
  "tired",
  "exhausted",
  "sleepy",
  "drained",
  "fatigue",
  "worn out",
  "no energy",
  "burnout",
  "burnt out",
  "thak",
  "thaka",
  "neend",
];

const POSITIVE = [
  "good",
  "fine",
  "okay",
  "ok",
  "calm",
  "ready",
  "steady",
  "better",
  "grateful",
  "hopeful",
  "strong",
  "achha",
  "theek",
  "shant",
];

function countHits(text: string, terms: string[]) {
  let n = 0;
  const hits: string[] = [];
  for (const term of terms) {
    if (text.includes(term)) {
      n += 1;
      hits.push(term);
    }
  }
  return { n, hits };
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** On-device lexicon NLP. Never sends text off the device. */
export function analyzeJournalText(raw: string): NlpReading {
  const text = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").filter(Boolean) : [];
  if (!words.length) {
    return {
      mood: "Calm",
      distress: 0,
      fatigue: 0,
      anxiety: 0,
      positivity: 0,
      crisisFlag: false,
      wordCount: 0,
      cues: [],
    };
  }

  const crisis = countHits(text, CRISIS);
  const distress = countHits(text, DISTRESS);
  const anxiety = countHits(text, ANXIETY);
  const fatigue = countHits(text, FATIGUE);
  const positive = countHits(text, POSITIVE);

  const scale = Math.max(3, Math.min(12, words.length));
  const distressScore = clamp01(distress.n / 3 + (crisis.n ? 0.55 : 0));
  const anxietyScore = clamp01(anxiety.n / 3);
  const fatigueScore = clamp01(fatigue.n / 3);
  const positivityScore = clamp01(positive.n / 3 - distressScore * 0.2);

  const scores: Record<SimpleMood, number> = {
    Stressed: distressScore * 1.2 + anxietyScore * 0.4,
    Tense: anxietyScore * 1.1 + distressScore * 0.25,
    Tired: fatigueScore * 1.15,
    Positive: positivityScore * 1.1,
    Calm: Math.max(0, 0.45 - distressScore - anxietyScore + positivityScore * 0.3 + 0.8 / scale),
  };

  const cues = [...crisis.hits, ...distress.hits, ...anxiety.hits, ...fatigue.hits, ...positive.hits]
    .filter((item, i, arr) => arr.indexOf(item) === i)
    .slice(0, 4);

  return {
    mood: pickMood(scores),
    distress: distressScore,
    fatigue: fatigueScore,
    anxiety: anxietyScore,
    positivity: positivityScore,
    crisisFlag: crisis.n > 0,
    wordCount: words.length,
    cues,
  };
}
