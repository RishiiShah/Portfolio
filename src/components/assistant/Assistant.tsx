"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { X, Send, Terminal } from "lucide-react";
import { respond, suggestedPrompts } from "./responses";
import { bio } from "@/data";

type Message =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; streamed: string; done: boolean };

const GREETING =
  `Hi, I'm Jarvis, ${bio.name}'s portfolio assistant. ` +
  "Ask me anything about projects, papers, experience, or contact. Try a chip below.";

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const queueResponse = useCallback(
    (text: string) => {
      setStreaming(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text, streamed: "", done: false },
      ]);

      if (reduce) {
        // Instant: no character stream
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            next[next.length - 1] = { ...last, streamed: text, done: true };
          }
          return next;
        });
        setStreaming(false);
        return;
      }

      let i = 0;
      const total = text.length;
      const step = () => {
        // Adaptive step: chunk more for long replies
        const chunk = total > 400 ? 4 : total > 200 ? 2 : 1;
        i = Math.min(total, i + chunk);
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            next[next.length - 1] = {
              ...last,
              streamed: text.slice(0, i),
              done: i >= total,
            };
          }
          return next;
        });
        if (i < total) {
          setTimeout(step, 12);
        } else {
          setStreaming(false);
        }
      };
      setTimeout(step, 80);
    },
    [reduce]
  );

  const openAssistant = useCallback(() => {
    setOpen(true);
    if (messages.length === 0) {
      queueResponse(GREETING);
    }
  }, [messages.length, queueResponse]);

  // Auto-scroll on new content
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  // Focus input when opening, and whenever streaming ends so user can keep typing
  useEffect(() => {
    if (!open) return;
    if (!streaming) {
      // Small delay to win focus against any concurrent DOM updates
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open, streaming]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const ask = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed || streaming) return;
      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setInput("");
      setTimeout(() => queueResponse(respond(trimmed)), 200);
    },
    [queueResponse, streaming]
  );

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ask(input);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        ref={triggerRef}
        onClick={openAssistant}
        aria-label="Open portfolio assistant"
        aria-expanded={open}
        aria-controls="jarvis-panel"
        className="fixed bottom-[5.25rem] right-4 z-40 flex items-center gap-2 rounded-full glass-panel-interactive px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink)] hover:text-[var(--ink)] transition-all md:bottom-6 md:right-6"
        style={{
          boxShadow:
            "0 8px 28px 0 rgba(0,0,0,0.45), 0 0 0 1px var(--line-strong)",
        }}
      >
        <Terminal size={14} className="text-[var(--accent-signal)]" />
        <span>Ask Jarvis</span>
        <span className="h-3.5 w-[2px] bg-[var(--accent-signal)] animate-pulse" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Full-screen click-outside backdrop (visible on mobile, transparent on desktop) */}
            <m.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
            />

            <m.div
              key="panel"
              id="jarvis-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="jarvis-title"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-50 right-0 bottom-0 md:right-6 md:bottom-20 w-full md:w-[420px] h-[75vh] md:h-[560px] md:rounded-2xl overflow-hidden flex flex-col glass-panel border-t md:border border-[var(--line-strong)]"
              style={{
                boxShadow: "0 40px 80px 0 rgba(0,0,0,0.6)",
                background: "var(--bg-elev-1)",
              }}
            >
              {/* Terminal chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-elev-2)]/70 border-b border-[var(--line)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span
                  id="jarvis-title"
                  className="ml-3 font-mono text-[11px] text-[var(--ink-mute)] flex-1 text-center tracking-wider"
                >
                  jarvis@portfolio ~ %
                </span>
                <button
                  onClick={close}
                  aria-label="Close assistant"
                  className="text-[var(--ink-mute)] hover:text-[var(--ink)]"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Transcript */}
              <div
                ref={bodyRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[12.5px] space-y-3 leading-[1.55] scrollbar-hide"
              >
                {messages.map((msg, i) => (
                  <div key={i}>
                    {msg.role === "user" ? (
                      <div>
                        <span className="text-[var(--accent)]">user@</span>
                        <span className="text-[var(--ink-mute)]">:~$ </span>
                        <span className="text-[var(--ink)]">{msg.text}</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-[var(--accent-signal)]">jarvis</span>
                          <span className="text-[var(--ink-mute)]">›</span>
                        </div>
                        <pre className="whitespace-pre-wrap text-[var(--ink-dim)] font-mono text-[12.5px] leading-[1.55]">
                          {msg.streamed}
                          {!msg.done && (
                            <span className="inline-block w-1.5 h-3.5 bg-[var(--accent-signal)] animate-pulse ml-0.5 align-middle" />
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Suggested prompts */}
              {!streaming && messages.length < 3 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => ask(p)}
                      className="font-mono text-[10px] px-2 py-1 rounded border border-[var(--line)] text-[var(--ink-mute)] hover:text-[var(--ink-dim)] hover:border-[var(--line-strong)] transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2 px-4 py-3 border-t border-[var(--line)]"
                onClick={() => inputRef.current?.focus()}
              >
                <span className="font-mono text-[var(--accent-signal)] text-[13px]">▌</span>
                <input
                  ref={inputRef}
                  aria-label="Ask Jarvis"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={streaming ? "streaming, type next question..." : "type a question"}
                  autoFocus
                  style={{ outline: "none", boxShadow: "none" }}
                  className="flex-1 bg-transparent font-mono text-[12.5px] text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus-visible:outline-none border-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  className="text-[var(--accent)] disabled:text-[var(--ink-mute)] disabled:cursor-not-allowed hover:text-[var(--ink)]"
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </form>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
