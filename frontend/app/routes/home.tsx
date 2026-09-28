import React, { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router";
import {
  Shield,
  Activity,
  Heart,
  Cpu,
  ArrowRight,
  Sparkles,
  BarChart2,
  HeartHandshake,
  Clock,
  Radio,
  ChevronRight,
  Users,
  ClipboardList,
  Check,
  ChevronLeft,
  Pause,
  Play,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "RAKSHAK AI // Biometric Stress & Readiness Intelligence" },
    {
      name: "description",
      content:
        "AI-powered predictive biometric stress and psychological readiness early warning platform for defence squads and high-stakes operational teams.",
    },
  ];
}

type SimulationScenario = "nominal" | "stress" | "recovery";

interface ScenarioData {
  title: string;
  badge: string;
  badgeColor: string;
  readiness: number;
  heartRate: number;
  hrv: number;
  sleepHours: number;
  elevatedCount: number;
  trajectory: string;
  trajectoryPositive: boolean;
  advice: string;
  statusLabel: string;
}

const SCENARIOS: Record<SimulationScenario, ScenarioData> = {
  nominal: {
    title: "Normal Day (Healthy)",
    badge: "READY TO GO",
    badgeColor: "emerald",
    readiness: 88,
    heartRate: 59,
    hrv: 68,
    sleepHours: 7.9,
    elevatedCount: 42,
    trajectory: "+0.4% steady",
    trajectoryPositive: true,
    advice: "Squad vitals are calm and healthy. Regular mission pacing is working well.",
    statusLabel: "Standard Patrol Operations",
  },
  stress: {
    title: "Heavy Fatigue & Heat",
    badge: "FATIGUE WARNING",
    badgeColor: "amber",
    readiness: 61,
    heartRate: 116,
    hrv: 32,
    sleepHours: 5.2,
    elevatedCount: 224,
    trajectory: "+8.4% stress rise",
    trajectoryPositive: false,
    advice: "Heavy marching and heat detected. Recommend a 15-minute cool-down and water break.",
    statusLabel: "Heavy March / Heat Load",
  },
  recovery: {
    title: "Good Sleep & Recovery",
    badge: "FULLY RECOVERED",
    badgeColor: "cyan",
    readiness: 94,
    heartRate: 51,
    hrv: 82,
    sleepHours: 8.4,
    elevatedCount: 16,
    trajectory: "-14.2% fatigue drop",
    trajectoryPositive: true,
    advice: "Good night's sleep restored full focus. Ready for high-focus tasks.",
    statusLabel: "Bivouac Recovery Cycle",
  },
};

const RECOVERY_SCENES = [
  {
    image: "/images/recovery/forest-woman.jpg",
    alt: "A woman resting quietly among trees beside a still lake",
    position: "50% 52%",
    phase: "01 / RESTORE",
    title: "A pause can change the pace.",
    detail: "A quiet moment outdoors gives the nervous system space to settle before the next decision.",
    metric: "Lakeside reset · 4—4 breathing",
  },
  {
    image: "/images/recovery/botanical-rest.jpg",
    alt: "A secluded green retreat beside calm water",
    position: "50% 48%",
    phase: "02 / RESET",
    title: "Find a quieter rhythm.",
    detail: "A restorative setting offers room to slow the breath and return attention to the present.",
    metric: "Quiet focus · operator-led",
  },
  {
    image: "/images/recovery/scenic-water.jpg",
    alt: "Hands holding a clear bottle beside fresh green leaves",
    position: "50% 48%",
    phase: "03 / REPLENISH",
    title: "Return to steady, one step at a time.",
    detail: "Hydration and gentle recovery help people feel supported without turning rest into another task.",
    metric: "Hydration · gentle return",
  },
];

export default function NexusHome() {
  const [stage, setStage] = useState<"intro" | "landing">("intro");
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>("nominal");
  const [activeScene, setActiveScene] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const { theme } = useTheme();
  const { user } = useAuth();
  const current = SCENARIOS[activeScenario];
  const isBright = theme === "bright";

  useEffect(() => {
    const timer = window.setTimeout(() => setStage("landing"), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => {
      setActiveScene((scene) => (scene + 1) % RECOVERY_SCENES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [autoplay]);

  const changeScene = (direction: number) => {
    setActiveScene((scene) => (scene + direction + RECOVERY_SCENES.length) % RECOVERY_SCENES.length);
  };

  const cardStyle = isBright
    ? "bg-white/90 border-[#D7E9E1] text-[#10172D] shadow-[0_10px_35px_rgba(0,143,104,0.08)] backdrop-blur-sm hover:border-[#00A987]/50 hover:shadow-[0_16px_40px_rgba(0,143,104,0.12)] transition-all"
    : "bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl";

  const subCardStyle = isBright
    ? "bg-white/75 border-[#D7E9E1] text-[#10172D] shadow-sm"
    : "bg-slate-950/60 border-slate-800/80 text-white";

  return (
    <div
      className={`flex flex-col min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-300 ${
        isBright ? "bg-transparent text-[#10172D]" : "bg-[#050b11] text-slate-100"
      }`}
    >
      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="RAKSHAK AI introduction"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-500 ${
              isBright
                ? "bg-gradient-to-br from-white via-[#F8FAF6] to-[#EAF4EE] text-[#10172D]"
                : "bg-[#050b11] text-white"
            }`}
          >
            <div
              className={`pointer-events-none absolute h-[500px] w-[500px] rounded-full blur-[140px] ${
                isBright ? "bg-emerald-400/25" : "bg-emerald-500/15"
              }`}
            />
            <button
              type="button"
              onClick={() => setStage("landing")}
              className={`absolute right-6 top-6 rounded-full border px-4 py-1.5 font-mono text-xs font-semibold shadow-sm transition active:scale-95 ${
                isBright
                  ? "border-slate-300 bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  : "border-slate-800 bg-slate-900/90 text-slate-400 hover:text-white"
              }`}
            >
              Skip Intro
            </button>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 px-4 text-center"
            >
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
                  isBright
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                    : "border-emerald-500/30 bg-emerald-950/40 text-emerald-400"
                }`}
              >
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
                <span>Personnel Welfare Intelligence</span>
              </div>

              <h1
                className={`mb-4 font-mono text-6xl font-black tracking-[0.12em] sm:text-7xl md:text-9xl ${
                  isBright ? "text-[#10172D]" : "text-white"
                }`}
              >
                RAKSHAK AI
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className={`mx-auto max-w-xl font-sans text-base font-semibold tracking-wide sm:text-lg md:text-xl ${
                  isBright ? "text-emerald-700" : "text-emerald-400"
                }`}
              >
                Predict stress. Protect personnel earlier.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className={`mt-10 h-[3px] overflow-hidden rounded-full border ${
                isBright ? "border-slate-300 bg-slate-200" : "border-emerald-500/20 bg-emerald-950/80"
              }`}
            >
              <motion.div
                className="h-full w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1, duration: 0.8 }}
              className={`mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] sm:text-xs ${
                isBright ? "text-slate-500" : "text-emerald-300/80"
              }`}
            >
              Initializing Biometric Telemetry
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Shared Navbar with Login Button on Top Right */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Simple, Clear Value Proposition */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 backdrop-blur-md shadow-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  SMART HEALTH &amp; WELFARE MONITOR
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] font-sans">
                Predict stress. <br />
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
                  Support people earlier.
                </span>
              </h1>

              {/* Subtitle in Simple Plain Words */}
              <p
                className={`mt-6 text-base sm:text-lg max-w-2xl leading-relaxed ${
                  isBright ? "text-slate-700 font-medium" : "text-slate-300"
                }`}
              >
                RAKSHAK AI uses simple smart watches to spot dangerous exhaustion, dehydration, and mental stress{" "}
                <strong className="text-cyan-600 dark:text-cyan-400 font-semibold">
                  hours before mistakes or injuries happen
                </strong>
                . It gives leaders clear, practical advice to help teammates rest, hydrate, and stay safe.
              </p>

              {/* Core Destination Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/predictive"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#008F68] via-[#00A987] to-[#078FC2] px-5 py-3.5 font-mono text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition-all hover:brightness-105 active:scale-95"
                >
                  <BarChart2 className="h-4 w-4 text-slate-950 transition-transform group-hover:scale-125" />
                  <span>72H STRESS FORECAST</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/wellness"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 font-mono text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-sm ${
                    isBright
                      ? "border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100"
                      : "border-teal-500/50 bg-teal-950/40 hover:bg-teal-900/50 text-teal-300"
                  }`}
                >
                  <HeartHandshake className="h-4 w-4 text-teal-500" />
                  <span>WELLNESS HUB</span>
                </Link>

                <Link
                  to="/squad"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-mono text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-sm ${
                    isBright
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300"
                  }`}
                >
                  <Users className="h-4 w-4 text-emerald-500" />
                  <span>Squad Readiness</span>
                </Link>

                <Link
                  to="/tac-sync"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-mono text-xs sm:text-sm font-semibold transition-all ${
                    isBright
                      ? "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
                      : "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-800/80"
                  }`}
                >
                  <Activity className="h-4 w-4 text-cyan-500" />
                  <span>Readiness HUD</span>
                </Link>
              </div>

              <div className={`mt-10 grid w-full max-w-2xl grid-cols-3 border-t pt-5 ${
                isBright ? "border-[#D7E9E1]" : "border-slate-800"
              }`}>
                {[
                  { value: "4.2 hrs", label: "Predictive lead time", color: "text-[#008F68]" },
                  { value: "94.7%", label: "Spike accuracy", color: "text-[#078FC2]" },
                  { value: "Zero", label: "Cloud exposure", color: "text-[#E87900]" },
                ].map((metric) => (
                  <div key={metric.label} className="pr-3">
                    <div className={`font-mono text-xl sm:text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    <div className="mt-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Live Interactive Command Center HUD Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/25 to-cyan-500/20 blur-xl opacity-75 -z-10" />

              <div className={`relative rounded-3xl border p-6 backdrop-blur-2xl transition-colors ${cardStyle}`}>
                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        LIVE SENSOR FEED // ALPHA SQUAD
                      </span>
                      <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {user?.name ?? "David Miller"} // Alpha-04
                      </h3>
                    </div>
                  </div>
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    CONNECTED
                  </div>
                </div>

                {/* Scenario Fast-Switcher inside Card */}
                <div className={`mt-4 flex items-center justify-between gap-1 rounded-xl p-1 border ${
                  isBright ? "bg-slate-100 border-slate-200" : "bg-slate-950/70 border-slate-800/70"
                }`}>
                  {(["nominal", "stress", "recovery"] as SimulationScenario[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveScenario(s)}
                      className={`flex-1 rounded-lg py-1.5 text-center font-mono text-[10px] font-bold uppercase transition-all ${
                        activeScenario === s
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : isBright
                          ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      }`}
                    >
                      {s === "nominal" ? "Normal" : s === "stress" ? "Fatigue" : "Rested"}
                    </button>
                  ))}
                </div>

                {/* Main Gauge & Core Metrics */}
                <div className="mt-5 grid grid-cols-12 gap-4 items-center">
                  {/* Gauge */}
                  <div className={`col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl border ${subCardStyle}`}>
                    <div className="relative flex h-28 w-28 items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className={isBright ? "text-slate-200" : "text-slate-800"}
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          fill="transparent"
                          strokeDasharray={251.2}
                          animate={{
                            strokeDashoffset: 251.2 - (251.2 * current.readiness) / 100,
                            stroke:
                              current.readiness > 75
                                ? "#10b981"
                                : current.readiness > 50
                                ? "#f59e0b"
                                : "#ef4444",
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <motion.span
                          key={current.readiness}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-mono text-2xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                          {current.readiness}%
                        </motion.span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          ENERGY
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals Summary */}
                  <div className="col-span-7 grid grid-cols-2 gap-2">
                    <div className={`rounded-xl border p-2.5 ${subCardStyle}`}>
                      <span className="flex items-center gap-1 font-mono text-[9px] text-slate-500 dark:text-slate-400">
                        <Heart className="h-3 w-3 text-rose-500" /> Heart Rate
                      </span>
                      <motion.div
                        key={current.heartRate}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 font-mono text-lg font-extrabold text-slate-900 dark:text-white"
                      >
                        {current.heartRate} <small className="text-[10px] text-slate-400">bpm</small>
                      </motion.div>
                      <span className="font-mono text-[9px] text-slate-400">Resting rate</span>
                    </div>

                    <div className={`rounded-xl border p-2.5 ${subCardStyle}`}>
                      <span className="flex items-center gap-1 font-mono text-[9px] text-slate-500 dark:text-slate-400">
                        <Activity className="h-3 w-3 text-cyan-500" /> Calm Score
                      </span>
                      <motion.div
                        key={current.hrv}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 font-mono text-lg font-extrabold text-cyan-600 dark:text-cyan-300"
                      >
                        {current.hrv} <small className="text-[10px]">ms</small>
                      </motion.div>
                      <span className="font-mono text-[9px] text-slate-400">Nervous system</span>
                    </div>

                    <div className={`col-span-2 rounded-xl border p-2.5 flex items-center justify-between ${subCardStyle}`}>
                      <div>
                        <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400">Sleep Last Night</span>
                        <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-200">
                          {current.sleepHours} Hours
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400">Status</span>
                        <div
                          className={`font-mono text-xs font-bold ${
                            current.trajectoryPositive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {current.badge}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Heartbeat Line */}
                <div className={`mt-4 rounded-xl border p-3 overflow-hidden ${
                  isBright ? "border-slate-200 bg-slate-50" : "border-slate-800/80 bg-slate-950/80"
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Radio className="h-3 w-3 animate-pulse" /> LIVE HEARTBEAT PULSE
                    </span>
                    <span>Smooth Rhythm</span>
                  </div>

                  <div className="relative h-10 w-full flex items-center overflow-hidden">
                    <svg
                      viewBox="0 0 500 60"
                      preserveAspectRatio="none"
                      className="h-full w-full"
                    >
                      <path
                        d="M0,30 L60,30 L70,30 L75,15 L80,48 L88,5 L95,42 L100,30 L160,30 L170,30 L175,15 L180,48 L188,5 L195,42 L200,30 L260,30 L270,30 L275,15 L280,48 L288,5 L295,42 L300,30 L360,30 L370,30 L375,15 L380,48 L388,5 L395,42 L400,30 L460,30 L470,30 L475,15 L480,48 L488,5 L495,42 L500,30"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.2"
                      />
                    </svg>
                  </div>
                </div>

                {/* AI Advice Callout */}
                <motion.div
                  key={current.advice}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 rounded-xl border p-3 font-mono text-xs flex items-start gap-2.5 ${
                    isBright
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-emerald-500/20 bg-emerald-950/20 text-emerald-300"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-800 dark:text-emerald-200">Recommended Action: </span>
                    <span className="text-slate-700 dark:text-slate-300">{current.advice}</span>
                  </div>
                </motion.div>

                {/* Direct Links */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs">
                  <Link
                    to="/wellness"
                    className="font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 group"
                  >
                    <span>Wellness Hub</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    to="/squad"
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 group"
                  >
                    <span>Squad Readiness</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20" aria-labelledby="recovery-scenes-title">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${
                isBright ? "border-[#008F68]/20 bg-white/65 text-[#008F68]" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#00A987]" />
                Recovery is part of readiness
              </div>
              <h2 id="recovery-scenes-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
                A moment to reset. <span className="text-[#008F68]">Space to return.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Small, deliberate recovery moments help people regain steadiness without losing sight of the team.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className={`mr-2 font-mono text-[10px] uppercase tracking-wider ${isBright ? "text-[#506274]" : "text-slate-400"}`}>
                {String(activeScene + 1).padStart(2, "0")} / {String(RECOVERY_SCENES.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setAutoplay((playing) => !playing)}
                aria-pressed={autoplay}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078FC2] ${
                  isBright ? "border-[#D7E9E1] bg-white/80 text-[#10172D] hover:border-[#00A987]" : "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400"
                }`}
              >
                {autoplay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {autoplay ? "Pause" : "Autoplay"}
              </button>
            </div>
          </div>

          <div className="relative isolate min-h-[380px] overflow-hidden rounded-[1.6rem] border border-[#D7E9E1] bg-slate-900 shadow-[0_22px_60px_rgba(16,23,45,0.16)] sm:min-h-[430px]">
            <motion.img
              key={RECOVERY_SCENES[activeScene].image}
              src={RECOVERY_SCENES[activeScene].image}
              alt={RECOVERY_SCENES[activeScene].alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: RECOVERY_SCENES[activeScene].position }}
              initial={{ opacity: 0.7, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/35" />
            <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
              <span className="rounded-full border border-white/45 bg-white/90 px-3 py-1.5 font-mono text-[9px] font-bold tracking-wider text-[#008F68] shadow-sm">
                {RECOVERY_SCENES[activeScene].phase}
              </span>
              <span className="hidden rounded-full border border-white/20 bg-slate-950/45 px-3 py-1.5 font-mono text-[9px] font-semibold tracking-wider text-white sm:inline-flex">
                OPERATOR-LED · PRIVATE BY DESIGN
              </span>
            </div>
            <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
              <button
                type="button"
                onClick={() => changeScene(-1)}
                aria-label="Previous recovery phase"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/90 text-[#10172D] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078FC2]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => changeScene(1)}
                aria-label="Next recovery phase"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/90 text-[#10172D] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078FC2]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div aria-live="polite" className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#008F68]">
                    {RECOVERY_SCENES[activeScene].metric}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-[#10172D] sm:text-2xl">
                    {RECOVERY_SCENES[activeScene].title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#506274] sm:text-sm">
                    {RECOVERY_SCENES[activeScene].detail}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2" aria-label="Recovery phase">
                  {RECOVERY_SCENES.map((scene, index) => (
                    <button
                      key={scene.phase}
                      type="button"
                      onClick={() => setActiveScene(index)}
                      aria-label={`Show ${scene.phase.toLowerCase()} phase`}
                      aria-current={activeScene === index ? "step" : undefined}
                      className={`h-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078FC2] ${
                        activeScene === index ? "w-10 bg-gradient-to-r from-[#008F68] to-[#078FC2]" : "w-5 bg-[#D7E9E1] hover:bg-[#00A987]/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* ================= 4 EASY-TO-UNDERSTAND STEPS ================= */}
      <section className={`py-16 border-t transition-colors ${
        isBright ? "border-[#D7E9E1] bg-transparent" : "border-slate-800/80 bg-slate-900/30"
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-600 dark:text-cyan-400 mb-4">
              <Cpu className="h-3.5 w-3.5" /> HOW IT WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 dark:text-white">
              Simple Steps from Sensor to Care
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              No complicated charts or confusion. Just clear warning signs and easy solutions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`rounded-3xl border p-6 ${cardStyle}`}>
              <span className="font-mono text-xs font-bold text-emerald-500">STEP 1</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Wear &amp; Forget</h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Soldiers wear standard smart bands that track heart rate and body temp silently in the background.
              </p>
            </div>

            <div className={`rounded-3xl border p-6 ${cardStyle}`}>
              <span className="font-mono text-xs font-bold text-cyan-500">STEP 2</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Early Prediction</h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The smart software predicts when exhaustion will peak up to 4 hours in advance.
              </p>
            </div>

            <div className={`rounded-3xl border p-6 ${cardStyle}`}>
              <span className="font-mono text-xs font-bold text-indigo-500">STEP 3</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Clear Reasons</h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Shows exactly why someone is tired (e.g. 2 nights of bad sleep + heavy rucking).
              </p>
            </div>

            <div className={`rounded-3xl border p-6 ${cardStyle}`}>
              <span className="font-mono text-xs font-bold text-teal-500">STEP 4</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Care &amp; Relief</h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Medics and squad leaders can order quick power naps, water, or swap duties before someone collapses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`border-t px-4 py-16 text-center sm:px-6 md:py-20 ${
        isBright ? "border-[#D7E9E1] bg-white/35" : "border-slate-800/80 bg-slate-900/30"
      }`}>
        <div className="mx-auto max-w-3xl">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#008F68]">
            Early support. Stronger teams.
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Readiness starts with the person.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Turn quiet signals into practical, private support—before fatigue becomes a risk.
          </p>
          <Link
            to="/predictive"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#008F68] via-[#00A987] to-[#078FC2] px-5 py-3 font-mono text-xs font-bold text-white shadow-lg shadow-emerald-800/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078FC2]"
          >
            Explore the 72-hour forecast <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={`border-t py-10 transition-colors ${
        isBright ? "border-[#D7E9E1] bg-white/55 text-slate-800" : "border-slate-800/80 bg-[#04080e] text-slate-400"
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-500 font-mono font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="font-mono text-sm font-bold tracking-wider text-slate-900 dark:text-white">
                RAKSHAK AI
              </span>
              <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                Squad Health &amp; Welfare Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <Link to="/" className="hover:text-cyan-500 transition">
              Overview
            </Link>
            <Link to="/wellness" className="hover:text-teal-500 transition">
              Wellness Hub
            </Link>
            <Link to="/predictive" className="hover:text-amber-500 transition">
              Stress Forecast
            </Link>
            <Link to="/squad" className="hover:text-emerald-500 transition">
              Team Readiness
            </Link>
            <Link to="/squad" className="hover:text-emerald-500 transition">
              Squad Readiness
            </Link>
            <Link to="/tac-sync" className="hover:text-cyan-500 transition">
              Readiness HUD
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
