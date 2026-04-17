import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Publications } from "@/components/sections/Publications";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { PortfolioDock } from "@/components/PortfolioDock";
import { Assistant } from "@/components/assistant/Assistant";

export default function Page() {
  return (
    <>
      <CustomCursor />
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
      <Assistant />
      <PortfolioDock />
    </>
  );
}
