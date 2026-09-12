import { pickMood, type FaceReading, type SimpleMood } from "./scanTypes";

type Category = { categoryName: string; score: number };

function named(categories: Category[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const item of categories) {
    map[item.categoryName] = item.score;
  }
  return map;
}

function avg(map: Record<string, number>, keys: string[]) {
  const values = keys.map((key) => map[key] ?? 0);
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

export function readingFromBlendshapes(categories: Category[]): FaceReading {
  const b = named(categories);
  const smile = avg(b, ["mouthSmileLeft", "mouthSmileRight"]);
  const frown = avg(b, ["mouthFrownLeft", "mouthFrownRight"]);
  const browDown = avg(b, ["browDownLeft", "browDownRight"]);
  const eyeBlink = avg(b, ["eyeBlinkLeft", "eyeBlinkRight"]);
  const jawOpen = b.jawOpen ?? 0;
  const mouthPress = avg(b, ["mouthPressLeft", "mouthPressRight"]);
  const eyeSquint = avg(b, ["eyeSquintLeft", "eyeSquintRight"]);

  const tension = Math.min(1, browDown * 1.3 + mouthPress * 0.8 + frown * 0.7);
  const tiredness = Math.min(1, eyeBlink * 0.7 + eyeSquint * 0.4 + (1 - smile) * 0.2);
  const stressCue = Math.min(1, tension * 0.7 + jawOpen * 0.25 + frown * 0.3);

  const scores: Record<SimpleMood, number> = {
    Positive: smile * 1.4,
    Calm: Math.max(0, 0.55 - tension - tiredness * 0.35 + smile * 0.2),
    Tired: tiredness,
    Tense: tension,
    Stressed: stressCue,
  };

  const mood = pickMood(scores);
  const confidence = Math.min(99, Math.round(40 + scores[mood] * 55));

  return {
    mood,
    confidence,
    smile,
    tension,
    tiredness,
    faceFound: true,
  };
}
