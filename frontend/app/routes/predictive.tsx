import React, { useState } from "react";
import type { Route } from "./+types/predictive";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  Radio,
  Wifi,
  Sparkles,
  Heart,
  TrendingUp,
  Flame,
  CheckSquare,
  Square,
  Watch,
  Send,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Info,
  Droplets,
  Volume2,
  Brain,
  ListTodo,
  TrendingDown,
  Wind,
  // ── NEW: HR Indicators & Lifestyle ──
  Calendar,
  MapPin,
  Repeat,
  BookOpen,
  BarChart3,
  Coffee,
  Cigarette,
  Wine,
  Dumbbell,
  Bed,
  Utensils,
  User,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "RAKSHAK AI // Predictive Risk & Environmental Health Forecast" },
    {
      name: "description",
      content:
        "Continuous stress & fatigue intelligence 72-hour predictive forecast screen for operational squads.",
    },
  ];
}

type ForecastWindow = "24H" | "48H" | "72H";

// ─────────────────────────────────────────────────────────────
// HR INDICATOR DATA
// ─────────────────────────────────────────────────────────────
const hrIndicators = [
  {
    id: "leavePatterns",
    label: "Leave Patterns",
    icon: Calendar,
    impact: "HIGH" as const,
    impactColor: "rose" as const,
    stressContrib: 72,
    stat: "0 days in last 45 days",
    desc: "No leave taken in 45 days signals accumulated fatigue and elevated burnout probability that compounds daily.",
  },
  {
    id: "deploymentHistory",
    label: "Deployment History",
    icon: MapPin,
    impact: "HIGH" as const,
    impactColor: "rose" as const,
    stressContrib: 68,
    stat: "3 consecutive deployments",
    desc: "Back-to-back field deployments without recovery windows significantly elevates chronic stress and allostatic load.",
  },
  {
    id: "dutySchedules",
    label: "Duty Schedules",
    icon: Clock,
    impact: "MEDIUM" as const,
    impactColor: "amber" as const,
    stressContrib: 55,
    stat: "18 of 30 days: night shift",
    desc: "High night-shift proportion disrupts circadian rhythm causing progressive fatigue accumulation over weeks.",
  },
  {
    id: "transferFrequency",
    label: "Transfer Frequency",
    icon: Repeat,
    impact: "MEDIUM" as const,
    impactColor: "amber" as const,
    stressContrib: 48,
    stat: "2 transfers in 6 months",
    desc: "Frequent relocations raise psychological adaptation stress and erode social support networks critical to resilience.",
  },
  {
    id: "trainingCommitments",
    label: "Training Commitments",
    icon: BookOpen,
    impact: "MEDIUM" as const,
    impactColor: "amber" as const,
    stressContrib: 44,
    stat: "4 concurrent programs",
    desc: "Multiple active training programs add substantial cognitive load stacked on top of regular operational duties.",
  },
  {
    id: "workloadTrends",
    label: "Workload Trends",
    icon: BarChart3,
    impact: "HIGH" as const,
    impactColor: "rose" as const,
    stressContrib: 79,
    stat: "+12 hrs overtime avg/week",
    desc: "Sustained overtime without compensatory downtime is the primary driver of the predicted stress escalation peak.",
  },
];

// ─────────────────────────────────────────────────────────────
// LIFESTYLE CHECK-IN QUESTIONS
// ─────────────────────────────────────────────────────────────
const lifestyleQuestions = [
  {
    id: "smoking",
    icon: Cigarette,
    question: "Do you smoke?",
    subtitle: "Nicotine directly elevates cortisol levels and amplifies the cardiovascular stress response.",
    options: [
      { label: "🚭  No, I don't smoke", value: "never", impact: "low" as const },
      { label: "🚬  Occasionally (social / rare)", value: "occasionally", impact: "medium" as const },
      { label: "🚬  Regularly (daily)", value: "regularly", impact: "high" as const },
      { label: "🚬  Heavily (10+ cigarettes per day)", value: "heavily", impact: "high" as const },
    ],
  },
  {
    id: "alcohol",
    icon: Wine,
    question: "How often do you consume alcohol?",
    subtitle: "Alcohol disrupts sleep architecture and raises inflammatory stress markers the following day.",
    options: [
      { label: "🚫  Never", value: "never", impact: "low" as const },
      { label: "📅  Rarely (once a month or less)", value: "rarely", impact: "low" as const },
      { label: "🍺  Sometimes (weekends only)", value: "sometimes", impact: "medium" as const },
      { label: "🍺  Frequently (3–4 times per week)", value: "frequently", impact: "high" as const },
      { label: "🍺  Daily", value: "daily", impact: "high" as const },
    ],
  },
  {
    id: "caffeine",
    icon: Coffee,
    question: "How many caffeinated drinks do you have daily?",
    subtitle: "Excess caffeine elevates cortisol and disrupts the sleep–stress recovery cycle.",
    options: [
      { label: "☕  None", value: "none", impact: "low" as const },
      { label: "☕  1–2 cups / drinks", value: "1-2", impact: "low" as const },
      { label: "☕  3–4 cups / drinks", value: "3-4", impact: "medium" as const },
      { label: "☕  5+ cups / drinks", value: "5+", impact: "high" as const },
    ],
  },
  {
    id: "water",
    icon: Droplets,
    question: "How much water do you drink daily?",
    subtitle: "Dehydration amplifies physical fatigue and degrades cognitive stress tolerance significantly.",
    options: [
      { label: "💧  Less than 1 litre", value: "<1L", impact: "high" as const },
      { label: "💧  1–2 litres", value: "1-2L", impact: "medium" as const },
      { label: "💧  2–3 litres", value: "2-3L", impact: "low" as const },
      { label: "💧  More than 3 litres", value: ">3L", impact: "low" as const },
    ],
  },
  {
    id: "exercise",
    icon: Dumbbell,
    question: "How often do you exercise or engage in physical activity?",
    subtitle: "Regular exercise is the primary buffer against operational stress accumulation.",
    options: [
      { label: "😴  Rarely or never", value: "never", impact: "high" as const },
      { label: "🏃  1–2 times per week", value: "1-2x", impact: "medium" as const },
      { label: "🏋️  3–4 times per week", value: "3-4x", impact: "low" as const },
      { label: "🏅  Daily", value: "daily", impact: "low" as const },
    ],
  },
  {
    id: "sleep",
    icon: Bed,
    question: "How would you rate your average sleep quality?",
    subtitle: "Sleep quality directly determines stress resilience and field reaction time.",
    options: [
      { label: "😫  Very poor – frequently interrupted", value: "very_poor", impact: "high" as const },
      { label: "😐  Fair – some disruptions", value: "fair", impact: "medium" as const },
      { label: "😊  Good – mostly restful", value: "good", impact: "low" as const },
      { label: "😴  Excellent – deep, uninterrupted", value: "excellent", impact: "low" as const },
    ],
  },
  {
    id: "diet",
    icon: Utensils,
    question: "How would you describe your daily diet quality?",
    subtitle: "Poor nutrition amplifies physiological stress responses and reduces recovery capacity.",
    options: [
      { label: "🥗  Very healthy – balanced & nutritious", value: "very_healthy", impact: "low" as const },
      { label: "🍱  Mostly healthy", value: "mostly_healthy", impact: "low" as const },
      { label: "🍔  Average – healthy and junk mixed", value: "average", impact: "medium" as const },
      { label: "🍟  Often unhealthy – high processed food", value: "unhealthy", impact: "high" as const },
      { label: "🍕  Very unhealthy – mostly junk / skipping meals", value: "very_unhealthy", impact: "high" as const },
    ],
  },
];

export default function PredictiveScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [forecastWindow, setForecastWindow] = useState<ForecastWindow>("72H");
  const [powerNapSimulated, setPowerNapSimulated] = useState(false);
  const [actionsChecked, setActionsChecked] = useState([true, true, true]);
  const [sentToWatch, setSentToWatch] = useState(false);

  // ── HR Indicators ──
  const [selectedHRIndicators, setSelectedHRIndicators] = useState<Set<string>>(
    new Set(["leavePatterns", "dutySchedules", "workloadTrends"])
  );
  const toggleHRIndicator = (id: string) => {
    setSelectedHRIndicators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Lifestyle Check-in ──
  const [showLifestyleModal, setShowLifestyleModal] = useState(false);
  const [lifestyleStep, setLifestyleStep] = useState(0);
  const [lifestyleAnswers, setLifestyleAnswers] = useState<Record<string, string>>({});
  const [lifestyleSubmitted, setLifestyleSubmitted] = useState(false);

  const handleLifestyleAnswer = (qid: string, val: string) =>
    setLifestyleAnswers((prev) => ({ ...prev, [qid]: val }));

  const handleLifestyleSubmit = () => {
    setLifestyleSubmitted(true);
    setTimeout(() => {
      setLifestyleSubmitted(false);
      setShowLifestyleModal(false);
      setLifestyleStep(0);
    }, 2800);
  };

  const openLifestyleModal = () => {
    setLifestyleStep(0);
    setLifestyleAnswers({});
    setLifestyleSubmitted(false);
    setShowLifestyleModal(true);
  };

  const toggleAction = (idx: number) => {
    setActionsChecked((prev) =>
      prev.map((val, i) => (i === idx ? !val : val))
    );
  };

  const handleSendToWatch = () => {
    setSentToWatch(true);
    setTimeout(() => setSentToWatch(false), 3500);
  };

  const currentGeneralScore = powerNapSimulated ? 49 : 67;

  // ── Composite HR stress score from selected indicators ──
  const hrStressScore =
    selectedHRIndicators.size === 0
      ? 0
      : Math.round(
          Array.from(selectedHRIndicators).reduce((sum, id) => {
            const ind = hrIndicators.find((h) => h.id === id);
            return sum + (ind?.stressContrib ?? 0);
          }, 0) / selectedHRIndicators.size
        );

  return (
    <div
      className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${theme === "bright"
          ? "bg-[#f8fafc] text-[#0f172a]"
          : "bg-[#070e16] text-slate-100"
        }`}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* ================= MONITOR TOPBAR / ALERT STRIP ================= */}
      <div
        className={`border-b px-4 sm:px-6 lg:px-8 py-3 transition-colors ${theme === "bright"
            ? "bg-white border-slate-200 shadow-sm"
            : "bg-slate-950/80 border-slate-800"
          }`}
      >
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-4">
          {/* Health Status Alert Banner */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse" />
              <span>HEALTH STATUS ALERT</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-900 dark:text-white font-bold">
                Status: Elevated Fatigue Alert
              </span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>

            <div className="hidden md:flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-800 pl-3">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Local Time: 20:15 IST</span>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl font-semibold">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Biometric Sync: Continuous 72H Active</span>
            </div>
          </div>

          {/* Right Controls: Forecast Selector & SOS Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                FORECAST:
              </span>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800">
                {(["24H", "48H", "72H"] as ForecastWindow[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setForecastWindow(w)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${forecastWindow === w
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    {w} {w === "72H" ? "ACTIVE" : ""}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("SOS Urgent Help Broadcasted to Field Medic & Command!")}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white px-4 py-2 font-mono text-xs font-extrabold shadow-lg shadow-rose-600/30 transition-all"
            >
              <Zap className="h-4 w-4" />
              <span>⚡ SOS URGENT HELP</span>
            </button>
          </div>
        </div>
      </div>
      {/* ================= MAIN DASHBOARD CONTENT (3-COLUMN GRID MATCHING SCREENSHOT) ================= */}

      <main className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ================= COLUMN 1 (LEFT 4 COLS): BIOMETRIC & RISK TIMELINE ================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Card 1: CURRENT BIOMETRIC METRIC */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
                }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  CURRENT BIOMETRIC METRIC
                </span>
                <span className="rounded-full bg-amber-500 text-white px-3 py-1 font-mono text-[10px] font-extrabold uppercase shadow-sm">
                  HIGH STRESS
                </span>
              </div>

              {/* Big Score Number */}
              <div className="mt-5 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-6xl font-black text-amber-500 tracking-tight">
                    {currentGeneralScore}
                  </span>
                  <span className="font-mono text-base font-bold text-slate-700 dark:text-slate-300">
                    / 100 Stress
                  </span>
                </div>

                <span className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-2.5 py-1 font-mono text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                  ↗ +42% today
                </span>
              </div>

              {/* High Fatigue Alert Window Callout Box */}
              <div className="mt-5 rounded-2xl border border-amber-400/60 bg-amber-50 dark:bg-amber-950/30 p-4">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-900 dark:text-amber-300">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white font-bold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <span>HIGH FATIGUE ALERT WINDOW:</span>
                  <span className="text-slate-900 dark:text-white font-extrabold">02:00 - 06:00 AM</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-800 dark:text-amber-200/90 font-sans">
                  High exhaustion peak anticipated in early shift. Reaction latency and situational focus estimated to decrease by <strong className="text-amber-600 dark:text-amber-400">~34%</strong> without counter-rest.
                </p>
              </div>
            </div>

            {/* Card 2: Risk Timeline & Predicted Risk Drivers (Matching Image) */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
                }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Risk Timeline
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg font-bold border border-slate-200 dark:border-slate-800">
                  Chronological Trajectory
                </span>
              </div>

              {/* Horizontal Timeline Bar */}
              <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 font-mono text-xs">
                <div className="grid grid-cols-4 gap-2 text-center items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">NOW</span>
                    <div className="h-1 w-full bg-emerald-400 my-2 rounded-full" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold block">LOW</span>
                    <span className="text-[10px] text-slate-500 block">Normal</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">+6 HRS</span>
                    <div className="h-1 w-full bg-amber-400 my-2 rounded-full" />
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-extrabold block">MODERATE</span>
                    <span className="text-[10px] text-slate-500 block">Fatigue ↑</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">+12 HRS</span>
                    <div className="h-1 w-full bg-amber-400 my-2 rounded-full" />
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-extrabold block">MODERATE</span>
                    <span className="text-[10px] text-slate-500 block">Heat Exp. ↑</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">+24 HRS</span>
                    <div className="h-1 w-full bg-rose-500 my-2 rounded-full animate-pulse" />
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-extrabold block">HIGH</span>
                    <span className="text-[10px] text-slate-500 block">Alert</span>
                  </div>
                </div>
              </div>

              {/* PREDICTED RISK DRIVERS Segmented Progress Bars (From Screenshot) */}
              <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between font-mono text-[11px] mb-4">
                  <span className="font-bold text-slate-900 dark:text-white uppercase">
                    PREDICTED RISK DRIVERS
                  </span>
                  <span className="text-slate-500 uppercase font-semibold">
                    IMPACT WEIGHTING
                  </span>
                </div>

                <div className="flex flex-col gap-4 font-mono text-xs">
                  {/* Fatigue (78%) */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-24 text-slate-900 dark:text-slate-200 font-bold">Fatigue</span>
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-rose-500" />
                      ))}
                      {[7, 8].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-slate-200 dark:bg-slate-800" />
                      ))}
                    </div>
                    <strong className="w-10 text-right text-rose-600 dark:text-rose-400 font-extrabold">78%</strong>
                  </div>

                  {/* Workload (69%) */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-24 text-slate-900 dark:text-slate-200 font-bold">Workload</span>
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-amber-500" />
                      ))}
                      {[6, 7, 8].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-slate-200 dark:bg-slate-800" />
                      ))}
                    </div>
                    <strong className="w-10 text-right text-amber-600 dark:text-amber-400 font-extrabold">69%</strong>
                  </div>

                  {/* Environment (61%) */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-24 text-slate-900 dark:text-slate-200 font-bold">Environment</span>
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-orange-500" />
                      ))}
                      {[6, 7, 8].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-slate-200 dark:bg-slate-800" />
                      ))}
                    </div>
                    <strong className="w-10 text-right text-orange-600 dark:text-orange-400 font-extrabold">61%</strong>
                  </div>

                  {/* Stress (48%) */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-24 text-slate-900 dark:text-slate-200 font-bold">Stress</span>
                    <div className="flex-1 h-3 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-sky-500" />
                      ))}
                      {[5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-3 flex-1 rounded-sm bg-slate-200 dark:bg-slate-800" />
                      ))}
                    </div>
                    <strong className="w-10 text-right text-sky-600 dark:text-sky-400 font-extrabold">48%</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= COLUMN 2 (CENTER 4 COLS): ENVIRONMENTAL SENSORS & PREDICTIONS ================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Environmental Sensors Card Grid */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
                }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Wind className="h-4 w-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Environmental Sensors
                  </h3>
                </div>
                <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  SYNCED
                </span>
              </div>

              {/* 4 Sensor Grid Cards */}
              <div className="mt-5 grid grid-cols-2 gap-3 font-mono">
                {/* 1. Ambient Temp */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-bold">Ambient Temp</span>
                    <span className="text-amber-500">🌡️</span>
                  </div>
                  <strong className="text-2xl font-black text-slate-900 dark:text-white">36.5°C</strong>
                  <span className="rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300 text-center">
                    Heat Index Caution
                  </span>
                </div>

                {/* 2. Humidity */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-bold">Humidity</span>
                    <span className="text-cyan-500">💧</span>
                  </div>
                  <strong className="text-2xl font-black text-slate-900 dark:text-white">72%</strong>
                  <span className="rounded bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 px-1.5 py-0.5 text-[9px] font-bold text-cyan-700 dark:text-cyan-300 text-center">
                    Elevated Wetness
                  </span>
                </div>

                {/* 3. Thermal Strain */}
                <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 p-4 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-bold">Thermal Strain</span>
                    <span className="text-rose-500">🚨</span>
                  </div>
                  <strong className="text-2xl font-black text-rose-600 dark:text-rose-400">HIGH</strong>
                  <span className="rounded bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-800 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:text-rose-300 text-center">
                    Exertion Alert
                  </span>
                </div>

                {/* 4. Noise Level */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-bold">Noise Level</span>
                    <Volume2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <strong className="text-2xl font-black text-slate-900 dark:text-white">74 dB</strong>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 text-center">
                    Standard Safe
                  </span>
                </div>
              </div>
            </div>

            {/* Early Warning Predictions Card */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
                }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Early Warning Predictions
                  </h3>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block mt-2 font-medium">
                What happens next (Tactical forecast)
              </span>

              {/* Sub-Card 1: Critical Window (Amber) */}
              <div className="mt-4 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <strong className="font-mono text-xs font-extrabold text-amber-900 dark:text-amber-300 block">
                    02:00 AM – 06:00 AM Critical Window
                  </strong>
                  <p className="mt-1 text-xs leading-relaxed text-slate-800 dark:text-amber-200/90 font-sans">
                    Projected <strong className="text-amber-600 dark:text-amber-400">34% drop in reaction speed</strong> and rapid situational focus degradation during night cycle.
                  </p>
                </div>
              </div>

              {/* Sub-Card 2: Cognitive Threshold (Red) */}
              <div className="mt-3 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 p-4 flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white font-bold mt-0.5">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <strong className="font-mono text-xs font-extrabold text-rose-900 dark:text-rose-300 block">
                    Cognitive Threshold: +18 Hours
                  </strong>
                  <p className="mt-1 text-xs leading-relaxed text-slate-800 dark:text-rose-200/90 font-sans">
                    Cognitive fatigue threshold expected to breach without timely saline electrolyte rehydration and thermal cooling.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ================= COLUMN 3 (RIGHT 4 COLS): ACTION PLAN & SEND TO WEARABLE ================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Action Plan Card */}
            <div
              className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${theme === "bright"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/80 border-slate-800 shadow-xl"
                }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <ListTodo className="h-4 w-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Action Plan
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold">
                  3 Pending
                </span>
              </div>

              {/* 3 Step Action Items */}
              <div className="mt-5 flex flex-col gap-4">
                {/* 01 */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-mono text-xs font-black">
                    01
                  </div>
                  <div>
                    <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                      45-min Rest Interval
                    </strong>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-sans">
                      Mandatory horizontal micro-sleep prior to night shift transition to mitigate cognitive latency.
                    </p>
                  </div>
                </div>

                {/* 02 */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-black">
                    02
                  </div>
                  <div>
                    <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                      Hydration &amp; Salts
                    </strong>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-sans">
                      Consume 750ml electrolyte fluid to counter continuous 36.5°C thermal heat exposure.
                    </p>
                  </div>
                </div>

                {/* 03 */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-mono text-xs font-black">
                    03
                  </div>
                  <div>
                    <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                      Autonomic Breathing
                    </strong>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-sans">
                      Conduct 4-4-4-4 tactical box breathing to down-regulate sympathetic cortisol overload.
                    </p>
                  </div>
                </div>
              </div>

              {/* Large Green Action Button at Bottom */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSendToWatch}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-mono text-sm font-black py-4 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>SEND PLAN TO WEARABLE</span>
                </button>

                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 text-center block mt-2 font-medium">
                  Syncs to Tactical Smartband ID #NX-889
                </span>

                {/* Confirmation Message */}
                <AnimatePresence>
                  {sentToWatch && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 text-center font-mono text-xs text-emerald-700 dark:text-emerald-300 font-bold"
                    >
                      ✓ Transmitted action directives to soldier&apos;s smartband!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            HR STRESS INDICATORS — Full-width section below the 3-col grid
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="mt-8">
          <div
            className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl transition-colors ${
              theme === "bright"
                ? "bg-white border-slate-200 shadow-sm"
                : "bg-slate-900/80 border-slate-800 shadow-xl"
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                    theme === "bright"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                      : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                    HR Stress Indicators
                  </h2>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Toggle indicators to include them in your personalised stress forecast
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`font-mono text-[11px] px-3 py-1.5 rounded-xl font-bold border ${
                    selectedHRIndicators.size > 0
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                      : theme === "bright"
                        ? "bg-slate-100 border-slate-200 text-slate-500"
                        : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  {selectedHRIndicators.size} / {hrIndicators.length} Active
                </span>
                <button
                  id="lifestyle-checkin-btn"
                  type="button"
                  onClick={openLifestyleModal}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Lifestyle Check-in</span>
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* ── LEFT: Indicator Selector Cards ── */}
              <div className="lg:col-span-7">
                <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Click any card to toggle it on or off. Active indicators are averaged into the composite stress score.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hrIndicators.map((ind) => {
                    const isSelected = selectedHRIndicators.has(ind.id);
                    const IndIcon = ind.icon;
                    return (
                      <button
                        key={ind.id}
                        id={`hr-indicator-${ind.id}`}
                        type="button"
                        onClick={() => toggleHRIndicator(ind.id)}
                        className={`text-left rounded-2xl border p-4 transition-all duration-200 ${
                          isSelected
                            ? ind.impactColor === "rose"
                              ? "border-rose-400/70 bg-rose-50 dark:bg-rose-950/25 shadow-md shadow-rose-500/10 ring-1 ring-rose-400/25"
                              : "border-amber-400/70 bg-amber-50 dark:bg-amber-950/25 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/25"
                            : theme === "bright"
                              ? "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                              : "border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                isSelected
                                  ? ind.impactColor === "rose" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                                  : theme === "bright" ? "bg-slate-200 text-slate-500" : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              <IndIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <span
                                className={`font-mono text-xs font-extrabold block ${
                                  isSelected
                                    ? ind.impactColor === "rose" ? "text-rose-900 dark:text-rose-300" : "text-amber-900 dark:text-amber-300"
                                    : "text-slate-900 dark:text-slate-200"
                                }`}
                              >
                                {ind.label}
                              </span>
                              <span className="font-mono text-[10px] text-slate-500 mt-0.5 block">{ind.stat}</span>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${
                              isSelected
                                ? ind.impactColor === "rose"
                                  ? "bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                                  : "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                                : theme === "bright"
                                  ? "bg-slate-100 border-slate-200 text-slate-400"
                                  : "bg-slate-800 border-slate-700 text-slate-500"
                            }`}
                          >
                            {ind.impact}
                          </span>
                        </div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className={`text-[11px] leading-relaxed font-sans overflow-hidden ${
                                ind.impactColor === "rose"
                                  ? "text-rose-800 dark:text-rose-200/80"
                                  : "text-amber-800 dark:text-amber-200/80"
                              }`}
                            >
                              {ind.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── RIGHT: Impact Visualization ── */}
              <div className="lg:col-span-5 flex flex-col gap-4">

                {/* Composite Score */}
                <div
                  className={`rounded-2xl border p-5 ${
                    theme === "bright" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
                    COMPOSITE HR STRESS SCORE
                  </span>
                  <div className="flex items-end gap-3 mb-3">
                    <span
                      className={`font-mono text-6xl font-black transition-colors duration-500 ${
                        hrStressScore >= 65 ? "text-rose-500" :
                        hrStressScore >= 45 ? "text-amber-500" :
                        hrStressScore > 0  ? "text-emerald-500" : "text-slate-400"
                      }`}
                    >
                      {hrStressScore}
                    </span>
                    <span className="font-mono text-base text-slate-500 mb-2">/ 100</span>
                    <span
                      className={`mb-2 font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
                        hrStressScore >= 65
                          ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800"
                          : hrStressScore >= 45
                            ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                            : hrStressScore > 0
                              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                              : theme === "bright"
                                ? "bg-slate-100 border-slate-200 text-slate-400"
                                : "bg-slate-800 border-slate-700 text-slate-500"
                      }`}
                    >
                      {hrStressScore >= 65 ? "HIGH RISK" :
                       hrStressScore >= 45 ? "MODERATE" :
                       hrStressScore > 0  ? "LOW RISK" : "NO DATA"}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        hrStressScore >= 65 ? "bg-rose-500" :
                        hrStressScore >= 45 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${hrStressScore}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-slate-500">
                    Averaging {selectedHRIndicators.size} selected indicator{selectedHRIndicators.size !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Contribution Bars */}
                {selectedHRIndicators.size > 0 ? (
                  <div
                    className={`rounded-2xl border p-5 flex flex-col gap-4 ${
                      theme === "bright" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      INDICATOR CONTRIBUTIONS
                    </span>
                    {hrIndicators
                      .filter((i) => selectedHRIndicators.has(i.id))
                      .map((ind) => (
                        <div key={ind.id} className="flex items-center gap-3 font-mono text-[11px]">
                          <span
                            className={`w-28 font-bold truncate shrink-0 ${
                              ind.impactColor === "rose"
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {ind.label}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                ind.impactColor === "rose" ? "bg-rose-500" : "bg-amber-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${ind.stressContrib}%` }}
                              transition={{ duration: 0.75, ease: "easeOut" }}
                            />
                          </div>
                          <span
                            className={`w-8 text-right font-extrabold shrink-0 ${
                              ind.impactColor === "rose"
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {ind.stressContrib}%
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl border border-dashed p-6 flex flex-col items-center justify-center text-center gap-2 ${
                      theme === "bright" ? "border-slate-300 bg-slate-50" : "border-slate-700 bg-slate-950"
                    }`}
                  >
                    <BarChart3 className="h-8 w-8 text-slate-400" />
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Select at least one HR indicator to see the contribution breakdown
                    </p>
                  </div>
                )}

                {/* Lifestyle status reminder */}
                {Object.keys(lifestyleAnswers).length === 0 ? (
                  <button
                    type="button"
                    onClick={openLifestyleModal}
                    className={`rounded-2xl border border-dashed p-4 flex items-center gap-3 text-left w-full transition hover:shadow-sm ${
                      theme === "bright"
                        ? "border-slate-300 bg-slate-50 hover:border-violet-300"
                        : "border-slate-700 bg-slate-950 hover:border-violet-700"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">Lifestyle factors pending</p>
                      <p className="font-sans text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Tap to complete the check-in and factor personal habits into your forecast.
                      </p>
                    </div>
                  </button>
                ) : (
                  <div
                    className={`rounded-2xl border p-4 flex items-center gap-3 ${
                      theme === "bright"
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-emerald-800/60 bg-emerald-950/20"
                    }`}
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">Lifestyle data recorded</p>
                      <p className="font-sans text-[11px] text-emerald-600/80 dark:text-emerald-400/70 mt-0.5">
                        {Object.keys(lifestyleAnswers).length} of {lifestyleQuestions.length} factors logged · Forecast updated
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t px-4 sm:px-8 py-3 font-mono text-[10px] flex flex-wrap items-center justify-between gap-4 transition-colors ${
          theme === "bright"
            ? "bg-white border-slate-200 text-slate-600"
            : "bg-slate-950/90 border-slate-800 text-slate-500"
        }`}
      >
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Biometric Mesh Active // Continuous 72H Forecast Engine</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Encrypted BLE-5.4 Link</span>
          <span>Zero Surveillance Logging</span>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════
          LIFESTYLE CHECK-IN MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showLifestyleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-violet-400 uppercase font-bold">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Confidential Lifestyle Check-in</span>
                  </div>
                  <button
                    type="button"
                    id="close-lifestyle-modal"
                    onClick={() => { setShowLifestyleModal(false); setLifestyleStep(0); }}
                    className="text-slate-400 hover:text-white transition rounded-lg p-1 hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {!lifestyleSubmitted && (
                  <>
                    <div className="mt-4 flex items-center gap-1.5">
                      {lifestyleQuestions.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < lifestyleStep ? "bg-violet-500" :
                            i === lifestyleStep ? "bg-violet-400" : "bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <p className="font-mono text-[10px] text-slate-500">Question {lifestyleStep + 1} of {lifestyleQuestions.length}</p>
                      <p className="font-mono text-[10px] text-slate-500">{Object.keys(lifestyleAnswers).length} answered</p>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[72vh] overflow-y-auto">
                {lifestyleSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center gap-4 py-10"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-white">Check-in Complete!</h4>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs mx-auto font-sans">
                        Your lifestyle factors have been recorded and will be incorporated into your personalised stress forecast.
                      </p>
                    </div>
                    <div className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-3 font-mono text-xs text-emerald-400 text-center font-bold">
                      ✓ Lifestyle profile updated · Forecast recalibrating...
                    </div>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    {(() => {
                      const q = lifestyleQuestions[lifestyleStep];
                      const QIcon = q.icon;
                      return (
                        <motion.div
                          key={lifestyleStep}
                          initial={{ opacity: 0, x: 28 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -28 }}
                          transition={{ duration: 0.18 }}
                        >
                          {/* Question header */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 mt-0.5">
                              <QIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-base font-extrabold text-white leading-tight">{q.question}</h4>
                              <p className="font-sans text-xs text-slate-400 leading-relaxed mt-1">{q.subtitle}</p>
                            </div>
                          </div>

                          {/* MCQ Options */}
                          <div className="flex flex-col gap-2.5 mt-5">
                            {q.options.map((opt) => {
                              const isSel = lifestyleAnswers[q.id] === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => handleLifestyleAnswer(q.id, opt.value)}
                                  className={`w-full text-left px-4 py-3 rounded-xl border font-sans text-sm font-medium transition-all duration-150 ${
                                    isSel
                                      ? opt.impact === "high"
                                        ? "border-rose-500/60 bg-rose-950/40 text-rose-200 shadow-sm ring-1 ring-rose-500/30"
                                        : opt.impact === "medium"
                                          ? "border-amber-500/60 bg-amber-950/40 text-amber-200 shadow-sm ring-1 ring-amber-500/30"
                                          : "border-emerald-500/60 bg-emerald-950/40 text-emerald-200 shadow-sm ring-1 ring-emerald-500/30"
                                      : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600 hover:bg-slate-900 hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="flex-1">{opt.label}</span>
                                    {isSel && (
                                      <span
                                        className={`shrink-0 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                                          opt.impact === "high"
                                            ? "bg-rose-900/60 text-rose-400 border-rose-800"
                                            : opt.impact === "medium"
                                              ? "bg-amber-900/60 text-amber-400 border-amber-800"
                                              : "bg-emerald-900/60 text-emerald-400 border-emerald-800"
                                        }`}
                                      >
                                        {opt.impact === "high" ? "↑ STRESS" : opt.impact === "medium" ? "~ MODERATE" : "✓ HEALTHY"}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Navigation */}
                          <div className="flex items-center justify-between mt-6">
                            <button
                              type="button"
                              onClick={() => setLifestyleStep((s) => Math.max(0, s - 1))}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold border transition ${
                                lifestyleStep === 0
                                  ? "opacity-0 pointer-events-none"
                                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                              }`}
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                              Back
                            </button>

                            {lifestyleStep < lifestyleQuestions.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => { if (lifestyleAnswers[q.id]) setLifestyleStep((s) => s + 1); }}
                                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition ${
                                  lifestyleAnswers[q.id]
                                    ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 active:scale-95"
                                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                                }`}
                              >
                                Next
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => { if (lifestyleAnswers[q.id]) handleLifestyleSubmit(); }}
                                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition ${
                                  lifestyleAnswers[q.id]
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95"
                                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                                }`}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Submit
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
