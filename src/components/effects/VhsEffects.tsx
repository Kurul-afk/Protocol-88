// src/components/effects/VhsEffects.tsx
import { NoiseCanvas } from "@/components/effects/NoiseCanvas";
import { FlickerLayer } from "@/components/effects/FlickerLayer";

export function VhsEffects() {
  return (
    <>
      <NoiseCanvas />
      <FlickerLayer />
    </>
  );
}
