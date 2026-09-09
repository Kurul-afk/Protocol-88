import { InstructionsScreen } from "@/components/features/InstructionsScreen";
import React, { Suspense } from "react";

export default function Instructions() {
  return (
    <Suspense fallback={null}>
      <InstructionsScreen />
    </Suspense>
  );
}
