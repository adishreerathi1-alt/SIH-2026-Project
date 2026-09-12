import React, { useMemo, useState } from "react";
import type { Route } from "./+types/debrief";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Headphones,
  Heart,
  Lock,
  Play,
  Radio,
  Watch,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "RAKSHAK AI // Mission Review & Recovery" },
    {
      name: "description",
      content:
        "Simple post-mission review: what happened, heart-rate impact, and a 48-hour recovery plan.",
    },
  ];
}

const STRESS_FACTORS = [
  { id: "physical", label: "Heavy physical work" },
  { id: "night", label: "Night work / little sleep" },
  { id: "heat", label: "High heat & sun" },
  { id: "load", label: "Carried heavy equipment" },
  { id: "danger", label: "Saw injury or danger" },
];

const HR_POINTS = [
  { t: "9:10 AM", bpm: 110, label: "Mission start" },
  { t: "9:18 AM", bpm: 178, label: "Highest stress point" },
  { t: "9:45 AM", bpm: 98, label: "Calming down" },
  { t: "10:10 AM", bpm: 72, label: "Resting heart rate" },
];

export default function MissionReview() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["physical", "night", "load"]);
  const [locked, setLocked] = useState(false);
  const [guideStarted, setGuideStarted] = useState(false);
  const [now] = useState(() => new Date());

  const localTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const chartPath = useMemo(() => {
    const values = [110, 132, 178, 150, 120, 98, 84, 72];
    const min = 60;
    const max = 190;
    const w = 640;
    const h = 180;
    return values
      .map((bpm, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((bpm - min) / (max - min)) * h;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, []);

  const toggleFactor = (id: string) => {
    if (locked) return;
    setSelectedFactors((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownload = () => {
    const blob = new Blob(
      [
        `RAKSHAK AI Mission Review\nIncident #2824-888\nPerson: ${user?.name ?? "Amar"}\nFactors: ${selectedFactors.join(", ")}\nPeak heart rate: 178 BPM\nStatus: ${locked ? "Locked" : "Open"}\n`,
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rakshak-mission-review.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const card = theme === "bright"
    ? "bg-white/90 border-emerald-200 text-[#0f241a]"
    : "bg-slate-900/80 border-slate-800 text-slate-100";

  return (
    <div
      className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${theme === "bright"
          ? "bg-[#edf2f7] text-[#0f172a]"
          : "bg-[#050b11] text-slate-100"
        }`}
    >
      <Navbar />

      <div
        className={`border-b px-4 sm:px-6 lg:px-8 py-3 ${theme === "bright" ? "bg-white/90 border-slate-200" : "bg-slate-950/80 border-slate-800"
          }`}
      >
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider">
                RAKSHAK AI // MISSION REVIEW &amp; RECOVERY
              </span>
              <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-300">
                #2824-888
              </span>
            </div>
            <p className={`font-mono text-[11px] ${theme === "bright" ? "text-slate-600" : "text-slate-400"}`}>
              Private mission notes · {user?.name ?? "Amar"} ({user?.unit ?? "Alpha Squad"}) · North Sector Ridgeline
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <Watch className="h-4 w-4" />
              <span>Sensors: 12/12 connected</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{localTime}</span>
            </div>
            <button
              type="button"
              onClick={() => alert("Urgent help requested. A counselor and medic will be notified.")}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 font-bold shadow-md shadow-rose-600/30"
            >
              SOS / Urgent Help
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <p className={`mb-5 font-mono text-[11px] ${theme === "bright" ? "text-slate-600" : "text-slate-400"}`}>
          Your answers stay private. Only simple, anonymous totals are used for rest planning.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] gap-6">
          <div className="flex flex-col gap-6">
            <section className={`rounded-3xl border p-5 ${card}`}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-bold text-lg">What happened during this mission?</h2>
                <span className="font-mono text-[10px] text-emerald-400">Data verified</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {STRESS_FACTORS.map((factor) => {
                  const on = selectedFactors.includes(factor.id);
                  return (
                    <button
                      key={factor.id}
                      type="button"
                      onClick={() => toggleFactor(factor.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${on
                          ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-200"
                          : theme === "bright"
                            ? "border-slate-200 bg-slate-50 text-slate-700"
                            : "border-slate-800 bg-slate-950/50 text-slate-300"
                        }`}
                    >
                      {on ? "✓ " : ""}
                      {factor.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3">Body & heart rate impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <MetricCard
                  title="Peak heart rate"
                  value="178 BPM"
                  status="ALERT"
                  statusClass="text-rose-400"
                  bar={88}
                  barClass="bg-rose-500"
                  note="Higher than a safe work range"
                  theme={theme}
                />
                <MetricCard
                  title="How fast heart rate came down"
                  value="32 BPM / min"
                  status="GOOD"
                  statusClass="text-emerald-400"
                  bar={78}
                  barClass="bg-emerald-400"
                  note="Body is recovering well"
                  theme={theme}
                />
                <MetricCard
                  title="Time under heavy stress"
                  value="42 minutes"
                  status="WATCH"
                  statusClass="text-amber-400"
                  bar={55}
                  barClass="bg-amber-400"
                  note="Needs extra rest tonight"
                  theme={theme}
                />
              </div>
            </section>

            <section className={`rounded-3xl border p-5 ${card}`}>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-4 w-4 text-rose-400" />
                <h2 className="font-bold text-lg">Heart rate during the mission</h2>
              </div>
              <svg viewBox="0 0 640 200" className="w-full h-48">
                <path d={chartPath} fill="none" stroke="#22d3ee" strokeWidth="3" />
                {[
                  { x: 0, y: 118, label: "Start 110" },
                  { x: 183, y: 14, label: "Highest 178" },
                  { x: 457, y: 137, label: "Calming 98" },
                  { x: 640, y: 163, label: "Resting 72" },
                ].map((pt) => (
                  <g key={pt.label}>
                    <circle cx={pt.x === 640 ? 636 : pt.x} cy={pt.y} r="5" fill="#22d3ee" />
                    <text
                      x={Math.min(Math.max(pt.x, 8), 560)}
                      y={pt.y < 40 ? pt.y + 22 : pt.y - 10}
                      fill={theme === "bright" ? "#0f241a" : "#cbd5e1"}
                      fontSize="11"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[11px] text-slate-400">
                {HR_POINTS.map((pt) => (
                  <div key={pt.t} className="rounded-xl border border-slate-800 px-3 py-2">
                    <div className="text-cyan-300 font-bold">{pt.t}</div>
                    <div>{pt.label}</div>
                    <div>{pt.bpm} BPM</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            <section className={`rounded-3xl border p-5 ${card}`}>
              <h2 className="font-bold text-lg mb-4">48-hour recovery plan</h2>
              <ol className="space-y-4">
                <RecoveryStep
                  step="1"
                  title="Drink water and electrolytes"
                  detail="Done · fluids taken after the mission"
                  state="done"
                />
                <RecoveryStep
                  step="2"
                  title="20-min breathing & cool down"
                  detail={guideStarted ? "In progress · audio guide playing" : "In progress · start when ready"}
                  state="active"
                  action={
                    <button
                      type="button"
                      onClick={() => setGuideStarted(true)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 px-3 py-1.5 text-[11px] font-bold text-cyan-300"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {guideStarted ? "Guide running" : "Start audio guide"}
                    </button>
                  }
                />
                <RecoveryStep
                  step="3"
                  title="Full night sleep (8 hours)"
                  detail="Pending · no extra duty tonight"
                  state="pending"
                />
                <RecoveryStep
                  step="4"
                  title="Morning medical check-in"
                  detail="Scheduled for tomorrow morning"
                  state="scheduled"
                />
              </ol>
            </section>

            <section className={`rounded-3xl border p-5 ${card}`}>
              <h3 className="font-bold mb-3">Review actions</h3>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setLocked(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 py-3 font-mono text-xs font-bold text-slate-950"
                >
                  <Lock className="h-4 w-4" />
                  {locked ? "Review saved & locked" : "Finish review & lock record"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 font-mono text-xs font-bold ${theme === "bright" ? "border-slate-300" : "border-slate-700"
                    }`}
                >
                  <Download className="h-4 w-4" />
                  Download summary
                </button>
                <button
                  type="button"
                  onClick={() => alert("A private counselor request has been sent.")}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 font-mono text-xs font-bold ${theme === "bright" ? "border-slate-300" : "border-slate-700"
                    }`}
                >
                  <Headphones className="h-4 w-4" />
                  Talk to a counselor
                </button>
              </div>
              <p className="mt-4 font-mono text-[10px] text-slate-500 text-center">
                Secure connection · medical record locked after save
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  status,
  statusClass,
  bar,
  barClass,
  note,
  theme,
}: {
  title: string;
  value: string;
  status: string;
  statusClass: string;
  bar: number;
  barClass: string;
  note: string;
  theme: string;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 ${theme === "bright" ? "bg-white/90 border-emerald-200" : "bg-slate-900/80 border-slate-800"
        }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-slate-400">{title}</span>
        <span className={`font-mono text-[10px] font-bold ${statusClass}`}>{status}</span>
      </div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
      <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full ${barClass}`} style={{ width: `${bar}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </div>
  );
}

function RecoveryStep({
  step,
  title,
  detail,
  state,
  action,
}: {
  step: string;
  title: string;
  detail: string;
  state: "done" | "active" | "pending" | "scheduled";
  action?: React.ReactNode;
}) {
  const icon =
    state === "done" ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    ) : state === "active" ? (
      <Radio className="h-4 w-4 text-cyan-400" />
    ) : state === "scheduled" ? (
      <Clock className="h-4 w-4 text-amber-400" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-slate-400" />
    );

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-950 font-mono text-[10px]">
          {step}
        </div>
        {step !== "4" && <div className="mt-1 w-px flex-1 bg-slate-800" />}
      </div>
      <div className="pb-1">
        <div className="flex items-center gap-2 font-semibold text-sm">
          {icon}
          {title}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{detail}</p>
        {action}
      </div>
    </li>
  );
}
