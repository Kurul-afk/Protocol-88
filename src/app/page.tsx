import { BootGate } from "@/components/features/BootGate";
import Hero from "@/components/layouts/Hero";

export default function Home() {
  return (
    <>
      <BootGate>
        <Hero />
      </BootGate>
    </>
  );
}
