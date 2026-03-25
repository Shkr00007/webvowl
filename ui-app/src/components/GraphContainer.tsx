import { useEffect, useRef, useState } from "react";
import { mountWebVowlBlackBox } from "services/webvowlEngine";
import type { GraphNode } from "types/app";

type GraphContainerProps = {
  selectedNode: GraphNode | null;
  onNodeClick: (node: GraphNode) => void;
};

type GraphController = {
  focusNode: (node: GraphNode | null) => void;
  setFocusMode: (enabled: boolean) => void;
  zoomBy: (delta: number) => void;
  destroy: () => void;
};

export const GraphContainer = ({ selectedNode, onNodeClick }: GraphContainerProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<GraphController | null>(null);
  const [status, setStatus] = useState("Initializing");
  const [focusMode, setFocusMode] = useState(true);
  const [hovering, setHovering] = useState(false);

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
        controller.setFocusMode(focusMode);
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

  useEffect(() => {
    controllerRef.current?.setFocusMode(focusMode);
  }, [focusMode]);

  return (
    <section className="rounded-xl border border-border bg-panel p-6 shadow-lg shadow-black/20 transition-all duration-300">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
        <span>Graph Container</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => controllerRef.current?.zoomBy(-0.05)}
            className="rounded-md border border-border px-2 py-1 transition hover:border-accent"
          >
            −
          </button>
          <button
            onClick={() => controllerRef.current?.zoomBy(0.05)}
            className="rounded-md border border-border px-2 py-1 transition hover:border-accent"
          >
            +
          </button>
          <button
            onClick={() => setFocusMode((prev) => !prev)}
            className="rounded-md border border-border px-2 py-1 transition hover:border-accent"
          >
            {focusMode ? "Focus ON" : "Focus OFF"}
          </button>
          <span>{status}</span>
        </div>
      </div>

      <div
        ref={hostRef}
        className="h-[66vh] w-full rounded-xl"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      />

      <div className="mt-3 text-xs text-slate-500 transition-opacity duration-300">
        {hovering ? "Hover preview active • click graph to inspect node" : "Graph ready"}
      </div>
    </section>
  );
};
