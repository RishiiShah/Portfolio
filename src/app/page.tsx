import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { ClientOnlyUI } from "@/components/ClientOnlyUI";
import { SiteLoader } from "@/components/SiteLoader";

const Projects = dynamic(() =>
  import("@/components/sections/Projects").then((m) => ({ default: m.Projects }))
);
const Publications = dynamic(() =>
  import("@/components/sections/Publications").then((m) => ({ default: m.Publications }))
);
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((m) => ({ default: m.Experience }))
);
const Skills = dynamic(() =>
  import("@/components/sections/Skills").then((m) => ({ default: m.Skills }))
);
const Education = dynamic(() =>
  import("@/components/sections/Education").then((m) => ({ default: m.Education }))
);
const About = dynamic(() =>
  import("@/components/sections/About").then((m) => ({ default: m.About }))
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => ({ default: m.Contact }))
);
const Footer = dynamic(() =>
  import("@/components/Footer").then((m) => ({ default: m.Footer }))
);

export default function Page() {
  return (
    <>
      <SiteLoader />
      <ClientOnlyUI />
      <main>
        <Hero />
        <Projects />
        <Publications />
        <Experience />
        <Skills />
        <Education />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
