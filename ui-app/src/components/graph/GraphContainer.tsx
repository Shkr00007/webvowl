import { useEffect, useRef } from "react";
import type { GraphSelection } from "types/graph";

type GraphContainerProps = {
  onSelectionChange: (selection: GraphSelection) => void;
};

export const GraphContainer = ({ onSelectionChange }: GraphContainerProps) => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = frameRef.current;
    if (!iframe) return;

    iframe.src = "/index.html#foaf";

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const nameElement = doc.getElementById("summaryNodeName");
      if (!nameElement) return;

      const readText = (id: string) => doc.getElementById(id)?.textContent?.trim() ?? "-";
      const observer = new MutationObserver(() => {
        const label = readText("summaryNodeName");
        if (label === "-") return;
        onSelectionChange({
          label,
          type: readText("summaryNodeType"),
          relationships: readText("summaryNodeRelationships")
        });
      });

      observer.observe(nameElement, { childList: true, characterData: true, subtree: true });
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [onSelectionChange]);

  return (
    <section className="rounded-2xl border border-border bg-panel p-3">
      <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">Graph</div>
      <iframe ref={frameRef} title="Embedded WebVOWL" className="h-[74vh] w-full rounded-xl border border-border bg-surface" />
    </section>
  );
};
