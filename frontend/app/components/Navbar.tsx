import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Shield,
  Activity,
  Sun,
  Moon,
  Radio,
  Cpu,
  BarChart2,
  HeartHandshake,
  LogIn,
  User,
  Users,
  X,
  Lock,
  Key,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useAuth, type UserRole } from "../AuthContext";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, cycleTheme } = useTheme();
  const { user, isLoggedIn, login, signUp, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalTab, setModalTab] = useState<"login" | "signup">("login");
  const [loginRole, setLoginRole] = useState<UserRole>("officer");
  const [loginId, setLoginId] = useState("amar@rakshak.ai");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpRole, setSignUpRole] = useState<UserRole>("officer");
  const [signUpPassword, setSignUpPassword] = useState("");

  const isHome = location.pathname === "/";
  const isEmployee = location.pathname.startsWith("/employee");
  const isHud = location.pathname.startsWith("/tac-sync");
  const isPredictive = location.pathname.startsWith("/predictive");
  const isWellness = location.pathname.startsWith("/wellness");
  const isDebrief = location.pathname.startsWith("/debrief");
  const isSquad = location.pathname.startsWith("/squad");
  const isCommander = user?.role === "commander";

  const switchRole = (role: UserRole) => {
    setLoginRole(role);
    setLoginError("");
    if (role === "commander") {
      setLoginId("sharma@rakshak.ai");
      setLoginPassword("password123");
    } else {
      setLoginId("amar@rakshak.ai");
      setLoginPassword("password123");
    }
  };

  const handleQuickLogin = (role: UserRole, email: string, pass: string) => {
    setLoginRole(role);
    setLoginId(email);
    setLoginPassword(pass);
    const result = login(role, email, pass);
    if (result.ok) {
      setShowLoginModal(false);
      setLoginError("");
      if (role === "commander") navigate("/squad");
      else navigate("/employee");
    } else {
      setLoginError(result.error ?? "Login failed.");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(loginRole, loginId, loginPassword);
    if (!result.ok) {
      setLoginError(result.error ?? "Login failed.");
      return;
    }
    setShowLoginModal(false);
    setLoginPassword("");
    setLoginError("");
    if (loginRole === "commander") navigate("/squad");
    else navigate("/employee");
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUp(signUpName, signUpEmail, signUpRole, signUpPassword);
    if (!result.ok) {
      setLoginError(result.error ?? "Sign up failed.");
      return;
    }
    setShowLoginModal(false);
    setLoginError("");
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
    if (signUpRole === "commander") navigate("/squad");
    else navigate("/employee");
  };

  const navClass = (active: boolean, activeColor: string) =>
    `flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide transition-all ${
      active
        ? activeColor
        : theme === "bright"
        ? "text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 font-bold"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${
          theme === "dark"
            ? "border-emerald-950/60 bg-[#0f172a]/90 text-slate-100"
            : "border-emerald-200/80 bg-white/90 text-slate-900 shadow-sm"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1720px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
              aria-label="RAKSHAK AI Home"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400 group-hover:shadow-emerald-500/20 transition-all">
                <Shield className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-base font-extrabold tracking-widest transition-colors ${
                      theme === "bright"
                        ? "text-slate-950 group-hover:text-emerald-700"
                        : "text-slate-100 group-hover:text-emerald-300"
                    }`}
                  >
                    RAKSHAK AI
                  </span>
                </div>
                <p
                  className={`font-mono text-[10px] tracking-tight hidden sm:block ${
                    theme === "bright" ? "text-slate-600 font-medium" : "text-slate-400"
                  }`}
                >
                  Personnel Stress &amp; Readiness Intelligence
                </p>
              </div>
            </Link>

            <nav
              className={`hidden lg:flex items-center gap-1 rounded-full border p-1 backdrop-blur-md ${
                theme === "bright" ? "border-slate-300 bg-white/90 shadow-sm" : "border-slate-800 bg-slate-900/80"
              }`}
            >
              <Link to="/employee" className={navClass(isEmployee, "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold")}>
                <User className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <Link to="/" className={navClass(isHome, "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30")}>
                <Cpu className="h-3.5 w-3.5" />
                Overview
              </Link>
              <Link to="/tac-sync" className={navClass(isHud, "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30")}>
                <Activity className="h-3.5 w-3.5" />
                Readiness
              </Link>
              <Link
                to="/predictive"
                className={navClass(isPredictive, "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30")}
              >
                <BarChart2 className="h-3.5 w-3.5" />
                Forecast
              </Link>
              <Link
                to="/wellness"
                className={navClass(isWellness, "bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30")}
              >
                <HeartHandshake className="h-3.5 w-3.5" />
                Wellness
              </Link>
              <Link
                to="/debrief"
                className={navClass(isDebrief, "bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30")}
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                Mission Review
              </Link>
              {isCommander && (
                <Link
                  to="/squad"
                  className={navClass(isSquad, "bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40")}
                >
                  <Users className="h-3.5 w-3.5" />
                  Team
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`hidden lg:flex items-center gap-2 rounded-lg border px-3 py-1 font-mono text-xs ${
                theme === "bright"
                  ? "border-emerald-400/80 bg-emerald-100 text-emerald-950 font-bold"
                  : "border-emerald-500/20 bg-emerald-950/30 text-emerald-400"
              }`}
            >
              <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              <span className="font-semibold">SENSORS LIVE</span>
            </div>

            <button
              onClick={cycleTheme}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all active:scale-95 shadow-sm ${
                theme === "bright"
                  ? "border-amber-400 bg-amber-100 text-amber-950 hover:bg-amber-200"
                  : "border-slate-800 bg-slate-900/90 text-cyan-300 hover:border-slate-700"
              }`}
              aria-label={`Current theme: ${theme}. Click to switch mode.`}
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-600" />
                  <span>Bright</span>
                </>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div
                  className={`hidden sm:flex flex-col items-end ${
                    theme === "bright" ? "text-slate-900" : "text-slate-200"
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold">{user?.fullName ?? user?.name}</span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
                    {user?.role === "commander" ? "Commander" : "Personnel / Officer"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs font-bold border border-slate-700 bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(true);
                  setLoginError("");
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <LogIn className="h-4 w-4 text-emerald-400" />
                <span>Sign In / Up</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-900/95 p-6 sm:p-8 shadow-2xl text-white">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/40 shadow-md shadow-emerald-500/10">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white font-mono tracking-wide">
                  RAKSHAK AI
                </h3>
                <p className="font-mono text-[11px] text-slate-400">
                  Personnel &amp; Officer Intelligence Portal
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 rounded-2xl bg-slate-950 p-1 border border-slate-800 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setModalTab("login");
                  setLoginError("");
                }}
                className={`py-2 rounded-xl transition ${
                  modalTab === "login"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalTab("signup");
                  setLoginError("");
                }}
                className={`py-2 rounded-xl transition ${
                  modalTab === "signup"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {modalTab === "login" && (
              <>
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-bold">
                    Quick 1-Click Personnel &amp; Officer Logins:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("officer", "amar@rakshak.ai", "password123")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold transition active:scale-95"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Amar (AS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin("officer", "ajay@rakshak.ai", "password123")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-mono text-xs font-semibold transition active:scale-95"
                    >
                      <span className="h-2 w-2 rounded-full bg-teal-400" />
                      <span>Ajay (AJ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin("officer", "priya@rakshak.ai", "password123")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold transition active:scale-95"
                    >
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span>Priya (PP)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin("officer", "rohit@rakshak.ai", "password123")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold transition active:scale-95"
                    >
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span>Rohit (RK)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin("officer", "vikram@rakshak.ai", "password123")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold transition active:scale-95"
                    >
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span>Vikram (VS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin("commander", "sharma@rakshak.ai", "password123")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-mono text-xs font-semibold transition active:scale-95"
                    >
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      <span>Col. Sharma</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="mt-4 flex flex-col gap-3">
                  <div>
                    <label className="block font-mono text-xs text-slate-300 mb-1">
                      Email ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="amar@rakshak.ai"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition mt-1"
                  >
                    Sign In to Dashboard
                  </button>
                </form>
              </>
            )}

            {modalTab === "signup" && (
              <form onSubmit={handleSignUpSubmit} className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g. Amar Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">Email ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="name@rakshak.ai"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">Role / Account Type</label>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setSignUpRole("officer")}
                      className={`py-2 rounded-xl border transition ${
                        signUpRole === "officer"
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      Personnel / Officer
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignUpRole("commander")}
                      className={`py-2 rounded-xl border transition ${
                        signUpRole === "commander"
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 font-bold"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      Commander / Lead
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="Create password"
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition mt-1"
                >
                  Create Account &amp; Enter Portal
                </button>
              </form>
            )}

            <p className="mt-4 text-center font-mono text-[10px] text-slate-400 leading-relaxed">
              Default password for all demo accounts: <span className="text-emerald-400 font-bold">password123</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
