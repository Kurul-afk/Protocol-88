export default function TestLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <div className="text-center font-mono text-sm text-[var(--paper-dim)]">
        <div className="mb-3 animate-pulse tracking-[3px] uppercase text-[var(--red-bright)]">
          ⚠ СИНХРОНИЗАЦИЯ С АРХИВОМ ⚠
        </div>
        <div>ЗАГРУЗКА ПРОТОКОЛА · ПОЖАЛУЙСТА, ОЖИДАЙТЕ</div>
      </div>
    </div>
  );
}
