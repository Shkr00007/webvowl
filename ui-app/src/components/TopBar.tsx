import type { GraphNode } from "types/app";

type TopBarProps = {
  selectedNode: GraphNode | null;
  onGenerateInsights: () => void;
};

export const TopBar = ({ selectedNode, onGenerateInsights }: TopBarProps) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-panel/90 px-5 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ontology Intelligence</p>
        <h1 className="text-lg font-semibold text-slate-100">Executive Graph Console</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-slate-300">
          {selectedNode ? `Selected: ${selectedNode.label}` : "No node selected"}
        </div>
        <button
          onClick={onGenerateInsights}
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-slate-100 transition hover:border-accent hover:text-white"
        >
          Generate Insights
        </button>
      </div>
    </header>
  );
};
