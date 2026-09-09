// src/components/effects/GlitchPhoto.tsx
import Image from "next/image";

interface GlitchPhotoProps {
  src: string;
  alt?: string;
}

export function GlitchPhoto({ src, alt = "" }: GlitchPhotoProps) {
  return (
    <div className="relative mx-auto mb-6 h-[230px] w-[230px] overflow-hidden border border-[var(--grey)] bg-[#050505]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="230px"
        className="object-cover [filter:grayscale(0.85)_contrast(1.25)_brightness(0.7)_sepia(0.08)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(to_bottom,rgba(0,0,0,0)_0,rgba(0,0,0,0)_2px,rgba(0,0,0,0.35)_3px)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.8)_100%)]"
      />
    </div>
  );
}
