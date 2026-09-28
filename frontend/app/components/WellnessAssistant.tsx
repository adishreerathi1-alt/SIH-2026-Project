import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Bot, Send, X } from "lucide-react";
import { useTheme } from "../ThemeContext";

type Message = {
  id: number;
  from: "assistant" | "you";
  text: string;
};

const shortcuts = [
  { label: "Readiness", to: "/tac-sync" },
  { label: "Wellness", to: "/wellness" },
  { label: "Offline scan", to: "/scan" },
];

function replyFor(message: string) {
  const question = message.toLowerCase();

  if (question.includes("readiness") || question.includes("status")) {
    return "Open Readiness to review the current operational overview and status indicators.";
  }
  if (question.includes("scan") || question.includes("offline")) {
    return "Offline Scan is available from the navigation menu. It can guide you through a local check-in when a connection is unavailable.";
  }
  if (question.includes("wellness") || question.includes("stress") || question.includes("sleep")) {
    return "The Wellness page has check-in resources and recovery guidance. If you feel overwhelmed, pause, try a few slow breaths, and reach out to a trusted teammate or health professional when you need support.";
  }
  if (question.includes("forecast") || question.includes("predict")) {
    return "The Forecast page shows the available trend view. Use the menu at the top left to open it.";
  }
  if (question.includes("team") || question.includes("squad")) {
    return "Team is available to commander accounts. Open the navigation menu to find it when you are signed in with commander access.";
  }

  return "I can point you to pages and explain where to find common tools. Try Readiness, Wellness, or Offline scan below. This helper works locally and does not send your message anywhere.";
}

export default function WellnessAssistant() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [gaze, setGaze] = useState({ x: 0, y: 0, tilt: 0 });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "assistant",
      text: "Hi, I’m RAKSHAK’s local guide. I can help you find a page or tool. What are you looking for?",
    },
  ]);
  const nextMessageId = useRef(1);
  const robotButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const followPointer = (event: PointerEvent) => {
      const button = robotButtonRef.current;
      if (!button) return;

      const bounds = button.getBoundingClientRect();
      const dx = event.clientX - bounds.left - bounds.width / 2;
      const dy = event.clientY - bounds.top - bounds.height / 2;
      const next = {
        x: Math.max(-3, Math.min(3, dx / 12)),
        y: Math.max(-3, Math.min(3, dy / 12)),
        tilt: Math.max(-3, Math.min(3, dx / 70)),
      };

      setGaze((current) =>
        current.x === next.x && current.y === next.y && current.tilt === next.tilt
          ? current
          : next,
      );
    };

    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => window.removeEventListener("pointermove", followPointer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        robotButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const sendMessage = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const messageId = nextMessageId.current;
    nextMessageId.current += 2;
    setMessages((current) => [
      ...current,
      { id: messageId, from: "you", text: cleanText },
      { id: messageId + 1, from: "assistant", text: replyFor(cleanText) },
    ]);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const panelTone =
    theme === "bright"
      ? "border-[#cce2d9] bg-white text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
      : theme === "mid"
      ? "border-teal-800 bg-[#10201f] text-slate-100 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
      : "border-slate-700 bg-[#0b1420] text-slate-100 shadow-[0_24px_70px_rgba(0,0,0,0.55)]";

  const assistantBubble =
    theme === "bright"
      ? "border border-slate-200 bg-slate-50 text-slate-700"
      : "border border-slate-700/80 bg-slate-900/80 text-slate-200";

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="wellness-assistant-panel"
            role="dialog"
            aria-label="Local help assistant"
            aria-modal="false"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`pointer-events-auto fixed flex flex-col overflow-hidden rounded-2xl border ${panelTone}`}
            style={{
              right: "max(0.75rem, env(safe-area-inset-right))",
              bottom: "calc(6.25rem + env(safe-area-inset-bottom))",
              width: "min(22rem, calc(100vw - 3rem - env(safe-area-inset-left) - env(safe-area-inset-right)))",
              maxHeight: "calc(100dvh - 8rem - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
              transformOrigin: "bottom right",
            }}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-500/20 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold">RAKSHAK guide</h2>
                  <p className={`font-mono text-[10px] ${theme === "bright" ? "text-emerald-700" : "text-emerald-300"}`}>
                    LOCAL HELP · NO DATA SENT
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  robotButtonRef.current?.focus();
                }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-500/10 hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={messagesRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.from === "you" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                      message.from === "you"
                        ? "rounded-br-md bg-emerald-600 text-white"
                        : `rounded-bl-md ${assistantBubble}`
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                {shortcuts.map((shortcut) => (
                  <Link
                    key={shortcut.to}
                    to={shortcut.to}
                    onClick={() => setIsOpen(false)}
                    className={`inline-flex min-h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 ${
                      theme === "bright"
                        ? "border-emerald-700/20 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                    }`}
                  >
                    {shortcut.label} <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-slate-500/20 p-3">
              <label className="sr-only" htmlFor="assistant-message">Ask the local guide</label>
              <input
                ref={inputRef}
                id="assistant-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask where to find something…"
                className={`h-10 min-w-0 flex-1 rounded-xl border px-3 text-xs outline-none transition focus:border-emerald-500 ${
                  theme === "bright"
                    ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-500"
                    : "border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500"
                }`}
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        ref={robotButtonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`pointer-events-auto fixed flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-[1.4rem] border shadow-xl shadow-emerald-950/25 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 ${
          theme === "bright"
            ? "border-emerald-600/35 bg-white"
            : "border-emerald-300/25 bg-[#101d26]"
        }`}
        style={{
          right: "max(1rem, env(safe-area-inset-right))",
          bottom: "calc(1rem + env(safe-area-inset-bottom))",
        }}
        aria-label={isOpen ? "Close local help assistant" : "Open local help assistant"}
        aria-expanded={isOpen}
        aria-controls="wellness-assistant-panel"
      >
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#101d26] bg-emerald-400" aria-hidden="true" />
        <span
          className="relative flex h-11 w-12 items-center justify-center rounded-[1rem] border border-cyan-300/50 bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-[0_5px_16px_rgba(16,185,129,0.35)]"
          style={{ transform: `rotate(${gaze.tilt}deg)`, transition: "transform 160ms ease-out" }}
          aria-hidden="true"
        >
          <span className="absolute -top-2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
          <span className="flex items-center gap-2 rounded-lg bg-slate-950/90 px-2 py-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_7px_rgba(103,232,249,0.95)]" style={{ transform: `translate(${gaze.x}px, ${gaze.y}px)`, transition: "transform 110ms ease-out" }} />
            <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_7px_rgba(103,232,249,0.95)]" style={{ transform: `translate(${gaze.x}px, ${gaze.y}px)`, transition: "transform 110ms ease-out" }} />
          </span>
          <span className="absolute bottom-1.5 h-[2px] w-3 rounded-full bg-slate-950/80" />
        </span>
      </button>
    </div>
  );
}
