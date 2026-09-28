import React, { useState, useEffect } from "react";
import type { Route } from "./+types/wellness";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router";
import {
  Shield,
  Heart,
  Phone,
  MessageSquare,
  Users,
  Play,
  Pause,
  Lock,
  LogOut,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Smile,
  Frown,
  Meh,
  Calendar,
  Compass
} from "lucide-react";
import Navbar from "../components/Navbar";
import { analyzeJournalText } from "../lib/nlpWellness";
import {
  combineReadings,
  EMPTY_FACE,
  EMPTY_VOICE,
  persistScan,
  readLastScan,
  readScanHistory,
  type WellnessCheckIn,
} from "../lib/scanTypes";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RAKSHAK AI // Wellness Hub & Daily Check-In" },
    {
      name: "description",
      content:
        "Private wellness hub, daily check-in flow, personal progress analytics, and confidential support.",
    },
  ];
}

type TabType = "checkin" | "progress" | "breathing" | "support";
type CheckInAnswerKey = Exclude<keyof WellnessCheckIn, "note" | "completedAt">;
type CheckInAnswers = Pick<WellnessCheckIn, CheckInAnswerKey>;

const CHECKIN_QUESTIONS: Array<{
  key: CheckInAnswerKey;
  eyebrow: string;
  prompt: string;
  helper?: string;
  options: string[];
}> = [
  {
    key: "mood",
    eyebrow: "MOOD",
    prompt: "How are you feeling overall today?",
    options: ["Very low", "Low", "Okay", "Good", "Very good"],
  },
  {
    key: "stress",
    eyebrow: "STRESS",
    prompt: "How high is your stress right now?",
    options: ["Not at all", "Low", "Moderate", "High", "Very high"],
  },
  {
    key: "workload",
    eyebrow: "WORKLOAD",
    prompt: "How does your current workload feel?",
    options: ["Manageable", "Busy but balanced", "Demanding", "Heavy", "Overwhelming"],
  },
  {
    key: "sleep",
    eyebrow: "SLEEP",
    prompt: "How was your sleep last night?",
    helper: "Choose the closest description of your hours or sleep quality.",
    options: ["Less than 4 hours", "4–5 hours", "6–7 hours", "8+ hours", "Restless / poor quality"],
  },
  {
    key: "energy",
    eyebrow: "ENERGY",
    prompt: "How is your energy right now?",
    options: ["Very low", "Low", "Okay", "Good", "High"],
  },
  {
    key: "restingHeartRate",
    eyebrow: "RESTING HEART-RATE INDICATOR",
    prompt: "Compared with usual, what have you noticed about your resting heart rate?",
    helper:
      "This is an optional-to-observe, subjective check-in—not a diagnosis. You do not need to measure or enter a precise bpm.",
    options: ["About usual", "A little higher", "Much higher", "Unsure / not tracked"],
  },
];

export default function WellnessHub() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSubTab, setActiveSubTab] = useState<TabType>("checkin");

  const [checkinStep, setCheckinStep] = useState<number>(1);
  const [checkinReviewing, setCheckinReviewing] = useState(false);
  const [checkInAnswers, setCheckInAnswers] = useState<CheckInAnswers>({
    mood: "",
    stress: "",
    workload: "",
    sleep: "",
    energy: "",
    restingHeartRate: "",
  });
  const [customNote, setCustomNote] = useState<string>("");
  const [checkinCompleted, setCheckinCompleted] = useState<boolean>(false);
  const [lastScan, setLastScan] = useState<ReturnType<typeof readLastScan>>(null);
  const [scanHistory, setScanHistory] = useState<ReturnType<typeof readScanHistory>>([]);
  const noteNlp = analyzeJournalText(customNote);

  useEffect(() => {
    setLastScan(readLastScan());
    setScanHistory(readScanHistory());
  }, [checkinCompleted, activeSubTab]);

  useEffect(() => {
    const savedCheckIn = readLastScan()?.checkIn;
    if (savedCheckIn) {
      const { note: _note, completedAt: _completedAt, ...answers } = savedCheckIn;
      setCheckInAnswers(answers);
      setCustomNote(savedCheckIn.note ?? "");
    }
  }, []);

  // Guided Breathing State
  const [breathingActive, setBreathingActive] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold1" | "Exhale" | "Hold2">("Inhale");
  const [phaseCountdown, setPhaseCountdown] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(6);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  // Box breathing timer
  useEffect(() => {
    if (!breathingActive) return;
    const interval = setInterval(() => {
      setPhaseCountdown((prev) => {
        if (prev > 1) return prev - 1;
        setPhase((currPhase) => {
          if (currPhase === "Inhale") return "Hold1";
          if (currPhase === "Hold1") return "Exhale";
          if (currPhase === "Exhale") return "Hold2";
          setCompletedCycles((c) => c + 1);
          return "Inhale";
        });
        return 4;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [breathingActive]);

  const currentQuestion = CHECKIN_QUESTIONS[checkinStep - 1];
  const allQuestionsAnswered = CHECKIN_QUESTIONS.every(
    ({ key }) => Boolean(checkInAnswers[key])
  );

  const handleContinueCheckin = () => {
    if (!currentQuestion || !checkInAnswers[currentQuestion.key]) return;
    if (checkinStep < CHECKIN_QUESTIONS.length) {
      setCheckinStep((step) => step + 1);
      return;
    }
    setCheckinReviewing(true);
  };

  const handleCompleteCheckin = () => {
    if (!allQuestionsAnswered) return;
    const nlp = analyzeJournalText(customNote);
    const previous = readLastScan();
    const checkIn: WellnessCheckIn = {
      ...checkInAnswers,
      note: customNote.trim() || undefined,
      completedAt: new Date().toISOString(),
    };
    persistScan(
      {
        ...combineReadings(previous?.face ?? EMPTY_FACE, previous?.voice ?? EMPTY_VOICE, nlp),
        checkIn,
      }
    );
    setCheckinCompleted(true);
    setCheckinReviewing(false);
    setTimeout(() => {
      setActiveSubTab("progress");
    }, 1200);
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${
      theme === "bright"
        ? "bg-[#f8fafc] text-slate-900"
        : "bg-[#070e16] text-slate-100"
    }`}>
      {/* Top Navbar */}
      <Navbar />

      {/* ================= TOP BAR ================= */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-3 transition-colors ${
        theme === "bright"
          ? "bg-white border-slate-200 shadow-sm"
          : "bg-slate-950/80 border-slate-800"
      }`}>
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold tracking-wider text-slate-900 dark:text-white">
                  RAKSHAK AI
                </span>
                <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  100% PRIVATE &amp; CONFIDENTIAL
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                DAILY WELLBEING &amp; PROGRESS TRACKER
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href="tel:988"
              className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 font-mono text-xs font-bold shadow-lg shadow-rose-600/30 transition"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Urgent Help / 988</span>
            </a>
          </div>

        </div>
      </div>

      {/* ================= SUB-NAVIGATION TABS ================= */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-2 text-xs font-mono transition-colors lg:contents ${
        theme === "bright"
          ? "bg-slate-100 border-slate-200"
          : "bg-slate-900/60 border-slate-800"
      }`}>
        <div className="mx-auto max-w-[1720px] flex items-center justify-between">
          {/* Local Sub-tabs: Daily check-in vs My progress */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-200 dark:bg-slate-950 p-1 border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setActiveSubTab("checkin")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeSubTab === "checkin"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Daily check-in
            </button>
            <button
              onClick={() => setActiveSubTab("progress")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeSubTab === "progress"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              My progress
            </button>
            <button
              onClick={() => setActiveSubTab("breathing")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeSubTab === "breathing"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Breathing &amp; Audio
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        
        {/* VIEW 1: DAILY CHECK-IN (Matching uploaded Images 1 & 3) */}
        {activeSubTab === "checkin" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Time to unwind
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                  How are you feeling?
                </h1>
              </div>

              <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-3.5 py-1 font-mono text-xs font-bold self-start sm:self-auto">
                100% PRIVATE &amp; CONFIDENTIAL
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Main Questionnaire Card */}
              <div className={`lg:col-span-8 rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-colors ${
                theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    Today&apos;s check-in
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {checkinStep} of {CHECKIN_QUESTIONS.length}
                  </span>
                </div>

                <div
                  className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
                  aria-label={`Check-in progress: ${checkinStep} of ${CHECKIN_QUESTIONS.length}`}
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={CHECKIN_QUESTIONS.length}
                  aria-valuenow={checkinStep}
                >
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${(checkinStep / CHECKIN_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {!checkinReviewing && currentQuestion && (
                  <div className="mt-8 flex flex-col gap-6" aria-live="polite">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/20 font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        {String(checkinStep).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                        {currentQuestion.eyebrow}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currentQuestion.prompt}
                      </h2>
                      {currentQuestion.helper && (
                        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {currentQuestion.helper}
                        </p>
                      )}
                    </div>

                    <fieldset>
                      <legend className="sr-only">{currentQuestion.prompt}</legend>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {currentQuestion.options.map((option) => {
                          const isSelected = checkInAnswers[currentQuestion.key] === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() =>
                                setCheckInAnswers((answers) => ({
                                  ...answers,
                                  [currentQuestion.key]: option,
                                }))
                              }
                              className={`flex min-h-[58px] items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                                isSelected
                                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-700 ring-2 ring-cyan-500/30 dark:text-cyan-300"
                                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
                              }`}
                            >
                              <span>{option}</span>
                              {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {currentQuestion.key === "restingHeartRate" && (
                      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
                        This observation stays separate from measured sensor data and does not indicate a medical conclusion.
                      </p>
                    )}

                    {checkinStep === CHECKIN_QUESTIONS.length && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="checkin-note">
                          Anything else you&apos;d like to share?{" "}
                          <span className="font-normal text-slate-500">Optional</span>
                        </label>
                        <textarea
                          id="checkin-note"
                          rows={3}
                          value={customNote}
                          onChange={(e) => setCustomNote(e.target.value)}
                          placeholder="Keep it as general or as specific as you feel comfortable..."
                          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-900 placeholder-slate-400 transition focus:border-cyan-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        />
                        {noteNlp.wordCount > 0 && (
                          <p className="text-[11px] text-slate-500">
                            On-device NLP: {noteNlp.mood}
                            {noteNlp.cues.length ? ` · ${noteNlp.cues.join(", ")}` : ""}. The note itself is not uploaded.
                          </p>
                        )}
                        {noteNlp.crisisFlag && (
                          <a href="tel:988" className="text-[11px] font-bold text-rose-500">
                            If you feel unsafe, call 988. This text stays on your device.
                          </a>
                        )}
                      </div>
                    )}

                    {!checkInAnswers[currentQuestion.key] && (
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400" role="alert">
                        Select an answer to continue.
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setCheckinStep((step) => Math.max(1, step - 1))}
                        disabled={checkinStep === 1}
                        className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 font-mono text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleContinueCheckin}
                        disabled={!checkInAnswers[currentQuestion.key]}
                        className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>{checkinStep === CHECKIN_QUESTIONS.length ? "Review answers" : "Continue"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {checkinReviewing && (
                  <div className="mt-8 flex flex-col gap-6" aria-live="polite">
                    <div>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                        REVIEW
                      </span>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        Check your answers before saving
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Your responses stay on this device with the latest check-in record.
                      </p>
                    </div>

                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {CHECKIN_QUESTIONS.map((question) => (
                        <div
                          key={question.key}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                        >
                          <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {question.eyebrow}
                          </dt>
                          <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                            {checkInAnswers[question.key]}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setCheckinReviewing(false)}
                        className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 font-mono text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleCompleteCheckin}
                        disabled={checkinCompleted}
                        className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <span>{checkinCompleted ? "Saved!" : "Save check-in"}</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side Cards (From Image 1 & 3) */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                
                {/* Side Card 1: YOUR DATA / You stay in control. */}
                <div className={`rounded-3xl border p-6 transition-colors ${
                  theme === "bright"
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                }`}>
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    YOUR DATA
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    You stay in control.
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    Your individual answers are for your wellbeing journey. Managers see aggregated team patterns rather than private notes.
                  </p>
                </div>

              </div>

            </div>

            {/* ================= CONFIDENTIAL COUNSELOR SUPPORT GRID (Restored) ================= */}
            <div className={`mt-4 rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-colors ${
              theme === "bright"
                ? "bg-white border-slate-200 shadow-sm text-slate-900"
                : "bg-slate-900/80 border-slate-800 shadow-xl text-white"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>DIRECT CONFIDENTIAL UPLINK</span>
                    <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px]">
                      4 Support Counselors Ready
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                    Confidential Support &amp; Counselors
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Average wait: Under 60 seconds
                </span>
              </div>

              {/* 4 Counselor Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Chaplain */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-700 dark:text-slate-400 font-bold">
                        24/7 Available
                      </span>
                    </div>
                    <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Chaplain / Spiritual Counselor</h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      Non-denominational spiritual guidance, personal moral conflict support, and an open, caring ear.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Initiating Secure Encrypted Voice Channel with On-Duty Chaplain...")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 hover:bg-slate-800 py-2.5 font-mono text-xs font-bold text-white transition active:scale-95 shadow-sm"
                  >
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Start Voice Call</span>
                  </button>
                </div>

                {/* 2. Mental Health Counselor */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 font-mono text-[9px] text-indigo-700 dark:text-indigo-300 font-bold">
                        Licensed Therapist
                      </span>
                    </div>
                    <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Mental Health Counselor</h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      Confidential 1-on-1 talk therapy for acute operational stress, sleep trouble, anxiety, and trauma.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Opening Confidential Silent Text Chat with Licensed Provider...")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 hover:bg-slate-800 py-2.5 font-mono text-xs font-bold text-white transition active:scale-95 shadow-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Start Text Chat</span>
                  </button>
                </div>

                {/* 3. Peer Support Buddy */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-700 dark:text-slate-400 font-bold">
                        Anonymous
                      </span>
                    </div>
                    <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Peer Support Buddy</h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      Connect with a vetted fellow servicemember who has been there and understands high-stress deployments.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Searching Anonymous Peer Network for Available Servicemember...")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 hover:bg-slate-800 py-2.5 font-mono text-xs font-bold text-white transition active:scale-95 shadow-sm"
                  >
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Connect Peer</span>
                  </button>
                </div>

                {/* 4. Immediate Crisis Helpline */}
                <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-slate-950 p-5 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 font-mono text-[9px] text-rose-300 font-bold">
                        24/7 Priority Emergency
                      </span>
                    </div>
                    <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">Immediate Crisis Helpline</h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      Immediate crisis triage, suicide prevention, and 24/7 urgent psychological stabilization.
                    </p>
                  </div>
                  <a
                    href="tel:988"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white py-2.5 font-mono text-xs font-bold shadow-lg shadow-rose-600/30 transition active:scale-95 text-center"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call 988 Emergency</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: MY PROGRESS (Matching uploaded Image 2) */}
        {activeSubTab === "progress" && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="font-mono text-xs text-slate-500 uppercase tracking-widest font-semibold">
                ANALYTICS &amp; RECOVERY
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                My progress
              </h1>
            </div>

            {/* 3 Top Stat Cards (From Image 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Average sleep */}
              <div className={`rounded-3xl border p-6 transition-colors ${
                theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                  Average sleep
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-black text-slate-900 dark:text-white">
                    6.9h
                  </span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ↑ 5% vs previous week
                </span>
              </div>

              {/* Card 2: Average stress */}
              <div className={`rounded-3xl border p-6 transition-colors ${
                theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                  Average stress
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-black text-slate-900 dark:text-white">
                    3.1<small className="text-lg text-slate-400">/5</small>
                  </span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ↓ 12% vs previous week
                </span>
              </div>

              {/* Card 3: Workload */}
              <div className={`rounded-3xl border p-6 transition-colors ${
                theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                  Workload
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-black text-slate-900 dark:text-white">
                    3.4<small className="text-lg text-slate-400">/5</small>
                  </span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  ↑ 7% vs previous week
                </span>
              </div>

            </div>

            {/* Main 2-Column Section (Recent Check-Ins & Reflection from Image 2) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left: RECENT CHECK-INS / Your pattern */}
              <div className={`lg:col-span-7 rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-colors ${
                theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  RECENT CHECK-INS
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-6">
                  Your pattern
                </h3>

                {lastScan && (
                  <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs">
                    <span className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-300">
                      LAST OFFLINE SCAN
                    </span>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {lastScan.overallMood} · stress {lastScan.stressScore}
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">{lastScan.advice}</p>
                    <p className="mt-1 font-mono text-[10px] text-slate-500">
                      Face {lastScan.face.mood} · Voice {lastScan.voice.mood} · NLP {lastScan.nlp.mood}
                    </p>
                  </div>
                )}

                {lastScan?.checkIn && (
                  <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        Latest self-report
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        {new Date(lastScan.checkIn.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:grid-cols-3">
                      {[
                        ["Mood", lastScan.checkIn.mood],
                        ["Stress", lastScan.checkIn.stress],
                        ["Workload", lastScan.checkIn.workload],
                        ["Sleep", lastScan.checkIn.sleep],
                        ["Energy", lastScan.checkIn.energy],
                        ["Resting HR", lastScan.checkIn.restingHeartRate],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                          <dd className="mt-0.5 font-semibold text-slate-900 dark:text-white">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
                  {/* Today */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Today</span>
                    <div className="flex items-center gap-4">
                      <strong className="text-base font-black text-slate-900 dark:text-white">72</strong>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 font-bold text-[10px]">
                        Stable
                      </span>
                    </div>
                  </div>

                  {/* Yesterday */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Yesterday</span>
                    <div className="flex items-center gap-4">
                      <strong className="text-base font-black text-slate-900 dark:text-white">68</strong>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 font-bold text-[10px]">
                        Stable
                      </span>
                    </div>
                  </div>

                  {/* Fri */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Fri</span>
                    <div className="flex items-center gap-4">
                      <strong className="text-base font-black text-slate-900 dark:text-white">65</strong>
                      <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-3 py-1 font-bold text-[10px]">
                        Watch
                      </span>
                    </div>
                  </div>

                  {/* Thu */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Thu</span>
                    <div className="flex items-center gap-4">
                      <strong className="text-base font-black text-slate-900 dark:text-white">70</strong>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 font-bold text-[10px]">
                        Stable
                      </span>
                    </div>
                  </div>

                  {/* Wed */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Wed</span>
                    <div className="flex items-center gap-4">
                      <strong className="text-base font-black text-slate-900 dark:text-white">74</strong>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 font-bold text-[10px]">
                        Good
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: REFLECTION / What changed? */}
              <div className={`lg:col-span-5 rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-colors ${
                theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  REFLECTION
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-6">
                  What changed?
                </h3>

                <div className="flex flex-col gap-4 font-sans text-xs">
                  {/* Item 1 */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                      Workload Improved
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Your reported workload has been trending lower across recent check-ins.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                      Sleep is still variable
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Your average is improving, but consistency could help recovery.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: BREATHING & AUDIO */}
        {activeSubTab === "breathing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Box Breathing */}
            <div className={`lg:col-span-6 rounded-3xl border p-6 backdrop-blur-xl flex flex-col justify-between min-h-[460px] transition-colors ${
              theme === "bright"
                ? "bg-white border-slate-200 shadow-sm"
                : "bg-slate-900/80 border-slate-800 shadow-xl"
            }`}>
              <div>
                <span className="font-mono text-[10px] uppercase text-cyan-600 dark:text-cyan-400 font-bold">
                  RELAXATION &amp; RECOVERY
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Guided Box Breathing (4-4-4-4)
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Use this simple 4-4-4-4 box breathing pattern to quickly calm your nervous system and slow your heart rate.
                </p>
              </div>

              {/* Circle Graphic */}
              <div className="my-6 flex flex-col items-center justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <motion.div
                    animate={
                      breathingActive
                        ? phase === "Inhale"
                          ? { scale: [1, 1.22] }
                          : phase === "Exhale"
                          ? { scale: [1.22, 1] }
                          : { scale: phase === "Hold1" ? 1.22 : 1 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="h-36 w-36 rounded-full border-2 border-cyan-500 bg-cyan-500/10 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-widest text-cyan-600 dark:text-cyan-300 font-bold">
                      {breathingActive ? phase.toUpperCase() : "READY"}
                    </span>
                    <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
                      {breathingActive ? `${phaseCountdown}s` : "4s"}
                    </span>
                  </motion.div>
                </div>
              </div>

              <button
                onClick={() => setBreathingActive(!breathingActive)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-mono text-xs font-bold transition-all shadow-md active:scale-95 ${
                  breathingActive
                    ? "bg-slate-800 text-white"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
                }`}
              >
                {breathingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{breathingActive ? "Pause Session" : "Start Breathing Session"}</span>
              </button>
            </div>

            {/* Audio Relaxation */}
            <div className={`lg:col-span-6 rounded-3xl border p-6 backdrop-blur-xl transition-colors ${
              theme === "bright"
                ? "bg-white border-slate-200 shadow-sm"
                : "bg-slate-900/80 border-slate-800 shadow-xl"
            }`}>
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                AUDIO RELAXATION
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-4">
                Calming Soundscapes
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  { id: 1, title: "Mind Calming & Focus", duration: "10 MIN", desc: "Soft binaural relaxation tone." },
                  { id: 2, title: "Quiet Ambient Noise", duration: "15 MIN", desc: "Blocks out loud background chatter." },
                  { id: 3, title: "Deep Sleep Soundscape", duration: "30 MIN", desc: "Gentle low frequencies for rest." },
                ].map((track) => {
                  const isPlaying = playingTrack === track.id;
                  return (
                    <div
                      key={track.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-sm font-bold text-slate-900 dark:text-white block">{track.title}</strong>
                        <span className="text-xs text-slate-500">{track.desc}</span>
                      </div>
                      <button
                        onClick={() => setPlayingTrack(isPlaying ? null : track.id)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold"
                      >
                        {isPlaying ? "Pause" : "Play"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className={`border-t px-4 sm:px-8 py-3 font-mono text-[10px] flex flex-wrap items-center justify-between gap-4 transition-colors ${
        theme === "bright"
          ? "bg-white border-slate-200 text-slate-600"
          : "bg-slate-950/90 border-slate-800 text-slate-500"
      }`}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Encrypted Local Storage // Zero Surveillance Architecture</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Data is private &amp; encrypted</span>
        </div>
      </footer>
    </div>
  );
}
