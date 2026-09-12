import React, { useState } from "react";
import type { Route } from "./+types/squad";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import {
  Shield,
  Users,
  AlertTriangle,
  Clock,
  Watch,
  Search,
  CheckCircle2,
  Lock,
  ArrowRightLeft,
  Flame,
  Volume2,
  Compass,
  Radio,
  Sparkles,
  RefreshCw,
  Send,
  Zap,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "RAKSHAK AI // Squad Readiness & Health Overview [Alpha Team]" },
    {
      name: "description",
      content:
        "Anonymous squad health, fatigue monitoring, team member status cards, and rotation recommendations.",
    },
  ];
}

type FilterState = "all" | "needs-rest" | "getting-tired" | "well-rested";

interface TeamMember {
  id: string;
  code: string;
  name: string;
  role: string;
  readiness: number;
  statusCategory: "well-rested" | "getting-tired" | "needs-rest";
  statusLabel: string;
  restDetail: string;
  shiftHours: number;
  isAlert?: boolean;
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: "01", code: "PERS 01", name: "Amar Sharma", role: "Lead Scout", readiness: 91, statusCategory: "well-rested", statusLabel: "Well Rested", restDetail: "Rest: Optimal", shiftHours: 6 },
  { id: "02", code: "PERS 02", name: "Ajay Verma", role: "Navigator", readiness: 88, statusCategory: "well-rested", statusLabel: "Well Rested", restDetail: "Rest: Good", shiftHours: 7 },
  { id: "03", code: "PERS 03", name: "Priya Patel", role: "Field Medic", readiness: 86, statusCategory: "well-rested", statusLabel: "Well Rested", restDetail: "Rest: Good", shiftHours: 8 },
  { id: "04", code: "PERS 04", name: "Rohit Kumar", role: "Radio Operator", readiness: 72, statusCategory: "getting-tired", statusLabel: "Getting Tired", restDetail: "Rest: Moderate", shiftHours: 14 },
  { id: "05", code: "PERS 05", name: "Vikram Singh", role: "Tech Support", readiness: 58, statusCategory: "needs-rest", statusLabel: "Needs Immediate Rest", restDetail: "Fatigued", shiftHours: 14, isAlert: true },
  { id: "06", code: "PERS 06", name: "Kavita Rao", role: "Communications", readiness: 85, statusCategory: "well-rested", statusLabel: "Well Rested", restDetail: "Rest: Good", shiftHours: 7 },
  { id: "07", code: "PERS 07", name: "Sanjay Dutt", role: "Drone Pilot", readiness: 92, statusCategory: "well-rested", statusLabel: "Well Rested", restDetail: "Rest: Optimal", shiftHours: 4 },
  { id: "08", code: "PERS 08", name: "Neha Gupta", role: "Security Flank", readiness: 87, statusCategory: "well-rested", statusLabel: "Well Rested", restDetail: "Rest: Good", shiftHours: 8 },
];

export default function SquadOverview() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterState>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftSwapSimulated, setShiftSwapSimulated] = useState(false);
  const [remindersSent, setRemindersSent] = useState(false);

  // If shift swap simulated: Vikram Singh goes on rest (88%), Sanjay Dutt takes watch (89%)
  const members = INITIAL_MEMBERS.map((m) => {
    if (!shiftSwapSimulated) return m;
    if (m.id === "05") {
      return {
        ...m,
        role: "Tech Support (Resting)",
        readiness: 88,
        statusCategory: "well-rested" as const,
        statusLabel: "Recovering",
        restDetail: "Rest Break Active",
        shiftHours: 0,
        isAlert: false,
      };
    }
    if (m.id === "07") {
      return {
        ...m,
        role: "Drone Pilot (Rotated)",
        readiness: 89,
        statusCategory: "well-rested" as const,
        statusLabel: "Active On Duty",
        restDetail: "Fresh Crew",
        shiftHours: 1,
      };
    }
    return m;
  });

  const filteredMembers = members.filter((m) => {
    const matchesFilter =
      filter === "all" ? true : m.statusCategory === filter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const wellRestedCount = members.filter((m) => m.statusCategory === "well-rested").length;
  const gettingTiredCount = members.filter((m) => m.statusCategory === "getting-tired").length;
  const needsRestCount = members.filter((m) => m.statusCategory === "needs-rest").length;
  const teamScore = shiftSwapSimulated ? 92 : 84;

  const handleSendReminders = () => {
    setRemindersSent(true);
    setTimeout(() => setRemindersSent(false), 3500);
  };

  const isOfficerOrCommander = user?.role === "commander" || user?.role === "officer";

  if (!isOfficerOrCommander) {
    return (
      <div className={`flex flex-col min-h-screen font-sans ${theme === "bright" ? "bg-[#edf2f7] text-[#0f172a]" : "bg-[#0e1726] text-slate-100"
        }`}>
        <Navbar />
        <main className="mx-auto max-w-xl w-full px-4 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-400">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Officer / Commander Access Required</h1>
          <p className="mt-3 text-sm text-slate-400">
            You are currently signed in as <strong>{user?.name || "Personnel"}</strong>. Team-wide tactical analysis &amp; roster monitoring is reserved for Officers and Command Personnel.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/employee"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition"
            >
              My Dashboard
            </Link>
            <Link
              to="/debrief"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              Mission Review
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${theme === "bright"
        ? "bg-[#edf2f7] text-[#0f172a]"
        : "bg-[#050b11] text-slate-100"
      }`}>
      {/* Top Navbar */}
      <Navbar />

      {/* ================= SQUAD TOP STATUS BAR ================= */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-3 transition-colors ${theme === "bright"
          ? "bg-white/85 border-emerald-200/80 shadow-sm"
          : "bg-slate-950/80 border-slate-800"
        }`}>
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-4">

          {/* Header Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider">
                RAKSHAK AI // SQUAD READINESS &amp; HEALTH OVERVIEW
              </span>
              <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-300 uppercase">
                ALPHA TEAM
              </span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="font-mono text-[11px] text-slate-400 hidden md:inline">
              Anonymous Squad Health &amp; Fatigue Monitor • Team: Alpha Squad (12 Members) • <strong className="text-emerald-500">● {teamScore}% Team Ready (Healthy)</strong>
            </span>
          </div>

          {/* Right Live Indicators */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <Watch className="h-4 w-4" />
              <span>SENSORS: 12/12 Connected</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 border-l border-slate-800 pl-4">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>LOCAL TIME: 6:43 AM</span>
            </div>

            <button
              onClick={() => alert("Urgent Team Alert Broadcasted!")}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white px-3 py-1.5 font-mono text-xs font-bold shadow-md shadow-rose-600/30 transition"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>* URGENT HELP / SOS</span>
            </button>
          </div>

        </div>
      </div>

      {/* ================= SUB-NAVIGATION TABS ================= */}
      <div className={`border-b px-4 sm:px-6 lg:px-8 py-2 text-xs font-mono transition-colors lg:contents ${theme === "bright"
          ? "bg-white/60 border-emerald-200/60"
          : "bg-slate-900/60 border-slate-800"
        }`}>
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider hidden sm:inline">
            LIVE MONITORING ACTIVE
          </span>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">

        {/* Privacy Protected Banner */}
        <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${theme === "bright"
            ? "bg-white/80 border-emerald-200/80 text-emerald-950 shadow-sm"
            : "bg-slate-900/80 border-slate-800 text-slate-300"
          }`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Lock className="h-4 w-4" />
            </div>
            <p className="text-xs leading-relaxed font-sans">
              <strong className="text-emerald-400">Privacy Protected: Group Health Summary Only</strong> — Individual personal thoughts, private check-ins, or counseling chats are never shown to leadership. Only anonymized fatigue levels are displayed to ensure team safety.
            </p>
          </div>
          <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 font-mono text-[10px] text-emerald-400 font-bold shrink-0">
            ENCRYPTED &amp; COMPLIANT
          </span>
        </div>

        {/* Team Summary & Filter Bar */}
        <div className={`rounded-2xl border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${theme === "bright"
            ? "bg-white/85 border-emerald-200/80 shadow-sm"
            : "bg-slate-900/80 border-slate-800 shadow-xl"
          }`}>
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-base">Alpha Team</span>
            <span className="text-xs text-slate-400">(12 Members)</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs">
              Overall Team Readiness:{" "}
              <strong className="text-emerald-400 font-bold font-mono text-sm">
                {teamScore}%
              </strong>{" "}
              <span className="text-slate-400 font-mono text-xs">(Good Condition)</span>
            </span>

            <div className="flex items-center gap-2 ml-2">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                ● {wellRestedCount} Well Rested
              </span>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-400">
                ● {gettingTiredCount} Getting Tired
              </span>
              <span className="rounded-full bg-rose-500/15 border border-rose-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-400">
                ● {needsRestCount} Needs Immediate Rest
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1 font-bold transition ${filter === "all"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              Show All (12)
            </button>
            <button
              onClick={() => setFilter("needs-rest")}
              className={`rounded-lg px-3 py-1 font-bold transition ${filter === "needs-rest"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              Needs Rest ({needsRestCount})
            </button>
            <button
              onClick={() => setFilter("getting-tired")}
              className={`rounded-lg px-3 py-1 font-bold transition ${filter === "getting-tired"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              Getting Tired ({gettingTiredCount})
            </button>
            <button
              onClick={() => setFilter("well-rested")}
              className={`rounded-lg px-3 py-1 font-bold transition ${filter === "well-rested"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
            >
              Well Rested ({wellRestedCount})
            </button>
          </div>
        </div>

        {/* Main Grid: 12 Member Cards (Left) + Decision Rotation & Conditions (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ================= LEFT / CENTER: 12 TEAM MEMBER CARDS (8 cols) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Search & Sync Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  Team Member Status Cards (12 Members)
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search role or member..."
                    className={`rounded-xl border py-1.5 pl-8 pr-3 font-mono text-xs focus:outline-none focus:border-cyan-400 transition ${theme === "bright"
                        ? "bg-white border-emerald-200 text-slate-900"
                        : "bg-slate-950 border-slate-800 text-slate-200"
                      }`}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                  12 OF 12 SYNCED
                </span>
              </div>
            </div>

            {/* 3-Column Grid of 12 Member Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredMembers.map((member) => {
                const isAlert = member.isAlert && !shiftSwapSimulated;
                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-2xl border p-4 transition-all ${isAlert
                        ? "border-rose-500/60 bg-rose-950/20 shadow-md shadow-rose-900/20 ring-1 ring-rose-500/50"
                        : theme === "bright"
                          ? "bg-white/90 border-emerald-200/80 shadow-sm hover:border-emerald-300"
                          : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                      }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">
                        {member.code}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${member.statusCategory === "well-rested"
                            ? "bg-emerald-400"
                            : member.statusCategory === "getting-tired"
                              ? "bg-amber-400"
                              : "bg-rose-400 animate-ping"
                          }`}
                      />
                    </div>

                    {/* Name & Role */}
                    <div className="mt-1 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-extrabold text-base truncate ${theme === "bright" ? "text-slate-900" : "text-white"
                          }`}>
                          {member.name}
                        </h4>
                        {isAlert && (
                          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 ml-1" />
                        )}
                      </div>
                      <span className={`text-xs font-semibold ${theme === "bright" ? "text-emerald-700" : "text-emerald-400"
                        }`}>
                        {member.role}
                      </span>
                    </div>

                    {/* Readiness % & Tag */}
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className={`font-mono text-2xl font-black ${theme === "bright" ? "text-slate-900" : "text-white"
                        }`}>
                        {member.readiness}%
                        <small className="text-[10px] font-normal text-slate-400 ml-1">
                          Readiness
                        </small>
                      </span>

                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${member.statusCategory === "well-rested"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : member.statusCategory === "getting-tired"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          }`}
                      >
                        {member.statusLabel}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                      <div
                        className={`h-full rounded-full ${member.statusCategory === "well-rested"
                            ? "bg-emerald-400"
                            : member.statusCategory === "getting-tired"
                              ? "bg-amber-400"
                              : "bg-rose-500"
                          }`}
                        style={{ width: `${member.readiness}%` }}
                      />
                    </div>

                    {/* Footer Details */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between font-mono text-[10px] text-slate-400">
                      <span>{member.restDetail}</span>
                      <span>Shift: {member.shiftHours}h</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* ================= RIGHT COLUMN: ROTATION ADVISORY & WORKING CONDITIONS ================= */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* Fatigue Alert & Team Rotation */}
            <div className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${theme === "bright"
                ? "bg-white/90 border-emerald-200/80 shadow-sm"
                : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs text-amber-400 font-bold">
                <AlertTriangle className="h-4 w-4" />
                <span>Fatigue Alert &amp; Team Rotation</span>
              </div>

              {/* Notice Box */}
              <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/25 p-3.5">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Notice: Extended Shift Detected</span>
                </div>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed font-sans">
                  3 members have worked over 14 hours with under 4 hours of sleep. Reaction times will slow down by 25% if they do not rest soon.
                </p>
              </div>

              {/* Recommended Action */}
              <div className="mt-4">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  RECOMMENDED ACTION
                </span>
                <p className="mt-1 text-xs text-slate-200 leading-relaxed font-sans">
                  Swap <strong className="text-amber-400">Night Watch (Member 08)</strong> with Fresh Rested Crew <strong className="text-emerald-400">Drone Pilot (Member 09)</strong>. Schedule a 90-minute rest break for Member 04 and Member 05.
                </p>
              </div>

              {/* Interactive Simulation Buttons */}
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  onClick={() => setShiftSwapSimulated(!shiftSwapSimulated)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-mono text-xs font-bold transition-all shadow-md active:scale-95 ${shiftSwapSimulated
                      ? "bg-emerald-500 text-slate-950 shadow-emerald-500/20"
                      : "border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                    }`}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  <span>
                    {shiftSwapSimulated
                      ? "Reset to Original Shift (84%)"
                      : "Preview Team Recovery with Shift Swap"}
                  </span>
                </button>

                <button
                  onClick={handleSendReminders}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 py-3 font-mono text-xs font-bold text-slate-200 transition active:scale-95"
                >
                  <Watch className="h-4 w-4 text-cyan-400" />
                  <span>Send Rest Reminders to Team Smartwatches</span>
                </button>

                {/* Sent confirmation message */}
                <AnimatePresence>
                  {remindersSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-2 text-center font-mono text-[11px] text-emerald-300"
                    >
                      ✓ Dispatched rest alert to Member 04, 05, and 08!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Working Conditions Local Sensors */}
            <div className={`rounded-3xl border p-6 backdrop-blur-xl transition-colors ${theme === "bright"
                ? "bg-white/90 border-emerald-200/80 shadow-sm"
                : "bg-slate-900/80 border-slate-800 shadow-xl"
              }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Compass className="h-4 w-4" /> Working Conditions
                </span>
                <span className="font-mono text-[9px] text-slate-400 uppercase">
                  LOCAL SENSORS
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {/* 1: Outdoor Heat */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Outdoor Heat</strong>
                      <span className="text-[11px] text-slate-400">Hot &amp; Humid — Drink extra water</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-black text-amber-400 block">38°C</span>
                    <span className="font-mono text-[9px] text-amber-500 font-bold">CAUTION</span>
                  </div>
                </div>

                {/* 2: Physical Load */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Physical Load</strong>
                      <span className="text-[11px] text-slate-400">Carrying heavy gear across field</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-black text-cyan-400 block">High</span>
                    <span className="font-mono text-[9px] text-cyan-400 font-bold">ACTIVE</span>
                  </div>
                </div>

                {/* 3: Noise Level */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Volume2 className="h-4 w-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Noise Level</strong>
                      <span className="text-[11px] text-slate-400">Moderate noise, safe with ear protection</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-black text-emerald-400 block">82 dB</span>
                    <span className="font-mono text-[9px] text-emerald-400 font-bold">NOMINAL</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t px-4 sm:px-8 py-3 font-mono text-[10px] flex flex-wrap items-center justify-between gap-4 transition-colors ${theme === "bright"
          ? "bg-white/85 border-emerald-200/80 text-slate-600"
          : "bg-slate-950/90 border-slate-800 text-slate-500"
        }`}>
        <div className="flex items-center gap-2 text-emerald-500 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Alpha Team Squad Mesh Connected // 12 Wearables Online</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Encrypted Squad Telemetry</span>
          <span>Zero-Surveillance Architecture</span>
        </div>
      </footer>
    </div>
  );
}
