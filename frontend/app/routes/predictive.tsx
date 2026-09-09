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
  Info,
  Droplets,
  Volume2,
  Brain,
  ListTodo,
  TrendingDown,
  Wind
} from "lucide-react";
import Navbar from "../components/Navbar";
import { ScreenTabs } from "../components/ScreenTabs";
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

export default function PredictiveScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [forecastWindow, setForecastWindow] = useState<ForecastWindow>("72H");
  const [powerNapSimulated, setPowerNapSimulated] = useState(false);
  const [actionsChecked, setActionsChecked] = useState([true, true, true]);
  const [sentToWatch, setSentToWatch] = useState(false);

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
      </main>

      {/* Footer */}
      <footer
        className={`border-t px-4 sm:px-8 py-3 font-mono text-[10px] flex flex-wrap items-center justify-between gap-4 transition-colors ${theme === "bright"
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
    </div>
  );
}
