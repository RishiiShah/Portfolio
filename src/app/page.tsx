import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { Hero } from "@/components/Hero";

export default function Page() {
  return (
    <>
      <Loader />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
