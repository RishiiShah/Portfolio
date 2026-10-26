import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Work } from "@/components/sections/Work";
import { Latency } from "@/components/sections/Latency";
import { Experience } from "@/components/sections/Experience";
import { Research } from "@/components/sections/Research";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Work />
        <Latency />
        <Experience />
        <Research />
        <Toolkit />
        <Contact />
      </main>
    </>
  );
}
