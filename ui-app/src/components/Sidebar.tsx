import type { GraphNode } from "types/app";

type SidebarProps = {
  nodes: GraphNode[];
  selectedNodeId?: string;
  onSelectNode: (node: GraphNode) => void;
};

const iconByType: Record<GraphNode["type"], string> = {
  Class: "◼",
  Property: "↔",
  Datatype: "◻"
};

export const Sidebar = ({ nodes, selectedNodeId, onSelectNode }: SidebarProps) => {
  return (
    <aside className="rounded-2xl border border-border bg-panel p-4 shadow-lg shadow-black/20">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Node Catalog</h2>
      <div className="space-y-2">
        {nodes.map((node) => {
          const active = node.id === selectedNodeId;
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                active
                  ? "border-accent bg-accent/10 text-slate-100"
                  : "border-border bg-surface text-slate-300 hover:border-accent hover:bg-surface/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {iconByType[node.type]} {node.label}
                </span>
                <span className="text-xs text-slate-500">{node.connections}</span>
              </div>
              <p className="text-xs text-slate-500">{node.type}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
