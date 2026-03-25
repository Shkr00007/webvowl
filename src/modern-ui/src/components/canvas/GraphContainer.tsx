import { memo } from "react";

import type { RefObject } from "react";

type GraphContainerProps = {
  iframeRef: RefObject<HTMLIFrameElement>;
  isLoaded: boolean;
  focusModeEnabled: boolean;
};

export const GraphContainer = memo(({ iframeRef, isLoaded, focusModeEnabled }: GraphContainerProps) => {
  return (
    <section className="relative h-full rounded-2xl border border-border bg-panel p-3 shadow-soft">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
        <span>Graph Canvas</span>
        <span>{isLoaded ? "Interactive" : "Loading"}</span>
      </div>
      <iframe
        ref={iframeRef}
        title="WebVOWL Graph"
        className="h-[calc(100%-1.5rem)] w-full rounded-xl border border-border bg-surface"
      />
      {focusModeEnabled && (
        <div className="pointer-events-none absolute right-6 top-6 rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">
          Focus Mode ON
        </div>
      )}
    </section>
  );
});
