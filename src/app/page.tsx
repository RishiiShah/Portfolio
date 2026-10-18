import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Scene } from "@/components/Scene";
import { Loader } from "@/components/Loader";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { About } from "@/components/sections/About";
import { Archive, Research } from "@/components/sections/Content";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Toolkit";
import { Intro } from "@/components/sections/Intro";
import { Contact } from "@/components/sections/Contact";
import { projects } from "@/data";

const featured = projects.filter((p) => p.problem);

export default function Page() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Scene />
      <Cursor />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Intro />
        <FeaturedWork items={featured} />
        <Archive />
        <Research />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
