import { pickMood, type SimpleMood, type VoiceReading } from "./scanTypes";

function estimatePitchHz(samples: Float32Array, sampleRate: number) {
  const minLag = Math.floor(sampleRate / 400);
  const maxLag = Math.min(Math.floor(sampleRate / 70), samples.length - 1);
  let bestLag = 0;
  let bestCorr = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < samples.length - lag; i++) {
      corr += samples[i] * samples[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }
  if (bestLag === 0 || bestCorr < 0.01) return 0;
  return sampleRate / bestLag;
}

export function analyzeVoiceFrame(
  samples: Float32Array,
  sampleRate = 44100
): VoiceReading {
  let sumSq = 0;
  let crossings = 0;
  let prev = 0;
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i];
    sumSq += v * v;
    if (i > 0 && ((prev >= 0 && v < 0) || (prev < 0 && v >= 0))) crossings += 1;
    prev = v;
  }

  const rms = Math.sqrt(sumSq / Math.max(1, samples.length));
  const energy = Math.min(1, rms * 8);
  const zcr = crossings / Math.max(1, samples.length);
  const speaking = energy > 0.04;
  const pitchHz = speaking ? estimatePitchHz(samples, sampleRate) : 0;
  const highPitch = pitchHz > 210 ? Math.min(1, (pitchHz - 210) / 140) : 0;
  const strain = speaking
    ? Math.min(1, energy * 0.5 + zcr * 10 + highPitch * 0.35)
    : 0.12;

  const scores: Record<SimpleMood, number> = {
    Calm: speaking ? Math.max(0, 0.5 - strain) : 0.35,
    Positive: speaking && energy > 0.08 && strain < 0.4 ? 0.42 : 0.1,
    Tired: !speaking ? 0.22 : Math.max(0, 0.28 - energy),
    Tense: strain * 0.8 + highPitch * 0.2,
    Stressed: strain * 0.95 + highPitch * 0.25,
  };

  return {
    mood: pickMood(scores),
    energy,
    strain,
    pitchHz: Math.round(pitchHz),
    speaking,
  };
}
