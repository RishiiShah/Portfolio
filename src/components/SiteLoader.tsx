// Server Component — no JS, fades out via CSS animation after 1s
export function SiteLoader() {
  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      className="site-loader fixed inset-0 z-[120] flex items-center justify-center bg-[#07090f]"
    >
      <span className="font-serif text-xl text-[var(--ink)]">RS</span>
    </div>
  );
}
