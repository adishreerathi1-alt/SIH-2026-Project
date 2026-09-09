import React, { useEffect, useState } from "react";
import type { Route } from "./+types/tac-sync";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  Shield,
  Activity,
  Heart,
  Zap,
  CheckCircle2,
  Clock,
  Radio,
  Wifi,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  BarChart2,
  Info,
  Smartphone,
  Sliders,
  Send
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RAKSHAK AI // Operational Readiness Assessment HUD" },
    {
      name: "description",
      content: "Personal Baseline & Biometric Factors, Telemetry Stream, Readiness Formula Matrix, and Parameter Breakdown.",
    },
  ];
}

type FeedState = "live" | "loading" | "error";

interface Directive {
  id: string;
  title: string;
  status: "COMPLETED" | "Priority" | "Scheduled";
  detail: string;
  tag: string;
  timeNote?: string;
  done: boolean;
}

const INITIAL_DIRECTIVES: Directive[] = [
  {
    id: "dir-1",
    title: "Hydrate before movement",
    status: "COMPLETED",
    detail: "250 ml electrolyte water in the next 20 min",
    tag: "Recommended",
    done: true,
  },
  {
    id: "dir-2",
    title: "Keep load rotation",
    status: "Priority",
    detail: "Switch bearing side at next checkpoint 04",
    tag: "Due 11:15",
    timeNote: "~27m remaining",
    done: false,
  },
  {
    id: "dir-3",
    title: "Protect recovery window",
    status: "Scheduled",
    detail: "Schedule a 12 min low-stimulus break during downtime",
    tag: "Later today",
    timeNote: "Post Shift 2",
    done: false,
  },
];

export default function TacSync() {
  const { theme } = useTheme();
  const [feedState, setFeedState] = useState<FeedState>("live");
  const [directives, setDirectives] = useState<Directive[]>(INITIAL_DIRECTIVES);
  const [pushedToWatch, setPushedToWatch] = useState(false);
  const [requestedAdjustment, setRequestedAdjustment] = useState(false);

  const toggleDirective = (id: string) => {
    setDirectives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, done: !d.done } : d))
    );
  };

  const completedCount = directives.filter((d) => d.done).length;

  const isBright = theme === "bright";

  const textColorClass = isBright ? "text-slate-950 font-bold" : "text-slate-100";
  const textMutedClass = isBright ? "text-slate-900 font-semibold" : "text-slate-400";

  return (
    <div
      className={`flex flex-col min-h-screen selection:bg-emerald-500/30 selection:text-emerald-900 transition-colors duration-300 ${
        isBright ? "bg-[#f8fafc] text-[#000000]" : "bg-[#050b11] text-slate-100"
      }`}
    >
      {/* Top Shared Navbar */}
      <Navbar />

      {/* ================= SUB-HEADER / HUD TACTICAL BAR ================= */}
      <div
        className={`border-b backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-colors ${
          isBright
            ? "bg-white border-slate-300 shadow-sm text-black"
            : "bg-slate-900/80 border-slate-800 text-slate-200"
        }`}
      >
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-4">
          
          {/* Operational Readiness Sub-Header */}
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-emerald-500" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-mono text-xs sm:text-sm font-black tracking-wider uppercase text-black dark:text-white">
                OPERATIONAL READINESS ASSESSMENT
              </h2>
              <span className="text-slate-400">•</span>
              <span className={`font-mono text-[11px] ${textMutedClass}`}>
                Personal Baseline &amp; Biometric Factors
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                Encrypted Telemetry Link
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/predictive"
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-amber-500/30 bg-slate-100 dark:bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-bold text-slate-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition"
            >
              <BarChart2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>72H Forecast</span>
            </Link>

            <Link
              to="/wellness"
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-teal-500/30 bg-slate-100 dark:bg-teal-500/10 px-3 py-1.5 font-mono text-xs font-bold text-slate-900 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition"
            >
              <Heart className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Wellness Hub</span>
            </Link>

            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 px-2.5 py-1 font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <Wifi className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              <span>AES-256</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MAIN HUD LAYOUT ================= */}
      <main className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        
        {/* TOP SECTION: PRIMARY READINESS CARD (8 COLS) + DECISION SUPPORT RAIL (4 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT / CENTER: PRIMARY READINESS CARD (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-colors ${
                isBright
                  ? "bg-white border-slate-200 text-black"
                  : "bg-slate-900/80 border-slate-800 text-slate-100"
              }`}
            >
              {/* Header inside primary card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-extrabold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                    OPERATIONAL READINESS STATUS
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1 font-mono text-xs font-bold text-slate-800 dark:text-slate-300">
                  Calibrated: <span className="text-emerald-600 dark:text-emerald-400">10:48 Z</span> • <span className="text-cyan-600 dark:text-cyan-400">Continuous Sync</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-black dark:text-white">
                Ready for Steady Mission Tempo.
              </h1>

              {/* Grid: Dial Gauge (Left) + State Copy & Waveform (Right) */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* DIAL GAUGE (5 Cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
                  <div className="relative flex h-48 w-48 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="68"
                        stroke={isBright ? "#e2e8f0" : "#1e293b"}
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="68"
                        stroke="#059669"
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={427}
                        animate={{
                          strokeDashoffset: 427 - (427 * 86) / 100,
                        }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        filter="drop-shadow(0 0 8px rgba(5, 150, 105, 0.4))"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-5xl font-black text-black dark:text-white tracking-tight">
                        86
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                        / 100 PTS
                      </span>
                      <span className="mt-2 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 font-mono text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        READY
                      </span>
                    </div>
                  </div>

                  {/* 3 Key Metric Pills under Dial */}
                  <div className="mt-4 flex items-center justify-center gap-3 font-mono text-xs">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">HRV:</span>
                      <span className="font-black text-slate-950 dark:text-white">68ms</span>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">SpO2:</span>
                      <span className="font-black text-slate-950 dark:text-white">99%</span>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">Temp:</span>
                      <span className="font-black text-amber-600 dark:text-amber-400">36.4°C</span>
                    </div>
                  </div>
                </div>

                {/* STATE COPY & ECG WAVEFORM STREAM (7 Cols) */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      CURRENT STATE ANALYSIS
                    </span>
                    <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-black dark:text-white">
                      Well recovered. Nominal baseline restored overnight.
                    </h3>
                    <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>
                      Multimodal edge fusion combines 12-hour resting cardiac telemetry, circadian sleep architecture, and autonomic stress recovery. No medical limiter detected in the current window.
                    </p>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs font-bold">
                    <span className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 py-1 text-slate-900 dark:text-slate-200">
                      Baseline: <strong className="text-emerald-600 dark:text-emerald-400">+4 pts</strong> vs 06:00
                    </span>

                    <span className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 py-1 text-slate-900 dark:text-slate-200">
                      Confidence: <strong className="text-cyan-600 dark:text-cyan-400">94.2%</strong>
                    </span>

                    <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-3 py-1 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-1">
                      <span>✓</span> Clear for Deployment
                    </span>
                  </div>

                  {/* AUTONOMIC WAVEFORM STREAM BOX */}
                  <div className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-3.5">
                    <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
                      <span className="text-emerald-700 dark:text-emerald-400 uppercase">
                        AUTONOMIC WAVEFORM STREAM
                      </span>
                      <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold">
                        56 BPM (Resting Normal)
                      </span>
                    </div>

                    <div className="relative h-12 w-full overflow-hidden rounded-xl border border-emerald-500/20 bg-slate-950 p-1">
                      <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="h-full w-full">
                        <path
                          d="M0 25 L80 25 L90 10 L100 40 L110 5 L120 35 L130 25 L240 25 L250 10 L260 40 L270 5 L280 35 L290 25 L400 25 L410 10 L420 40 L430 5 L440 35 L450 25 L500 25"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          className="animate-ecg-path"
                        />
                      </svg>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>

          {/* RIGHT RAIL: DECISION SUPPORT (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className={`rounded-3xl border p-6 backdrop-blur-xl shadow-xl transition-colors ${
              isBright
                ? "bg-white border-slate-200 text-black"
                : "bg-slate-900/80 border-slate-800 text-slate-100"
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  DECISION SUPPORT
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1 font-mono text-xs font-black text-slate-900 dark:text-slate-200">
                  {completedCount} / {directives.length} done
                </span>
              </div>

              <h3 className="mt-3 text-lg font-black text-black dark:text-white">
                Actionable Directives
              </h3>

              {/* Directives Checklist */}
              <div className="mt-4 flex flex-col divide-y divide-slate-200 dark:divide-slate-800">
                {directives.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleDirective(item.id)}
                    className="py-3 flex items-start gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition"
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-xs transition ${
                        item.done
                          ? "bg-emerald-500 border-emerald-500 text-slate-950 font-bold"
                          : "border-slate-400 dark:border-slate-700 bg-white dark:bg-slate-950 text-transparent"
                      }`}
                    >
                      ✓
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-mono text-xs font-extrabold ${item.done ? "line-through text-slate-400" : "text-black dark:text-white"}`}>
                          {item.title}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-black uppercase ${
                            item.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : item.status === "Priority"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className={`mt-0.5 text-xs ${textMutedClass}`}>
                        {item.detail}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px]">
                        <span className="rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-1.5 py-0.5 text-amber-900 dark:text-amber-300 font-extrabold">
                          {item.tag}
                        </span>
                        {item.timeNote && (
                          <span className="text-slate-500 font-medium">
                            • {item.timeNote}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPushedToWatch(true);
                    setTimeout(() => setPushedToWatch(false), 3000);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-mono text-xs font-black py-3.5 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Push Directives to Wearable Band</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequestedAdjustment(true);
                    setTimeout(() => setRequestedAdjustment(false), 3000);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold py-3 transition"
                >
                  <Sliders className="h-3.5 w-3.5 text-slate-500" />
                  <span>Request Operational Load Adjustment</span>
                </button>

                <AnimatePresence>
                  {pushedToWatch && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 text-center font-mono text-xs text-emerald-800 dark:text-emerald-300 font-extrabold"
                    >
                      ✓ Directives successfully synced to Smartband ID #884-TK!
                    </motion.div>
                  )}
                  {requestedAdjustment && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-cyan-500/40 bg-cyan-50 dark:bg-cyan-950/60 p-2.5 text-center font-mono text-xs text-cyan-800 dark:text-cyan-300 font-extrabold"
                    >
                      ✓ Load adjustment request logged to Operational Command!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

        {/* ================= OPERATIONAL READINESS FORMULA MATRIX BANNER ================= */}
        <div className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${
          isBright
            ? "bg-white border-slate-200 text-black shadow-sm"
            : "bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl"
        }`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                OPERATIONAL READINESS FORMULA MATRIX
              </span>
              <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base font-extrabold">
                <span className="text-black dark:text-white">Readiness =</span>

                <span className="rounded-lg bg-sky-500/15 border border-sky-500/40 px-3 py-1 text-sky-700 dark:text-sky-300">
                  Physical
                </span>
                <span className="text-slate-400">+</span>

                <span className="rounded-lg bg-purple-500/15 border border-purple-500/40 px-3 py-1 text-purple-700 dark:text-purple-300">
                  Mental
                </span>
                <span className="text-slate-400">+</span>

                <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/40 px-3 py-1 text-emerald-700 dark:text-emerald-300">
                  Recovery
                </span>
                <span className="text-slate-400">+</span>

                <span className="rounded-lg bg-amber-500/15 border border-amber-500/40 px-3 py-1 text-amber-800 dark:text-amber-300">
                  Environment
                </span>
                <span className="text-slate-400">+</span>

                <span className="rounded-lg bg-rose-500/15 border border-rose-500/40 px-3 py-1 text-rose-700 dark:text-rose-300">
                  Operational Load
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <span className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 text-slate-800 dark:text-slate-300">
                Dynamic Multi-Factor Weighting
              </span>
              <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-3 py-1.5 text-emerald-800 dark:text-emerald-300 font-black">
                100% Normalized
              </span>
            </div>
          </div>

          {/* ================= DETAILED PARAMETER TABLE (MATCHING SCREENSHOT 2) ================= */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 font-extrabold">PARAMETER</th>
                  <th className="pb-3 font-extrabold">INPUT SOURCE &amp; TELEMETRY FEED</th>
                  <th className="pb-3 font-extrabold text-center">IMPACT WEIGHT</th>
                  <th className="pb-3 font-extrabold">CURRENT STATE &amp; PROGRESS</th>
                  <th className="pb-3 font-extrabold text-right">OPERATIONAL STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs sm:text-sm font-sans">
                
                {/* Row 1: Fatigue */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-black dark:text-white flex items-center gap-2">
                    <span className="text-base">😴</span> Fatigue
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Sleep / duty duration / activity
                  </td>
                  <td className="py-3.5 font-mono text-center font-black text-slate-900 dark:text-slate-100">
                    <span className="rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5">20%</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-xs font-bold text-black dark:text-white">
                        7.8h restful • REM nominal
                      </span>
                      <div className="h-2 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div className="h-full w-[88%] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-block rounded-lg bg-emerald-500/20 border border-emerald-500/50 px-3 py-1 font-mono text-xs font-black text-emerald-800 dark:text-emerald-300">
                      Optimal
                    </span>
                  </td>
                </tr>

                {/* Row 2: Stress */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-black dark:text-white flex items-center gap-2">
                    <span className="text-base">🧠</span> Stress
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Check-ins + stress trend
                  </td>
                  <td className="py-3.5 font-mono text-center font-black text-slate-900 dark:text-slate-100">
                    <span className="rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5">20%</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-xs font-bold text-black dark:text-white">
                        Galvanic Skin Response Normal
                      </span>
                      <div className="h-2 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div className="h-full w-[82%] rounded-full bg-cyan-500" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-block rounded-lg bg-cyan-500/20 border border-cyan-500/50 px-3 py-1 font-mono text-xs font-black text-cyan-800 dark:text-cyan-300">
                      Stable
                    </span>
                  </td>
                </tr>

                {/* Row 3: Physical state */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-black dark:text-white flex items-center gap-2">
                    <span className="text-base">🏋️</span> Physical state
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    HR / activity / wearable data
                  </td>
                  <td className="py-3.5 font-mono text-center font-black text-slate-900 dark:text-slate-100">
                    <span className="rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5">20%</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-xs font-bold text-black dark:text-white">
                        Vo2 max 51 • Recovery 94%
                      </span>
                      <div className="h-2 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div className="h-full w-[91%] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-block rounded-lg bg-emerald-500/20 border border-emerald-500/50 px-3 py-1 font-mono text-xs font-black text-emerald-800 dark:text-emerald-300">
                      Peak
                    </span>
                  </td>
                </tr>

                {/* Row 4: Environment */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-black dark:text-white flex items-center gap-2">
                    <span className="text-base">🌡️</span> Environment
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Temperature / humidity / AQI
                  </td>
                  <td className="py-3.5 font-mono text-center font-black text-slate-900 dark:text-slate-100">
                    <span className="rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5">15%</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-xs font-bold text-black dark:text-white">
                        32°C • 68% Hum • AQI 42
                      </span>
                      <div className="h-2 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div className="h-full w-[78%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-block rounded-lg bg-amber-500/20 border border-amber-500/50 px-3 py-1 font-mono text-xs font-black text-amber-900 dark:text-amber-300">
                      Moderate Heat
                    </span>
                  </td>
                </tr>

                {/* Row 5: Workload */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-black dark:text-white flex items-center gap-2">
                    <span className="text-base">📋</span> Workload
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Duty hours / intensity
                  </td>
                  <td className="py-3.5 font-mono text-center font-black text-slate-900 dark:text-slate-100">
                    <span className="rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5">15%</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-xs font-bold text-black dark:text-white">
                        Shift 1 completed • 4.2h active
                      </span>
                      <div className="h-2 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div className="h-full w-[85%] rounded-full bg-indigo-500" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-block rounded-lg bg-indigo-500/20 border border-indigo-500/50 px-3 py-1 font-mono text-xs font-black text-indigo-800 dark:text-indigo-300">
                      Controlled
                    </span>
                  </td>
                </tr>

                {/* Row 6: Self check-in */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-black dark:text-white flex items-center gap-2">
                    <span className="text-base">📝</span> Self check-in
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Personnel's response
                  </td>
                  <td className="py-3.5 font-mono text-center font-black text-slate-900 dark:text-slate-100">
                    <span className="rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5">10%</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-xs font-bold text-black dark:text-white">
                        Subjective survey logged 09:30
                      </span>
                      <div className="h-2 w-full max-w-xs rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-slate-300 dark:border-slate-800">
                        <div className="h-full w-[95%] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-block rounded-lg bg-emerald-500/20 border border-emerald-500/50 px-3 py-1 font-mono text-xs font-black text-emerald-800 dark:text-emerald-300">
                      Positive Calibrated
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Table Footer Note */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 pt-3 font-mono text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <div className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Calculated using Rakshak Adaptive Edge Weighting Model v2.4 (Continuously adapting to sensor anomalies)</span>
            </div>
            <div>
              Last recalculation: <strong className="text-black dark:text-white">3 seconds ago</strong>
            </div>
          </div>

        </div>

        {/* ================= 4 BOTTOM TELEMETRY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: HRV */}
          <div className={`rounded-2xl border p-4 transition-colors ${
            isBright ? "bg-white border-slate-200 text-black shadow-sm" : "bg-slate-900/80 border-slate-800 text-slate-100"
          }`}>
            <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              HEART RATE VARIABILITY
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-black text-black dark:text-white">
                68.4 <small className="text-xs font-semibold text-slate-500">ms</small>
              </span>
              <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                +8.2% vs avg
              </span>
            </div>
          </div>

          {/* Card 2: Circadian Phase */}
          <div className={`rounded-2xl border p-4 transition-colors ${
            isBright ? "bg-white border-slate-200 text-black shadow-sm" : "bg-slate-900/80 border-slate-800 text-slate-100"
          }`}>
            <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              CIRCADIAN CORE RHYTHM
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-lg font-black text-black dark:text-white block">
                  Phase 2
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">(Daylight)</span>
              </div>
              <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 font-mono text-[10px] font-extrabold text-cyan-800 dark:text-cyan-300">
                Synchronized
              </span>
            </div>
          </div>

          {/* Card 3: Cognitive Stamina */}
          <div className={`rounded-2xl border p-4 transition-colors ${
            isBright ? "bg-white border-slate-200 text-black shadow-sm" : "bg-slate-900/80 border-slate-800 text-slate-100"
          }`}>
            <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              COGNITIVE STAMINA INDEX
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-black text-black dark:text-white">
                89 <small className="text-xs font-semibold text-slate-500">/ 100</small>
              </span>
              <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                High Focus
              </span>
            </div>
          </div>

          {/* Card 4: UWB Link */}
          <div className={`rounded-2xl border p-4 transition-colors ${
            isBright ? "bg-white border-slate-200 text-black shadow-sm" : "bg-slate-900/80 border-slate-800 text-slate-100"
          }`}>
            <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              UWB SENSOR NETWORK LINK
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-black text-black dark:text-white">
                0.4 <small className="text-xs font-semibold text-slate-500">ms Latency</small>
              </span>
              <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Encrypted
              </span>
            </div>
          </div>

        </div>

      </main>

      {/* ================= HUD FOOTER STATUS STRIP ================= */}
      <footer
        className={`border-t py-3 px-4 sm:px-8 font-mono text-xs transition-colors ${
          isBright
            ? "bg-white border-slate-300 text-black shadow-sm"
            : "bg-slate-950/90 border-slate-800 text-slate-400"
        }`}
      >
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-black dark:text-slate-200">
              Rakshak Operational Defense Grid • Node: IND-NORTH-SEC-09 • Terminal ID: 884-TK-Alpha
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-semibold">
            <span>Protocol: MIL-STD-810G / HIPAA Compliant Edge</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">SYSTEM SECURE // READY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
