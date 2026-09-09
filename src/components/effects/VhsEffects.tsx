// src/components/effects/VhsEffects.tsx
import { CrtOverlay } from "@/components/effects/CrtOverlay";
import { NoiseCanvas } from "@/components/effects/NoiseCanvas";
import { FlickerLayer } from "@/components/effects/FlickerLayer";

export function VhsEffects() {
  return (
    <>
      <NoiseCanvas />
      <CrtOverlay />
      <FlickerLayer />
    </>
  );
}
