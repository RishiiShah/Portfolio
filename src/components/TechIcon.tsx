import Image from "next/image";
import { techIcons } from "@/data/tech-icons";

export function TechIcon({ name, size = 16, square = false }: { name: string; size?: number; square?: boolean }) {
  const icon = techIcons[name];
  if (!icon) return null;
  const width = square ? size : Math.round(size * Math.min(Math.max(icon.ratio, 1), 3.6));
  const props = { width, height: size, style: { width, height: size } };
  return (
    <>
      <Image {...props} alt="" src={icon.src} className={`shrink-0 object-contain ${icon.dark ? "tech-light" : ""}`} />
      {icon.dark ? <Image {...props} alt="" src={icon.dark} className="tech-dark shrink-0 object-contain" /> : null}
    </>
  );
}

export function TechChip({ name }: { name: string }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full bg-bg-3 px-3 py-1 font-mono text-xs text-ink-2">
      <TechIcon name={name} size={14} />
      {name}
    </li>
  );
}
