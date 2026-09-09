import React, { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  Shield,
  Activity,
  Heart,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  EyeOff,
  Cpu,
  ArrowRight,
  Sparkles,
  BarChart3,
  BarChart2,
  HeartHandshake,
  Flame,
  Moon,
  Clock,
  Radio,
  Sliders,
  ChevronRight,
  Info,
  Users,
  ClipboardList
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

export default function NexusHome() {
  const [stage, setStage] = useState<"intro" | "landing">("intro");
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>("nominal");
  const { theme } = useTheme();
  const { user } = useAuth();
  const current = SCENARIOS[activeScenario];

  // Auto-advance past the cinematic intro
  useEffect(() => {
    const timer = setTimeout(() => setStage("landing"), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ================= CINEMATIC INTRO ================= */}
      <AnimatePresence>
        {stage === "intro" && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-500 ${theme === "bright"
              ? "bg-gradient-to-br from-white via-[#f8fafc] to-[#edf2f7] text-[#0f172a]"
              : "bg-[#050b11] text-white"
              }`}
          >
            {/* Ambient Background Glow in Intro */}
            <div
              className={`absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${theme === "bright" ? "bg-emerald-400/20" : "bg-emerald-500/15"
                }`}
            />

            {/* Skip Intro button */}
            <button
              onClick={() => setStage("landing")}
              className={`absolute top-6 right-6 px-4 py-1.5 rounded-full border font-mono text-xs font-semibold transition active:scale-95 shadow-sm ${theme === "bright"
                ? "border-slate-300 bg-white/90 text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                : "border-slate-800 bg-slate-900/90 text-slate-400 hover:text-white"
                }`}
            >
              Skip Intro →
            </button>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center px-4 relative z-10"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase mb-4 border ${theme === "bright"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                  : "border-emerald-500/30 bg-emerald-950/40 text-emerald-400"
                  }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Personnel Welfare Intelligence</span>
              </div>

              <h1
                className={`text-6xl sm:text-7xl md:text-9xl font-black tracking-[0.2em] mb-4 font-mono ${theme === "bright" ? "text-[#0f172a]" : "text-white"
                  }`}
              >
                RAKSHAK AI
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className={`text-base sm:text-lg md:text-xl font-semibold tracking-wide font-sans max-w-xl mx-auto ${theme === "bright" ? "text-emerald-700" : "text-emerald-400"
                  }`}
              >
                Predict stress. Protect personnel earlier.
              </motion.p>
            </motion.div>

            {/* Glowing Loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className={`h-[3px] mt-10 overflow-hidden rounded-full border ${theme === "bright"
                ? "bg-slate-200 border-slate-300"
                : "bg-emerald-950/80 border-emerald-500/20"
                }`}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 w-full"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1, duration: 0.8 }}
              className={`mt-4 text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase ${theme === "bright" ? "text-slate-500 font-semibold" : "text-emerald-300/80"
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
      <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
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
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 backdrop-blur-md shadow-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  SMART HEALTH &amp; WELFARE MONITOR
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] font-sans">
                Predict stress. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Support people earlier.
                </span>
              </h1>

              {/* Subtitle in Simple Plain Words */}
              <p className={`mt-6 text-base sm:text-lg max-w-2xl leading-relaxed ${theme === "bright" ? "text-slate-700 font-medium" : "text-slate-300"
                }`}>
                RAKSHAK AI uses simple smart watches to spot dangerous exhaustion, dehydration, and mental stress{" "}
                <strong className="text-emerald-500 font-semibold">hours before mistakes or injuries happen</strong>.
                It gives leaders clear, practical advice to help teammates rest, hydrate, and stay safe.
              </p>

              {/* 3 Core Destination Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/predictive"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-teal-500 px-5 py-3.5 font-mono text-xs sm:text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <BarChart2 className="h-4 w-4 text-slate-950 transition-transform group-hover:scale-125" />
                  <span>72H STRESS FORECAST</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/wellness"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-500/50 bg-teal-950/40 hover:bg-teal-900/50 px-5 py-3.5 font-mono text-xs sm:text-sm font-bold text-teal-300 transition-all active:scale-95 shadow-md shadow-teal-950/30"
                >
                  <HeartHandshake className="h-4 w-4 text-teal-400" />
                  <span>WELLNESS HUB</span>
                </Link>

                <Link
                  to="/debrief"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 px-4 py-3.5 font-mono text-xs sm:text-sm font-bold text-cyan-300 transition-all active:scale-95 shadow-md shadow-cyan-950/30"
                >
                  <ClipboardList className="h-4 w-4 text-cyan-400" />
                  <span>Mission Review</span>
                </Link>

                {user?.role === "commander" && (
                  <Link
                    to="/squad"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-4 py-3.5 font-mono text-xs sm:text-sm font-bold text-emerald-300 transition-all active:scale-95 shadow-md shadow-emerald-950/30"
                  >
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span>Squad Readiness</span>
                  </Link>
                )}

                <Link
                  to="/tac-sync"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3.5 font-mono text-xs sm:text-sm font-semibold text-slate-200 transition-all hover:border-emerald-500/40 hover:bg-slate-800/80"
                >
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <span>Readiness HUD</span>
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="mt-10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>No Invasive Cameras or Audio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>100% Private Health Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Simple Actionable Advice</span>
                </div>
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

              <div className={`relative rounded-3xl border p-6 backdrop-blur-2xl shadow-2xl transition-colors ${theme === "bright"
                ? "bg-white/90 border-slate-200"
                : "bg-slate-900/90 border-slate-800"
                }`}>
                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        LIVE SENSOR FEED // ALPHA SQUAD
                      </span>
                      <h3 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                        {user?.name ?? "Amar"} // Alpha-04
                      </h3>
                    </div>
                  </div>
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                    CONNECTED
                  </div>
                </div>

                {/* Scenario Fast-Switcher inside Card */}
                <div className="mt-4 flex items-center justify-between gap-1 rounded-xl bg-slate-950/70 p-1 border border-slate-800/70">
                  {(["nominal", "stress", "recovery"] as SimulationScenario[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveScenario(s)}
                      className={`flex-1 rounded-lg py-1.5 text-center font-mono text-[10px] font-bold uppercase transition-all ${activeScenario === s
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
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
                  <div className="col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                    <div className="relative flex h-28 w-28 items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-slate-800"
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
                          className="font-mono text-2xl font-black text-white tracking-tight"
                        >
                          {current.readiness}%
                        </motion.span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                          ENERGY
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals Summary */}
                  <div className="col-span-7 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5">
                      <span className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
                        <Heart className="h-3 w-3 text-rose-400" /> Heart Rate
                      </span>
                      <motion.div
                        key={current.heartRate}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 font-mono text-lg font-extrabold text-white"
                      >
                        {current.heartRate} <small className="text-[10px] text-slate-400">bpm</small>
                      </motion.div>
                      <span className="font-mono text-[9px] text-slate-400">Resting rate</span>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5">
                      <span className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
                        <Activity className="h-3 w-3 text-cyan-400" /> Calm Score
                      </span>
                      <motion.div
                        key={current.hrv}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 font-mono text-lg font-extrabold text-cyan-300"
                      >
                        {current.hrv} <small className="text-[10px]">ms</small>
                      </motion.div>
                      <span className="font-mono text-[9px] text-slate-400">Nervous system</span>
                    </div>

                    <div className="col-span-2 rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[9px] text-slate-400">Sleep Last Night</span>
                        <div className="font-mono text-sm font-bold text-slate-200">
                          {current.sleepHours} Hours
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[9px] text-slate-400">Status</span>
                        <div
                          className={`font-mono text-xs font-bold ${current.trajectoryPositive ? "text-emerald-400" : "text-amber-400"
                            }`}
                        >
                          {current.badge}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Heartbeat Line */}
                <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Radio className="h-3 w-3 animate-pulse" /> LIVE HEARTBEAT PULSE
                    </span>
                    <span>Smooth Rhythm</span>
                  </div>

                  <div className="relative h-12 w-full flex items-center overflow-hidden">
                    <svg
                      viewBox="0 0 500 60"
                      preserveAspectRatio="none"
                      className="h-full w-full stroke-emerald-400"
                    >
                      <path
                        d="M0,30 L60,30 L70,30 L75,15 L80,48 L88,5 L95,42 L100,30 L160,30 L170,30 L175,15 L180,48 L188,5 L195,42 L200,30 L260,30 L270,30 L275,15 L280,48 L288,5 L295,42 L300,30 L360,30 L370,30 L375,15 L380,48 L388,5 L395,42 L400,30 L460,30 L470,30 L475,15 L480,48 L488,5 L495,42 L500,30"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.2"
                        className="animate-[tac-v2-line-flow_5s_ease-in-out_infinite]"
                      />
                    </svg>
                  </div>
                </div>

                {/* AI Advice Callout in Simple English */}
                <motion.div
                  key={current.advice}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 font-mono text-xs text-emerald-300 flex items-start gap-2.5"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-200">Recommended Action: </span>
                    <span className="text-slate-300">{current.advice}</span>
                  </div>
                </motion.div>

                {/* Direct Links to Full Screens */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
                  <Link
                    to="/wellness"
                    className="font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 group"
                  >
                    <span>Open Wellness Hub</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    to="/predictive"
                    className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
                  >
                    <span>72H Forecast</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= 4 EASY-TO-UNDERSTAND STEPS ================= */}
      <section className={`py-16 border-t transition-colors ${theme === "bright" ? "border-slate-200 bg-slate-100/60" : "border-slate-800/80 bg-slate-900/30"
        }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400 mb-4">
              <Cpu className="h-3.5 w-3.5" /> HOW IT WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans">
              Simple Steps from Sensor to Care
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              No complicated charts or confusion. Just clear warning signs and easy solutions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <span className="font-mono text-xs font-bold text-emerald-400">STEP 1</span>
              <h3 className="mt-3 text-lg font-bold">Wear &amp; Forget</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Soldiers wear standard smart bands that track heart rate and body temp silently in the background.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <span className="font-mono text-xs font-bold text-cyan-400">STEP 2</span>
              <h3 className="mt-3 text-lg font-bold">Early Prediction</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                The smart software predicts when exhaustion will peak up to 4 hours in advance.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <span className="font-mono text-xs font-bold text-indigo-400">STEP 3</span>
              <h3 className="mt-3 text-lg font-bold">Clear Reasons</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Shows exactly why someone is tired (e.g. 2 nights of bad sleep + heavy rucking).
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <span className="font-mono text-xs font-bold text-emerald-400">STEP 4</span>
              <h3 className="mt-3 text-lg font-bold">Care &amp; Relief</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Medics and squad leaders can order quick power naps, water, or swap duties before someone collapses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800/80 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold">
              R
            </div>
            <div>
              <span className="font-mono text-sm font-bold tracking-wider">
                RAKSHAK AI
              </span>
              <p className="font-mono text-[10px] text-slate-400">
                Squad Health &amp; Welfare Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">
              Overview
            </Link>
            <Link to="/wellness" className="hover:text-teal-400 transition">
              Wellness Hub
            </Link>
            <Link to="/predictive" className="hover:text-amber-400 transition">
              Stress Forecast
            </Link>
            <Link to="/debrief" className="hover:text-cyan-400 transition">
              Mission Review
            </Link>
            {user?.role === "commander" && (
              <Link to="/squad" className="hover:text-emerald-400 transition">
                Squad Readiness
              </Link>
            )}
            <Link to="/tac-sync" className="hover:text-cyan-400 transition">
              Readiness HUD
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
