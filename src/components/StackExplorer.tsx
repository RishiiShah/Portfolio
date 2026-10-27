"use client";

import { useState } from "react";
import { stack, stackDomains } from "@/data";
import { techIcons } from "@/data/tech-icons";
import { TechIcon } from "@/components/TechIcon";

const allTools = [...new Set(stack.flatMap((g) => g.items))];

export function StackExplorer() {
  const [active, setActive] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  const domain = stackDomains[active];
  const lit = new Set(domain.lines.map((l) => l.tool));

  return (
    <div className="rounded-3xl border-2 border-ink bg-bg-2 p-4 shadow-[6px_6px_0_var(--color-ink)] md:p-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an area">
        {stackDomains.map((d, i) => {
          const on = i === active;
          return (
            <button
              key={d.name}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setActive(i);
                setFocus(null);
              }}
              className={`inline-flex items-baseline gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
                on
                  ? "-rotate-1 border-ink bg-ink text-bg shadow-[3px_3px_0_var(--color-accent)]"
                  : "border-line-2 bg-bg text-ink-2 hover:-translate-y-0.5 hover:border-ink hover:text-ink"
              }`}
            >
              <span className={`font-mono text-[0.65rem] ${on ? "text-accent" : "text-ink-3"}`}>0{i + 1}</span>
              {d.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div>
          <p className="mb-3 flex justify-between font-mono text-[0.65rem] uppercase tracking-wider text-ink-3">
            <span>All {allTools.length} tools</span>
            <span className="text-accent">{lit.size} on this receipt</span>
          </p>
          <ul className="grid grid-cols-6 gap-1.5 sm:grid-cols-9 lg:grid-cols-10">
            {allTools.map((tool) => {
              const on = lit.has(tool);
              const hot = focus === tool;
              return (
                <li
                  key={tool}
                  onPointerEnter={() => on && setFocus(tool)}
                  onPointerLeave={() => on && setFocus(null)}
                  className={`group/t relative grid aspect-square place-items-center rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
                    on
                      ? `z-[1] bg-bg ${hot ? "-translate-y-1 -rotate-6 border-accent shadow-[3px_3px_0_var(--color-accent)]" : "border-ink shadow-[2px_2px_0_var(--color-ink)]"}`
                      : "border-line opacity-35 grayscale hover:opacity-80 hover:grayscale-0"
                  }`}
                >
                  {techIcons[tool] ? (
                    <>
                      <TechIcon name={tool} size={22} square />
                      <span className="sr-only">{tool}</span>
                    </>
                  ) : (
                    <span className="px-0.5 text-center font-mono text-[0.5rem] leading-tight text-ink-2">{tool}</span>
                  )}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-1.5 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink px-2 py-0.5 font-mono text-[0.6rem] text-bg opacity-0 transition-opacity duration-150 group-hover/t:opacity-100 md:block"
                  >
                    {tool}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="receipt-wrap">
          <div key={domain.name} className="receipt bg-bg px-5 pb-2 pt-5 font-mono text-xs text-ink-2">
            <div className="text-center">
              <p className="font-display text-base font-semibold tracking-tight text-ink">Rishabh Shah, problem solver</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-ink-3">
                receipt #{String(active + 1).padStart(4, "0")} · {domain.name}
              </p>
            </div>
            <div className="my-4 border-t border-dashed border-line-2" />

            <ul className="space-y-1">
              {domain.lines.map((l, i) => (
                <li
                  key={l.tool}
                  onPointerEnter={() => setFocus(l.tool)}
                  onPointerLeave={() => setFocus(null)}
                  className={`receipt-line -mx-2 rounded-md px-2 py-1.5 transition-colors ${focus === l.tool ? "bg-bg-3" : ""}`}
                  style={{ animationDelay: `${200 + i * 90}ms` }}
                >
                  <p className="flex items-baseline gap-2 text-ink">
                    <span className={`transition-colors ${focus === l.tool ? "text-accent" : ""}`}>{l.tool}</span>
                    <span aria-hidden className="flex-1 translate-y-[-3px] border-b border-dotted border-line-2" />
                    <span className="text-ink-3">{l.where}</span>
                  </p>
                  <p className="mt-0.5 font-sans text-[0.78rem] leading-snug text-ink-3">{l.use}</p>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-dashed border-line-2" />
            <div className="flex items-end justify-between gap-4">
              <span className="uppercase tracking-wider text-ink">Total</span>
              <span className="font-display text-4xl font-semibold tracking-tight text-accent">{domain.total.value}</span>
            </div>
            <p className="mt-1 text-right text-[0.7rem] text-ink-2">{domain.total.label}</p>
            <p className="mt-0.5 text-right text-[0.65rem] text-ink-3">served at {domain.total.where}</p>

            <div aria-hidden className="barcode mx-auto mt-5 h-9 w-48" />
            <p className="mb-3 mt-2 text-center text-[0.6rem] uppercase tracking-[0.3em] text-ink-3">thanks for scrolling</p>
          </div>
        </div>
      </div>
    </div>
  );
}
