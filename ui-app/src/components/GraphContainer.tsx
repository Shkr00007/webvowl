import { useEffect, useRef, useState } from "react";
import { mountWebVowlBlackBox } from "services/webvowlEngine";
import type { GraphNode } from "types/app";

type GraphContainerProps = {
  selectedNode: GraphNode | null;
  onNodeClick: (node: GraphNode) => void;
};

const fallbackNodes: GraphNode[] = [
  { id: "person", label: "Person", type: "Class", connections: 12 },
  { id: "organization", label: "Organization", type: "Class", connections: 7 },
  { id: "worksFor", label: "worksFor", type: "Property", connections: 5 }
];

export const GraphContainer = ({ selectedNode, onNodeClick }: GraphContainerProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("Mounting graph engine...");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    mountWebVowlBlackBox(host)
      .then(() => setStatus("WebVOWL engine ready"))
      .catch(() => setStatus("WebVOWL engine unavailable"));
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-panel p-4 shadow-lg shadow-black/20">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
        <span>Graph Engine</span>
        <span>{status}</span>
      </div>

      <div ref={hostRef} className="h-[62vh] w-full rounded-xl border border-border bg-surface" />

      <div className="mt-3 rounded-xl border border-border bg-surface p-3">
        <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Quick Node Focus</p>
        <div className="flex flex-wrap gap-2">
          {fallbackNodes.map((node) => (
            <button
              key={node.id}
              onClick={() => onNodeClick(node)}
              className="rounded-full border border-border px-3 py-1 text-xs text-slate-300 transition hover:border-accent hover:text-white"
            >
              {node.label}
            </button>
          ))}
        </div>
        {selectedNode && <p className="mt-2 text-xs text-slate-500">Focused node: {selectedNode.label}</p>}
      </div>
    </section>
  );
};
