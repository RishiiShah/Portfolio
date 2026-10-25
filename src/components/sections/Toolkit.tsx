import { skills } from "@/data";
import { Section } from "../Section";

const total = skills.reduce((n, g) => n + g.items.length, 0);

/** Toolkit as a plain grouped list: one row per category. */
export function Skills() {
  return (
    <Section id="skills" index="04" title="Toolkit" meta={`${total} tools · ${skills.length} groups`} shape={4}>
      <dl className="border-b border-line">
        {skills.map((g, i) => (
          <div key={g.category} className="grid gap-x-6 gap-y-3 border-t border-line py-6 md:grid-cols-[3.5rem_14rem_1fr] md:px-3">
            <span className="label hidden text-accent md:block md:pt-1.5">{String(i + 1).padStart(2, "0")}</span>
            <dt className="label text-ink-3 md:pt-1.5">{g.category}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[clamp(16px,1.2vw,20px)] text-ink-2">
                {g.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
