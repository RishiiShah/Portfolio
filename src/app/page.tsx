import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Lab } from "@/components/sections/Lab";
import { Experience } from "@/components/sections/Experience";
import { Research } from "@/components/sections/Research";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Lab />
        <Experience />
        <Research />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
