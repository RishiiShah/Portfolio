// Server Component — no JS, animates via CSS keyframes then fades out
export function SiteLoader() {
  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      className="site-loader fixed inset-0 z-[120] flex items-center justify-center bg-[#07090f]"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="site-loader-text font-serif text-2xl tracking-wide text-[var(--ink)]">
          RS
        </span>
        <div className="site-loader-bar h-px w-12 rounded-full overflow-hidden">
          <div className="site-loader-bar-fill h-full w-full" />
        </div>
      </div>
    </div>
  );
}
