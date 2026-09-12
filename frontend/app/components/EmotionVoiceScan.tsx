import React, { useEffect, useRef, useState } from "react";
import { Camera, Mic, MicOff, ScanFace, Shield, Square } from "lucide-react";
import { readingFromBlendshapes } from "../lib/emotionFromBlendshapes";
import { analyzeVoiceFrame } from "../lib/voiceFromAudio";
import { analyzeJournalText } from "../lib/nlpWellness";
import {
  combineReadings,
  EMPTY_FACE,
  EMPTY_NLP,
  EMPTY_VOICE,
  persistScan,
  type CombinedScan,
  type FaceReading,
  type VoiceReading,
} from "../lib/scanTypes";

type VisionModule = {
  FilesetResolver: {
    forVisionTasks: (path: string) => Promise<unknown>;
  };
  FaceLandmarker: {
    createFromOptions: (fileset: unknown, options: Record<string, unknown>) => Promise<{
      detectForVideo: (video: HTMLVideoElement, ts: number) => {
        faceBlendshapes?: Array<{ categories: Array<{ categoryName: string; score: number }> }>;
      };
      close?: () => void;
    }>;
  };
};

const WASM_PATH = "/mediapipe/wasm";
const MODEL_PATH = "/models/face_landmarker.task";

export function EmotionVoiceScan({
  compact = false,
  onResult,
}: {
  compact?: boolean;
  onResult?: (scan: CombinedScan) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<{
    detectForVideo: (video: HTMLVideoElement, ts: number) => {
      faceBlendshapes?: Array<{ categories: Array<{ categoryName: string; score: number }> }>;
    };
    close?: () => void;
  } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);

  const [live, setLive] = useState(false);
  const [status, setStatus] = useState(
    "Runs on this device. Camera, mic, and notes never leave the browser."
  );
  const [error, setError] = useState("");
  const [face, setFace] = useState<FaceReading>(EMPTY_FACE);
  const [voice, setVoice] = useState<VoiceReading>(EMPTY_VOICE);
  const [note, setNote] = useState("");
  const faceRef = useRef(EMPTY_FACE);
  const voiceRef = useRef(EMPTY_VOICE);
  const noteRef = useRef("");

  useEffect(() => {
    faceRef.current = face;
  }, [face]);
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);
  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    landmarkerRef.current?.close?.();
    landmarkerRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setLive(false);
    setStatus("Scan stopped. Video and audio were discarded — nothing was uploaded.");
  };

  useEffect(() => () => stop(), []);

  const start = async () => {
    setError("");
    setStatus("Asking for camera and microphone…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      try {
        const vision = (await import("@mediapipe/tasks-vision")) as unknown as VisionModule;
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_PATH);
        const options = {
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
        };
        try {
          landmarkerRef.current = await vision.FaceLandmarker.createFromOptions(fileset, {
            ...options,
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: "GPU" },
          });
        } catch {
          landmarkerRef.current = await vision.FaceLandmarker.createFromOptions(fileset, {
            ...options,
            baseOptions: { modelAssetPath: MODEL_PATH, delegate: "CPU" },
          });
        }
        setStatus("On-device face + voice models ready. Look at the camera and speak normally.");
      } catch {
        setStatus("Face model could not load from local files. Voice + NLP still run on-device.");
      }

      setLive(true);
      let lastTick = 0;

      const loop = () => {
        const now = performance.now();
        if (now - lastTick > 90) {
          lastTick = now;
          const video = videoRef.current;
          const landmarker = landmarkerRef.current;
          if (video && landmarker && video.readyState >= 2) {
            const result = landmarker.detectForVideo(video, now);
            const cats = result.faceBlendshapes?.[0]?.categories;
            if (cats?.length) {
              setFace(readingFromBlendshapes(cats));
            } else {
              setFace((prev) => ({ ...prev, faceFound: false }));
            }
          }

          const analyser = analyserRef.current;
          if (analyser) {
            const buf = new Float32Array(analyser.fftSize);
            analyser.getFloatTimeDomainData(buf);
            setVoice(analyzeVoiceFrame(buf, audioCtxRef.current?.sampleRate ?? 44100));
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch {
      setError("Camera or microphone was blocked. Allow access in the browser, then try again.");
      stop();
    }
  };

  const nlp = note.trim() ? analyzeJournalText(note) : EMPTY_NLP;
  const combined = combineReadings(face, voice, nlp);

  const save = () => {
    const scan = combineReadings(
      faceRef.current,
      voiceRef.current,
      analyzeJournalText(noteRef.current)
    );
    persistScan(scan);
    onResult?.(scan);
    setStatus("Scores saved in this browser session only. No video, audio, or journal text was sent anywhere.");
  };

  const bar = (value: number, color: string) => (
    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );

  return (
    <div className={`rounded-3xl border p-5 ${compact ? "" : "h-full"} border-slate-800 bg-slate-900/80`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ScanFace className="h-5 w-5 text-cyan-400" />
            Offline wellness scan
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Face emotion, voice strain, and note NLP all run locally. Commanders never see video or what you wrote.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
          <Shield className="h-3 w-3" /> Offline
        </span>
      </div>

      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black aspect-[4/3]">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover -scale-x-100" />
          {!live && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
              Camera off
            </div>
          )}
          {live && (
            <div className="absolute left-3 top-3 rounded-full bg-rose-500/90 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              LIVE · NOT RECORDED
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 p-3">
              <div className="text-[11px] font-mono text-slate-400">Face</div>
              <div className="text-xl font-bold mt-1">{face.faceFound ? face.mood : "No face yet"}</div>
              <p className="text-[11px] text-slate-400 mt-1">Smile</p>
              {bar(face.smile, "bg-emerald-400")}
              <p className="text-[11px] text-slate-400 mt-2">Tension</p>
              {bar(face.tension, "bg-amber-400")}
            </div>
            <div className="rounded-2xl border border-slate-800 p-3">
              <div className="text-[11px] font-mono text-slate-400">Voice</div>
              <div className="text-xl font-bold mt-1">{voice.speaking ? voice.mood : "Quiet"}</div>
              <p className="text-[11px] text-slate-400 mt-1">Energy</p>
              {bar(voice.energy, "bg-cyan-400")}
              <p className="text-[11px] text-slate-400 mt-2">Strain</p>
              {bar(voice.strain, "bg-rose-400")}
              {voice.pitchHz > 0 && (
                <p className="text-[10px] font-mono text-slate-500 mt-2">{voice.pitchHz} Hz pitch</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3">
            <div className="font-mono text-[10px] text-cyan-300">Combined reading</div>
            <div className="mt-1 flex items-end justify-between gap-2">
              <div>
                <div className="text-2xl font-extrabold">{combined.overallMood}</div>
                <p className="text-xs text-slate-300 mt-1">{combined.advice}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-cyan-300">{combined.stressScore}</div>
                <div className="font-mono text-[10px] text-slate-400">stress 0–100</div>
              </div>
            </div>
          </div>

          {nlp.crisisFlag && (
            <a
              href="tel:988"
              className="rounded-2xl border border-rose-500/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200 font-semibold"
            >
              Support looks urgent. Tap to call 988. This note stays on this device.
            </a>
          )}

          <label className="text-[11px] font-mono text-slate-400">
            Private note (NLP on-device)
            <textarea
              rows={compact ? 2 : 3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional. Example: I feel tired after night duty…"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </label>
          {nlp.wordCount > 0 && (
            <p className="text-[11px] text-slate-400">
              Note mood: {nlp.mood}
              {nlp.cues.length ? ` · cues: ${nlp.cues.join(", ")}` : ""}
            </p>
          )}
        </div>
      </div>

      <p className={`mt-4 text-xs ${error ? "text-rose-400" : "text-slate-400"}`}>{error || status}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {!live ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 font-mono text-xs font-bold text-slate-950"
          >
            <Camera className="h-4 w-4" />
            Start camera & mic
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-4 py-2.5 font-mono text-xs font-bold"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 font-mono text-xs font-bold text-slate-950"
            >
              Save scores on this device
            </button>
          </>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
          {live ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
          Mic {live ? "on" : "off"} · no cloud speech
        </span>
      </div>
    </div>
  );
}
