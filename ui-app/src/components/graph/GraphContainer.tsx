import { useEffect, useRef, useState } from "react";
import { mountWebVowlBlackBox } from "services/webvowlEngine";

import type { GraphSelection } from "types/graph";

type GraphContainerProps = {
  onSelectionChange: (selection: GraphSelection) => void;
};

export const GraphContainer = ({ onSelectionChange }: GraphContainerProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("Loading WebVOWL engine...");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    mountWebVowlBlackBox(host)
      .then(() => setStatus("WebVOWL engine mounted"))
      .catch(() => setStatus("WebVOWL engine unavailable in this environment"));

    // Placeholder event to demonstrate the React event bridge contract.
    onSelectionChange({ label: "Person", type: "Class", relationships: "worksFor -> Organization" });
  }, [onSelectionChange]);

  return (
    <section className="rounded-2xl border border-border bg-panel p-3">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
        <span>Graph</span>
        <span>{status}</span>
      </div>
      <div ref={hostRef} className="h-[74vh] w-full" />
    </section>
  );
};
