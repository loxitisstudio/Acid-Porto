import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BelowFold from "@/components/BelowFold";
import HomeShell from "@/components/HomeShell";

export default function Home() {
  return (
    <HomeShell>
        <Navbar />
        <main>
          <Hero />
          <BelowFold />
        </main>
    </HomeShell>
  );
}