"use client";

import { Stamp } from "@/components/ui/Stamp";
import { TapeButton } from "@/components/ui/TapeButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VhsEffects } from "../effects/VhsEffects";
import { GlowText } from "../ui/GlowText";

export default function Hero() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleOnClick = async () => {
    if (isStarting) return;
    setIsStarting(true);

    try {
      const res = await fetch("/api/sessions", { method: "POST" });
      const { sessionId } = await res.json();
      router.push(`/instructions?sessionId=${sessionId}`);
    } catch {
      router.push("/instructions");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <VhsEffects />

      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="flex max-w-[640px] flex-col items-center gap-4 text-center">
          <Stamp />

          <h1 className="text-5xl font-bold uppercase leading-[1.15] tracking-[2px] text-[var(--paper)]">
            <GlowText>
              <span>Обязательный тест</span>
              <br />
              на идентификацию
            </GlowText>
          </h1>

          <p className="max-w-[480px] font-mono text-sm leading-relaxed text-[var(--paper-dim)]">
            Внимание: не вступайте в контакт с субъектами, имеющими искажения
            внешности. Отвечайте на вопросы без промедления.
          </p>

          <TapeButton onClick={handleOnClick}>
            [ Начать тестирование ]
          </TapeButton>

          <div className="mt-4 font-mono text-[11px] tracking-wide text-[var(--grey)]">
            ФОРМА 12-А · ПОДЛЕЖИТ УНИЧТОЖЕНИЮ ПОСЛЕ ПРОСМОТРА
          </div>
        </div>
      </div>
    </div>
  );
}
