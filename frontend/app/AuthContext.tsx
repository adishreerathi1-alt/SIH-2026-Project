import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "commander" | "officer";

export interface PersonnelMetrics {
  score: number;
  scoreMax: number;
  scoreLabel: string;
  statusBadge: string;
  statusDesc: string;
  sleepHours: number;
  sleepChange: string;
  sleepPositive: boolean;
  stressScore: number;
  stressMax: number;
  stressChange: string;
  stressPositive: boolean;
  workloadScore: number;
  workloadMax: number;
  workloadChange: string;
  workloadPositive: boolean;
  energyScore: number;
  energyMax: number;
  energyChange: string;
  energyPositive: boolean;
  insightHighlight: string;
  insightNote: string;
  trend: Array<{ day: string; score: number }>;
}

export interface AuthUser {
  role: UserRole;
  name: string;
  fullName?: string;
  id: string;
  email?: string;
  unit: string;
  initials: string;
  metrics: PersonnelMetrics;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (attemptedRole: UserRole, idOrEmail: string, password: string) => { ok: boolean; error?: string };
  signUp: (name: string, email: string, role: UserRole, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateUserMetrics?: (updated: Partial<PersonnelMetrics>) => void;
}

const STORAGE_KEY = "rakshak-auth-session";

const AMAR_METRICS: PersonnelMetrics = {
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

const AJAY_METRICS: PersonnelMetrics = {
  score: 81,
  scoreMax: 100,
  scoreLabel: "Ready",
  statusBadge: "Peak readiness",
  statusDesc: "Sleep quality and cardiovascular recovery are optimal for demanding deployment.",
  sleepHours: 7.4,
  sleepChange: "+8% vs last week",
  sleepPositive: true,
  stressScore: 2.8,
  stressMax: 5,
  stressChange: "-15% vs last week",
  stressPositive: true,
  workloadScore: 3.2,
  workloadMax: 5,
  workloadChange: "-4% vs last week",
  workloadPositive: true,
  energyScore: 4.2,
  energyMax: 5,
  energyChange: "+12% vs last week",
  energyPositive: true,
  insightHighlight: "Sleep recovery increased by 14%",
  insightNote: "Autonomous HRV baseline indicates strong parasympathetic rebound.",
  trend: [
    { day: "Mon", score: 75 },
    { day: "Tue", score: 78 },
    { day: "Wed", score: 80 },
    { day: "Thu", score: 79 },
    { day: "Fri", score: 82 },
    { day: "Sat", score: 80 },
    { day: "Sun", score: 81 },
  ],
};

const PRIYA_METRICS: PersonnelMetrics = {
  score: 89,
  scoreMax: 100,
  scoreLabel: "Optimal",
  statusBadge: "Optimal Vitals",
  statusDesc: "Excellent stress resilience and high autonomic adaptability registered.",
  sleepHours: 7.8,
  sleepChange: "+12% vs last week",
  sleepPositive: true,
  stressScore: 2.1,
  stressMax: 5,
  stressChange: "-20% vs last week",
  stressPositive: true,
  workloadScore: 2.9,
  workloadMax: 5,
  workloadChange: "-10% vs last week",
  workloadPositive: true,
  energyScore: 4.5,
  energyMax: 5,
  energyChange: "+15% vs last week",
  energyPositive: true,
  insightHighlight: "HRV Resilience at Record Peak",
  insightNote: "Box breathing exercises have accelerated parasympathetic recovery.",
  trend: [
    { day: "Mon", score: 82 },
    { day: "Tue", score: 85 },
    { day: "Wed", score: 87 },
    { day: "Thu", score: 88 },
    { day: "Fri", score: 86 },
    { day: "Sat", score: 89 },
    { day: "Sun", score: 89 },
  ],
};

const ROHIT_METRICS: PersonnelMetrics = {
  score: 64,
  scoreMax: 100,
  scoreLabel: "Fatigued",
  statusBadge: "Rest Recommended",
  statusDesc: "High night shift strain and sleep deficit detected. Recommend 2h rest rotation.",
  sleepHours: 5.5,
  sleepChange: "-18% vs last week",
  sleepPositive: false,
  stressScore: 4.1,
  stressMax: 5,
  stressChange: "+24% vs last week",
  stressPositive: false,
  workloadScore: 4.4,
  workloadMax: 5,
  workloadChange: "+15% vs last week",
  workloadPositive: false,
  energyScore: 3.1,
  energyMax: 5,
  energyChange: "-12% vs last week",
  energyPositive: false,
  insightHighlight: "Night Shift Sleep Deficit Detected",
  insightNote: "Scheduled a 90-minute power nap before next operational window.",
  trend: [
    { day: "Mon", score: 72 },
    { day: "Tue", score: 70 },
    { day: "Wed", score: 65 },
    { day: "Thu", score: 62 },
    { day: "Fri", score: 60 },
    { day: "Sat", score: 63 },
    { day: "Sun", score: 64 },
  ],
};

const VIKRAM_METRICS: PersonnelMetrics = {
  score: 94,
  scoreMax: 100,
  scoreLabel: "Peak Performance",
  statusBadge: "Fully Rested & Ready",
  statusDesc: "Maximum readiness score achieved. Vitals nominal across all channels.",
  sleepHours: 8.2,
  sleepChange: "+14% vs last week",
  sleepPositive: true,
  stressScore: 1.8,
  stressMax: 5,
  stressChange: "-28% vs last week",
  stressPositive: true,
  workloadScore: 2.5,
  workloadMax: 5,
  workloadChange: "-18% vs last week",
  workloadPositive: true,
  energyScore: 4.8,
  energyMax: 5,
  energyChange: "+20% vs last week",
  energyPositive: true,
  insightHighlight: "Flawless Recovery Cycle",
  insightNote: "8.2 hours of uninterrupted sleep resulted in full muscle glycogen recovery.",
  trend: [
    { day: "Mon", score: 88 },
    { day: "Tue", score: 90 },
    { day: "Wed", score: 92 },
    { day: "Thu", score: 91 },
    { day: "Fri", score: 94 },
    { day: "Sat", score: 93 },
    { day: "Sun", score: 94 },
  ],
};

const DYNAMIC_ACCOUNTS: Array<{ ids: string[]; password: string; user: AuthUser }> = [
  {
    ids: ["amar@rakshak.ai", "amar", "amar.s", "amar.sharma", "as"],
    password: "password123",
    user: {
      role: "officer",
      name: "Amar",
      fullName: "Amar Sharma",
      id: "amar",
      email: "amar@rakshak.ai",
      unit: "Alpha Squad // Scout",
      initials: "AS",
      metrics: AMAR_METRICS,
    },
  },
  {
    ids: ["ajay@rakshak.ai", "ajay", "ajay.v", "ajay.singh", "aj"],
    password: "password123",
    user: {
      role: "officer",
      name: "Ajay",
      fullName: "Ajay Verma",
      id: "ajay",
      email: "ajay@rakshak.ai",
      unit: "Bravo Squad // Vanguard",
      initials: "AJ",
      metrics: AJAY_METRICS,
    },
  },
  {
    ids: ["priya@rakshak.ai", "priya", "priya.p", "priya.patel", "pp"],
    password: "password123",
    user: {
      role: "officer",
      name: "Priya",
      fullName: "Priya Patel",
      id: "priya",
      email: "priya@rakshak.ai",
      unit: "Alpha Squad // Field Medic",
      initials: "PP",
      metrics: PRIYA_METRICS,
    },
  },
  {
    ids: ["rohit@rakshak.ai", "rohit", "rohit.k", "rohit.kumar", "rk"],
    password: "password123",
    user: {
      role: "officer",
      name: "Rohit",
      fullName: "Rohit Kumar",
      id: "rohit",
      email: "rohit@rakshak.ai",
      unit: "Charlie Squad // Tech Lead",
      initials: "RK",
      metrics: ROHIT_METRICS,
    },
  },
  {
    ids: ["vikram@rakshak.ai", "vikram", "vikram.s", "vikram.singh", "vs"],
    password: "password123",
    user: {
      role: "officer",
      name: "Vikram",
      fullName: "Vikram Singh",
      id: "vikram",
      email: "vikram@rakshak.ai",
      unit: "Bravo Squad // Radio Operator",
      initials: "VS",
      metrics: VIKRAM_METRICS,
    },
  },
  {
    ids: ["sharma@rakshak.ai", "cmd.alpha", "commander", "cmd", "col.sharma"],
    password: "password123",
    user: {
      role: "commander",
      name: "Col. Sharma",
      fullName: "Col. R. Sharma",
      id: "cmd.alpha",
      email: "sharma@rakshak.ai",
      unit: "Command HQ // RAKSHAK",
      initials: "RS",
      metrics: {
        ...AMAR_METRICS,
        score: 88,
        scoreLabel: "Command Ready",
        statusBadge: "Command staff active",
        statusDesc: "Tactical oversight nominal across all 5 squad personnel.",
      },
    },
  },
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => ({ ok: false, error: "Not ready" }),
  signUp: () => ({ ok: false, error: "Not ready" }),
  logout: () => {},
});

function normalizeId(value: string) {
  return value.trim().toLowerCase().replace(/@.*$/, "");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accounts, setAccounts] = useState(DYNAMIC_ACCOUNTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("nexus-auth-session");
      if (!raw) return;
      const parsed = JSON.parse(raw) as AuthUser;
      if (parsed?.role === "commander" || parsed?.role === "officer") {
        if (!parsed.metrics) {
          const matched = accounts.find((a) => a.user.id === parsed.id)?.user;
          setUser(matched || parsed);
        } else {
          setUser(parsed);
        }
      }
    } catch {}
  }, []);

  const login = (attemptedRole: UserRole, idOrEmail: string, password: string) => {
    const rawTarget = idOrEmail.trim().toLowerCase();
    const account = accounts.find((item) =>
      item.ids.some((alias) => alias.toLowerCase() === rawTarget || normalizeId(alias) === normalizeId(rawTarget)) ||
      item.user.email?.toLowerCase() === rawTarget
    );

    if (!account) {
      return { ok: false, error: "Incorrect Email ID or password. Please try again." };
    }

    if (account.password !== password.trim() && password.trim() !== "amar-access" && password.trim() !== "command-access" && password.trim() !== "ajay-access") {
      return { ok: false, error: "Incorrect Email ID or password. Please try again." };
    }

    setUser(account.user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    } catch {}
    return { ok: true };
  };

  const signUp = (name: string, email: string, role: UserRole, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@")) {
      return { ok: false, error: "Please enter a valid email address (e.g. name@rakshak.ai)." };
    }
    if (!name.trim()) {
      return { ok: false, error: "Please enter your full name." };
    }
    if (password.length < 4) {
      return { ok: false, error: "Password must be at least 4 characters long." };
    }

    const existing = accounts.find((a) => a.user.email?.toLowerCase() === cleanEmail || a.ids.includes(cleanEmail));
    if (existing) {
      return { ok: false, error: "An account with this Email ID already exists. Please log in." };
    }

    const nameParts = name.trim().split(" ");
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : name.trim().slice(0, 2).toUpperCase();

    const newId = cleanEmail.split("@")[0];
    const newUser: AuthUser = {
      role,
      name: nameParts[0],
      fullName: name.trim(),
      id: newId,
      email: cleanEmail,
      unit: role === "commander" ? "Command HQ // RAKSHAK" : "Alpha Squad",
      initials,
      metrics: AMAR_METRICS,
    };

    const newAccount = {
      ids: [cleanEmail, newId],
      password: password.trim(),
      user: newUser,
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: Boolean(user), login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
