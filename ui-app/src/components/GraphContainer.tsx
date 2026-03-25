import { useEffect, useRef, useState } from "react";
import { mountWebVowlBlackBox } from "services/webvowlEngine";
import type { GraphNode } from "types/app";

type GraphContainerProps = {
  selectedNode: GraphNode | null;
  onNodeClick: (node: GraphNode) => void;
};

export const GraphContainer = ({ selectedNode, onNodeClick }: GraphContainerProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<{ focusNode: (node: GraphNode | null) => void; destroy: () => void } | null>(null);
  const [status, setStatus] = useState("Initializing");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let canceled = false;

    mountWebVowlBlackBox(host, { onNodeClick })
      .then((controller) => {
        if (canceled) {
          controller.destroy();
          return;
        }
        controllerRef.current = controller;
        setStatus("Interactive");
      })
      .catch(() => setStatus("Unavailable"));

    return () => {
      canceled = true;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, [onNodeClick]);

  useEffect(() => {
    controllerRef.current?.focusNode(selectedNode);
  }, [selectedNode]);

  return (
    <section className="rounded-xl border border-border bg-panel p-4 shadow-lg shadow-black/20 transition-all duration-200">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
        <span>Graph Container</span>
        <span>{status}</span>
      </div>
      <div ref={hostRef} className="h-[68vh] w-full" />
    </section>
  );
};
