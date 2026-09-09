import { InstructionsScreen } from "@/components/screens/InstructionsScreen";
import React, { Suspense } from "react";

export default function Instructions() {
  return (
    <Suspense fallback={null}>
      <InstructionsScreen />
    </Suspense>
  );
}
