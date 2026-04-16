import { Hero } from "@/components/hero";
import { Clients } from "@/components/clients";
import { Services } from "@/components/services";
import { Projects } from "@/components/projects";
import { Testimonials } from "@/components/testimonials";
import { About } from "@/components/about";
import { Team } from "@/components/team";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Clients />
      <Services />
      <Projects />
      <Testimonials />
      <About />
      <Team />
      <Contact />
    </main>
  );
}
