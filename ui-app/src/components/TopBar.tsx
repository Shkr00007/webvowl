import type { GraphNode } from "types/app";

type TopBarProps = {
  selectedNode: GraphNode | null;
  executiveMode: boolean;
  onToggleExecutiveMode: () => void;
  onGenerateInsights: () => void;
};

export const TopBar = ({ selectedNode, executiveMode, onToggleExecutiveMode, onGenerateInsights }: TopBarProps) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-panel/90 px-6 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ontology Intelligence Platform</p>
        <h1 className="text-xl font-semibold text-slate-100">WebVOWL Copilot Workspace</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-slate-400 transition-colors">
          {selectedNode ? `Focused: ${selectedNode.label}` : "Focus a node"}
        </div>
        <button
          onClick={onToggleExecutiveMode}
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-slate-100 transition-all hover:border-accent hover:text-white"
        >
          Executive Mode: {executiveMode ? "ON" : "OFF"}
        </button>
        <button
          onClick={onGenerateInsights}
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-slate-100 transition-all hover:border-accent hover:text-white"
        >
          Generate Insights
        </button>
      </div>
    </header>
  );
};
