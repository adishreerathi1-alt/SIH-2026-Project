import React, { useState } from "react";
import type { Route } from "./+types/employee";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Sliders,
  CheckCircle2,
  Lock,
  ChevronDown,
  ArrowRight,
  User,
  Info,
  X
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { readLastScan } from "../lib/scanTypes";
import Navbar from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Employee Dashboard - RAKSHAK AI" },
    {
      name: "description",
      content:
        "RAKSHAK AI Employee & Personnel Dashboard. Real-time wellbeing snapshot, biometric sleep, stress, workload, and energy telemetry.",
    },
  ];
}

export default function EmployeeDashboard() {
  const { theme, cycleTheme } = useTheme();
  const { user } = useAuth();

  // Active navigation section
  const [activeTab, setActiveTab] = useState<"overview" | "checkin" | "progress" | "privacy">("overview");

  // Check-in modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [sliderVal, setSliderVal] = useState(3);
  const [checkInSaved, setCheckInSaved] = useState(false);

  // Time filter dropdown state
  const [trendRange, setTrendRange] = useState("Last 7 days");
  const [showRangeMenu, setShowRangeMenu] = useState(false);

  // Fallback personnel metrics if not logged in
  const metrics = user?.metrics ?? {
    score: 72,
    scoreMax: 100,
    scoreLabel: "Stable",
    statusBadge: "You're doing okay",
    statusDesc: "Your latest check-in shows a stable pattern. Keep watching the trend, not a single day.",
    sleepHours: 6.8,
    sleepChange: "+6% vs last week",
    sleepPositive: true,
    stressScore: 3.2,
    stressMax: 5,
    stressChange: "-12% vs last week",
    stressPositive: true,
    workloadScore: 3.5,
    workloadMax: 5,
    workloadChange: "+8% vs last week",
    workloadPositive: false,
    energyScore: 3.8,
    energyMax: 5,
    energyChange: "+9% vs last week",
    energyPositive: true,
    insightHighlight: "Workload is trending down",
    insightNote: "Consistent micro-rest intervals have stabilized stress peaks during field ops.",
    trend: [
      { day: "Mon", score: 68 },
      { day: "Tue", score: 71 },
      { day: "Wed", score: 70 },
      { day: "Thu", score: 74 },
      { day: "Fri", score: 71 },
      { day: "Sat", score: 73 },
      { day: "Sun", score: 72 },
    ],
  };

  const userName = user?.name ?? "Amar";
  const userInitials = user?.initials ?? "AS";

  // Formatted current day & date e.g. "MONDAY, 7 SEPTEMBER"
  const dateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).toUpperCase();

  // Circle gauge math (radius = 48, circumference = 2 * PI * 48 ≈ 301.59)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (metrics.score / 100) * circumference;

  const handleSaveCheckIn = () => {
    setCheckInSaved(true);
    setTimeout(() => {
      setCheckInSaved(false);
      setShowCheckInModal(false);
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        theme === "bright"
          ? "bg-[#edf2f7] text-[#0f172a]"
          : "bg-[#070e16] text-slate-100"
      }`}
    >
      <Navbar />

      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Top Header Row */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {dateString}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
              <span>Good morning, {userName}</span>
            </h1>
          </div>

          {/* Top Right Controls: Theme Toggle & Avatar */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Theme Toggle: Bright & Dark only */}
            <button
              onClick={cycleTheme}
              type="button"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition shadow-sm ${
                theme === "bright"
                  ? "border-amber-300 bg-white text-amber-950 hover:bg-amber-50 shadow-slate-200"
                  : "border-slate-800 bg-slate-900 text-cyan-300 hover:bg-slate-800"
              }`}
              title="Toggle theme (Bright / Dark)"
            >
              {theme === "bright" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Bright</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-cyan-400" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Avatar Circle with User Initials */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-mono text-xs font-black shadow-md border ${
                theme === "bright"
                  ? "bg-slate-900 text-white border-slate-700"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}
              title={`${userName} (${user?.unit ?? "Alpha Squad"})`}
            >
              {userInitials}
            </div>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* HERO CARD: "Your wellbeing snapshot" (Dark Card with circular gauge)  */}
        {/* ===================================================================== */}
        <section
          className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl text-white transition-colors ${
            theme === "bright"
              ? "bg-[#14202e] border border-[#1f3044]"
              : "bg-[#0b1622] border border-slate-800"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{metrics.statusBadge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Your wellbeing snapshot
              </h2>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-sans">
                {metrics.statusDesc}
              </p>

              <button
                type="button"
                onClick={() => setShowCheckInModal(true)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-sans text-xs font-bold shadow-md transition active:scale-95"
              >
                <span>Complete today&apos;s check-in</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Right Circular Gauge */}
            <div className="flex items-center justify-center sm:pr-4">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
                  {/* Background track circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="text-slate-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Progress stroke */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#38bdf8"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Score in center */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {metrics.score}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-0.5">/100</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide mt-0.5">
                    {metrics.scoreLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 4 METRIC CARDS: Sleep, Stress, Workload, Energy                       */}
        {/* ===================================================================== */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Sleep */}
          <div
            className={`rounded-2xl p-5 border transition-all ${
              theme === "bright"
                ? "bg-white border-slate-200/90 shadow-sm text-slate-900"
                : "bg-[#0b1622] border-slate-800/90 shadow-md text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sleep</span>
              <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Moon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {metrics.sleepHours}h
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{metrics.sleepChange}</span>
            </div>
          </div>

          {/* Card 2: Stress */}
          <div
            className={`rounded-2xl p-5 border transition-all ${
              theme === "bright"
                ? "bg-white border-slate-200/90 shadow-sm text-slate-900"
                : "bg-[#0b1622] border-slate-800/90 shadow-md text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Stress</span>
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sliders className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {metrics.stressScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/5</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{metrics.stressChange}</span>
            </div>
          </div>

          {/* Card 3: Workload */}
          <div
            className={`rounded-2xl p-5 border transition-all ${
              theme === "bright"
                ? "bg-white border-slate-200/90 shadow-sm text-slate-900"
                : "bg-[#0b1622] border-slate-800/90 shadow-md text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Workload</span>
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {metrics.workloadScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/5</span>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
              metrics.workloadPositive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            }`}>
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{metrics.workloadChange}</span>
            </div>
          </div>

          {/* Card 4: Energy */}
          <div
            className={`rounded-2xl p-5 border transition-all ${
              theme === "bright"
                ? "bg-white border-slate-200/90 shadow-sm text-slate-900"
                : "bg-[#0b1622] border-slate-800/90 shadow-md text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Energy</span>
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                {metrics.energyScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/5</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{metrics.energyChange}</span>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* BOTTOM ROW: Wellbeing Trend (Chart) + Personal Insight                */}
        {/* ===================================================================== */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Chart Card: Wellbeing trend */}
          <div
            className={`lg:col-span-8 rounded-3xl p-6 border flex flex-col justify-between transition-colors ${
              theme === "bright"
                ? "bg-white border-slate-200/90 shadow-sm text-slate-900"
                : "bg-[#0b1622] border-slate-800/90 shadow-md text-slate-100"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    YOUR JOURNEY
                  </span>
                  <h3 className="text-lg font-bold tracking-tight mt-0.5">
                    Wellbeing trend
                  </h3>
                </div>

                {/* Range Filter Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRangeMenu(!showRangeMenu)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                      theme === "bright"
                        ? "border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800"
                        : "border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200"
                    }`}
                  >
                    <span>{trendRange}</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {showRangeMenu && (
                    <div
                      className={`absolute right-0 top-full mt-1.5 w-36 rounded-xl border p-1 shadow-xl z-20 ${
                        theme === "bright"
                          ? "bg-white border-slate-200 text-slate-800"
                          : "bg-slate-900 border-slate-800 text-slate-200"
                      }`}
                    >
                      {["Last 7 days", "Last 14 days", "Last 30 days"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setTrendRange(option);
                            setShowRangeMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-500/10 hover:text-emerald-500 transition"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom High-Contrast SVG Trend Chart */}
            <div className="mt-6 pt-2">
              <div className="flex items-stretch gap-3 h-48 sm:h-52">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between font-mono text-[10px] text-slate-400 py-1 select-none">
                  <span>100</span>
                  <span>90</span>
                  <span>80</span>
                  <span>70</span>
                  <span>60</span>
                </div>

                {/* Chart Grid Canvas */}
                <div className="flex-1 relative flex flex-col justify-between">
                  {/* Horizontal Guideline lines */}
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
                  <div className="border-b border-slate-300 dark:border-slate-700 w-full" />

                  {/* SVG Trend Line Overlay */}
                  <svg
                    className="absolute inset-0 h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 700 180"
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area fill under curve */}
                    <path
                      d="M 50 144 L 150 130 L 250 135 L 350 117 L 450 130 L 550 121 L 650 126 L 650 180 L 50 180 Z"
                      fill="url(#trendGradient)"
                    />

                    {/* Smooth curve line */}
                    <path
                      d="M 50 144 L 150 130 L 250 135 L 350 117 L 450 130 L 550 121 L 650 126"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {[
                      { x: 50, y: 144 },
                      { x: 150, y: 130 },
                      { x: 250, y: 135 },
                      { x: 350, y: 117 },
                      { x: 450, y: 130 },
                      { x: 550, y: 121 },
                      { x: 650, y: 126 },
                    ].map((pt, i) => (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#0ea5e9"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="hover:scale-150 transition-transform cursor-pointer"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between pl-8 pr-4 mt-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {metrics.trend.map((pt, i) => (
                  <span key={i} className="font-semibold">
                    {pt.day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card: Personal Insight (Dark navy card, high contrast) */}
          <div
            className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between shadow-xl text-white transition-colors ${
              theme === "bright"
                ? "bg-[#14202e] border-[#1f3044]"
                : "bg-[#0b1622] border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PERSONAL INSIGHT
                </span>
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>

              <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                A small win this week
              </h3>

              <div className="mt-8 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {metrics.insightHighlight}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    {metrics.insightNote}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400">
                Protected by RAKSHAK AI
              </span>
              <Link
                to="/wellness"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Full report</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* DAILY CHECK-IN MODAL (When clicking "Complete today's check-in")           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCheckInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowCheckInModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase font-bold">
                <Lock className="h-3.5 w-3.5" />
                <span>100% Confidential Check-in</span>
              </div>

              <h3 className="mt-2 text-xl font-extrabold text-white">
                How are you feeling today, {userName}?
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Log your daily stress &amp; fatigue. This updates your personal snapshot and stays completely private to you.
              </p>

              {/* Slider */}
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">STRESS &amp; STRAIN</span>
                  <span className="font-bold text-cyan-400">{sliderVal} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-2">
                  <span>1: Calm / Rested</span>
                  <span>3: Moderate</span>
                  <span>5: High Strain</span>
                </div>
              </div>

              {checkInSaved ? (
                <div className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Check-in saved to private snapshot!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveCheckIn}
                  className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-95"
                >
                  Save Today&apos;s Check-in
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
