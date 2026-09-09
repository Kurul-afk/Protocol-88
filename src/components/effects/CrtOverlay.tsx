// src/components/effects/CrtOverlay.tsx
export function CrtOverlay() {
  return (
    <>
      {/* виньетка кинескопа */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[51] [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0)_50%,rgba(0,0,0,0.65)_100%)]"
      />
      {/* хроматическая аберрация — тонкие цветные полосы у самых краёв */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[51] mix-blend-screen opacity-40 [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0)_85%,rgba(255,0,60,0.08)_100%),radial-gradient(ellipse_at_center,rgba(0,0,0,0)_85%,rgba(0,180,255,0.08)_100%)] [background-position:-2px_0,2px_0] [background-size:100%_100%]"
      />
      {/* скан-линии */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[52] mix-blend-multiply [animation:scanshift_9s_linear_infinite] [background:repeating-linear-gradient(to_bottom,rgba(0,0,0,0)_0px,rgba(0,0,0,0)_1px,rgba(0,0,0,0.18)_2px,rgba(0,0,0,0.18)_3px)]"
      />
      {/* лёгкая выпуклость экрана — затемнение по самому краю рамки */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[51] shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]"
      />
    </>
  );
}
