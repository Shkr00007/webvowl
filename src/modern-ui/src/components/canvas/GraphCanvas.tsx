import { useEffect } from "react";
import { mountWebVowlGraph } from "services/webvowlBridge";

const GRAPH_HOST_ID = "webvowl-graph-host";

export const GraphCanvas = () => {
  useEffect(() => {
    mountWebVowlGraph(GRAPH_HOST_ID);
  }, []);

  return (
    <section className="h-full rounded-2xl border border-border bg-panel p-3 shadow-soft">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
        <span>Graph Canvas</span>
        <span>WebVOWL Embedded</span>
      </div>
      <div id={GRAPH_HOST_ID} className="h-[calc(100%-1.5rem)] rounded-xl border border-border bg-surface" />
    </section>
  );
};
