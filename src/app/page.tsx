import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Scene } from "@/components/Scene";
import { Loader } from "@/components/Loader";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { About, Archive, Experience, FocusMarquee, Research, Skills, Statement } from "@/components/sections/Content";
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
        <Statement />
        <FocusMarquee />
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
