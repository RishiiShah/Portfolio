const ITEMS = [
  "Winner, Sevaro × Rutgers Health Hack",
  "−86% P95 latency",
  "Best Use of Backboard, DivHacks 2026",
  "93.76% end-to-end accuracy",
  "IEEE ICICIS 2025",
  "82% less agent context",
  "0 rollbacks in 9 deploys",
  "3 published papers",
];

export function Ticker() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden py-6" aria-label="Highlights">
      <div className="-mx-4 -rotate-1 overflow-hidden bg-ink py-5 text-bg">
      <ul className="marquee">
        {row.map((item, i) => (
          <li
            key={i}
            aria-hidden={i >= ITEMS.length}
            className="flex shrink-0 items-center gap-8 pr-8 font-display text-2xl font-medium tracking-tight md:text-3xl"
          >
            {item}
            <span className="text-accent">✦</span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
