import { skills } from "@/data";
import { Section } from "../Section";
import { Stagger } from "../anim";

const total = skills.reduce((n, g) => n + g.items.length, 0);

// Bento spans by category, sized to how many tools each holds.
const SPAN: Record<string, string> = {
  Languages: "lg:col-span-4",
  "Frameworks & Tools": "lg:col-span-8",
  "Databases & Cloud": "lg:col-span-6",
  Testing: "lg:col-span-3",
  "AI/ML": "lg:col-span-3",
};

/** Toolkit as a bento of tool groups. */
export function Skills() {
  return (
    <Section id="skills" index="04" title="Toolkit" meta={`${total} tools · ${skills.length} groups`} shape={4}>
      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
        {skills.map((g, i) => (
          <div key={g.category} className={`tile p-[clamp(1.25rem,1.8vw,2rem)] ${SPAN[g.category] ?? "lg:col-span-4"}`}>
            <p className="label flex justify-between text-ink-3">
              <span>
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {g.category}
              </span>
              <span>{g.items.length}</span>
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-[clamp(14px,0.95vw,16px)] text-ink-2">
              {g.items.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}
