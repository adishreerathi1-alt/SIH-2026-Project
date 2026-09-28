import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  Activity,
  Sun,
  Moon,
  Cpu,
  BarChart2,
  HeartHandshake,
  LogIn,
  User,
  Users,
  Menu,
  X,
  Lock,
  Key,
  ClipboardCheck,
  LogOut,
  ScanLine,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useAuth, type UserRole } from "../AuthContext";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, cycleTheme } = useTheme();
  const { user, isLoggedIn, login, signUp, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      mobileMenuRef.current?.querySelector("a")?.focus();

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeNavigation();
        }
      };

      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isMobileMenuOpen]);

  const mobileNavClass = (active: boolean, activeColor: string) =>
    `flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
      active
        ? `${activeColor} ${theme === "bright" ? "text-slate-900" : "text-slate-100"}`
        : theme === "bright"
        ? "border-transparent text-slate-700 hover:bg-slate-100"
        : "border-transparent text-slate-300 hover:bg-slate-800"
    }`;

  const closeNavigation = () => {
    setIsMobileMenuOpen(false);
    mobileMenuButtonRef.current?.focus();
  };

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

  return (
    <>
      <header
        className={`sticky top-0 z-50 relative w-full border-b backdrop-blur-xl transition-colors duration-300 ${
          theme === "dark"
            ? "border-emerald-950/60 bg-[#0f172a]/90 text-slate-100"
            : theme === "bright"
            ? "border-slate-200 bg-white/95 text-slate-900 shadow-sm"
            : "border-slate-800 bg-[#0c1622]/90 text-slate-100 shadow-md"
        }`}
      >
        <div className="mx-auto flex h-16 min-w-0 max-w-[1720px] items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-6">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                theme === "bright"
                  ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              }`}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="primary-navigation-drawer"
              onClick={() => {
                if (isMobileMenuOpen) closeNavigation();
                else setIsMobileMenuOpen(true);
              }}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2 transition-transform hover:scale-[1.02] sm:gap-3"
              aria-label="RAKSHAK AI Home"
            >
              <div className="relative flex h-9 w-9 max-[360px]:h-8 max-[360px]:w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400 group-hover:shadow-cyan-500/20 transition-all">
                <Shield className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-sm sm:text-base font-extrabold tracking-widest max-[360px]:tracking-[0.03em] transition-colors ${
                    theme === "bright"
                      ? "text-slate-950 group-hover:text-cyan-700"
                      : "text-slate-100 group-hover:text-cyan-300"
                  }`}
                >
                  RAKSHAK AI
                </span>
              </div>
            </Link>

          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={cycleTheme}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all active:scale-95 shadow-sm max-[360px]:h-9 max-[360px]:w-9 max-[360px]:justify-center max-[360px]:gap-0 max-[360px]:px-0 ${
                theme === "bright"
                  ? "border-amber-400 bg-amber-100 text-amber-950 hover:bg-amber-200"
                  : theme === "mid"
                  ? "border-teal-500/40 bg-teal-950/40 text-teal-300 hover:border-teal-400"
                  : "border-slate-800 bg-slate-900/90 text-cyan-300 hover:border-slate-700"
              }`}
              aria-label={`Current theme: ${theme}. Click to switch mode.`}
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="max-[360px]:sr-only">Dark</span>
                </>
              ) : theme === "bright" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-600" />
                  <span className="max-[360px]:sr-only">Bright</span>
                </>
              ) : (
                <>
                  <Activity className="h-3.5 w-3.5 text-teal-400" />
                  <span className="max-[360px]:sr-only">Mid</span>
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
                  aria-label="Sign out"
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs font-bold border border-slate-700 bg-slate-900 text-white hover:bg-slate-800 shadow-sm max-[360px]:h-9 max-[360px]:w-9 max-[360px]:justify-center max-[360px]:gap-0 max-[360px]:px-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="max-[360px]:sr-only">Sign out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label="Sign in or create an account"
                onClick={() => {
                  setShowLoginModal(true);
                  setLoginError("");
                }}
                className="flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 font-mono text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-md hover:scale-105 active:scale-95 transition-all max-[360px]:h-9 max-[360px]:w-9 max-[360px]:justify-center max-[360px]:gap-0 max-[360px]:px-0 max-[360px]:hover:scale-100"
              >
                <LogIn className="h-4 w-4 text-emerald-400" />
                <span className="max-[360px]:sr-only">Sign In / Up</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="primary-navigation-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80]"
          >
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full cursor-default bg-slate-950/55 backdrop-blur-[2px]"
              aria-label="Close navigation menu"
              onClick={closeNavigation}
            />
            <motion.aside
              ref={mobileMenuRef}
              id="primary-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="navigation-drawer-title"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 flex max-h-[100dvh] w-[min(21rem,calc(100vw-2.5rem))] flex-col border-r p-5 shadow-2xl ${
                theme === "bright"
                  ? "border-[#D7E9E1] bg-white text-slate-900"
                  : "border-slate-700 bg-[#0b1420] text-slate-100"
              }`}
            >
            <div className="mb-6 flex items-center justify-between border-b border-slate-500/20 pb-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">RAKSHAK AI</p>
                <h2 id="navigation-drawer-title" className="mt-1 text-lg font-bold">Navigate</h2>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-500/25 text-current transition hover:bg-slate-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
                aria-label="Close navigation menu"
                onClick={closeNavigation}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Primary navigation" className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
              <Link to="/employee" onClick={closeNavigation} aria-current={isEmployee ? "page" : undefined} className={mobileNavClass(isEmployee, "border-emerald-500/35 bg-emerald-500/15")}>
                <User className="h-4 w-4" /> Dashboard
              </Link>
              <Link to="/" onClick={closeNavigation} aria-current={isHome ? "page" : undefined} className={mobileNavClass(isHome, "border-cyan-500/35 bg-cyan-500/15")}>
                <Cpu className="h-4 w-4" /> Overview
              </Link>
              <Link to="/tac-sync" onClick={closeNavigation} aria-current={isHud ? "page" : undefined} className={mobileNavClass(isHud, "border-cyan-500/35 bg-cyan-500/15")}>
                <Activity className="h-4 w-4" /> Readiness
              </Link>
              <Link to="/predictive" onClick={closeNavigation} aria-current={isPredictive ? "page" : undefined} className={mobileNavClass(isPredictive, "border-amber-500/35 bg-amber-500/15")}>
                <BarChart2 className="h-4 w-4" /> Forecast
              </Link>
              <Link to="/wellness" onClick={closeNavigation} aria-current={isWellness ? "page" : undefined} className={mobileNavClass(isWellness, "border-teal-500/35 bg-teal-500/15")}>
                <HeartHandshake className="h-4 w-4" /> Wellness
              </Link>
              <Link to="/scan" onClick={closeNavigation} aria-current={location.pathname.startsWith("/scan") ? "page" : undefined} className={mobileNavClass(location.pathname.startsWith("/scan"), "border-cyan-500/35 bg-cyan-500/15")}>
                <ScanLine className="h-4 w-4" /> Offline Scan
              </Link>
              <Link to="/debrief" onClick={closeNavigation} aria-current={isDebrief ? "page" : undefined} className={mobileNavClass(isDebrief, "border-cyan-500/35 bg-cyan-500/15")}>
                <ClipboardCheck className="h-4 w-4" /> Mission Review
              </Link>
              {isCommander && (
                <Link to="/squad" onClick={closeNavigation} aria-current={isSquad ? "page" : undefined} className={mobileNavClass(isSquad, "border-emerald-500/35 bg-emerald-500/15")}>
                  <Users className="h-4 w-4" /> Team
                </Link>
              )}
            </nav>
            <p className="mt-4 border-t border-slate-500/20 pt-4 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {isCommander ? "Commander access" : "Personnel portal"}
            </p>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {showLoginModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
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
