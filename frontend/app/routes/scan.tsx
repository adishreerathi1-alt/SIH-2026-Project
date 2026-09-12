import type { Route } from "./+types/scan";
import { Shield, Watch } from "lucide-react";
import Navbar from "../components/Navbar";
import { EmotionVoiceScan } from "../components/EmotionVoiceScan";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RAKSHAK AI // Offline Wellness Scan" },
    {
      name: "description",
      content:
        "Confidential on-device mental-wellness check using facial emotion, voice strain, and NLP. Nothing is uploaded.",
    },
  ];
}

export default function LiveScanPage() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div
      className={`flex flex-col min-h-screen font-sans ${
        theme === "bright" ? "bg-[#edf2f7] text-[#0f172a]" : "bg-[#070e16] text-slate-100"
      }`}
    >
      <Navbar />

      <div
        className={`border-b px-4 sm:px-6 lg:px-8 py-3 ${
          theme === "bright" ? "bg-white border-slate-200" : "bg-slate-950/80 border-slate-800"
        }`}
      >
        <div className="mx-auto max-w-[1720px] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="font-mono text-sm font-extrabold tracking-wider">
                OFFLINE WELLNESS SCAN
              </div>
              <p className="font-mono text-[11px] text-slate-400">
                {user?.fullName ?? user?.name ?? "Personnel"} · stays on this device
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
            <Watch className="h-3.5 w-3.5" />
            No recording stored
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1720px] w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <p className="mb-5 text-sm text-slate-400 max-w-3xl">
          Look at the camera, speak normally, and optionally type a short note. Facial emotion, voice
          strain, and NLP all run in this browser. Video, audio, and notes are never uploaded.
        </p>
        <EmotionVoiceScan />
      </main>
    </div>
  );
}
