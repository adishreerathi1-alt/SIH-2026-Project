import { Link } from "react-router";
import { useAuth } from "../AuthContext";

type ScreenTab = "dashboard" | "readiness" | "forecast" | "wellness" | "team" | "debrief";

const TABS: Array<{ id: ScreenTab; to: string; label: string; commanderOnly?: boolean }> = [
  { id: "dashboard", to: "/employee", label: "My Dashboard" },
  { id: "readiness", to: "/tac-sync", label: "Readiness" },
  { id: "forecast", to: "/predictive", label: "Stress Forecast" },
  { id: "wellness", to: "/wellness", label: "Support & Wellness" },
  { id: "team", to: "/squad", label: "Team Overview", commanderOnly: true },
  { id: "debrief", to: "/debrief", label: "Mission Review" },
];

export function ScreenTabs({ active }: { active: ScreenTab }) {
  const { user } = useAuth();
  const isCommander = user?.role === "commander";

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
      {TABS.filter((tab) => !(tab.commanderOnly && !isCommander)).map((tab) => {
        const isActive = tab.id === active;
        if (isActive) {
          return (
            <div
              key={tab.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>{tab.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={tab.id}
            to={tab.to}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition whitespace-nowrap"
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
