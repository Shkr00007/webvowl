import type { GraphNode } from "types/graph";

type SidebarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  nodes: GraphNode[];
};

export const Sidebar = ({ query, onQueryChange, nodes }: SidebarProps) => {
  return (
    <aside className="rounded-2xl border border-border bg-panel p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Explorer</h2>
      <input
        placeholder="Search nodes"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="mb-4 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
      />
      <div className="space-y-2 text-sm text-slate-300">
        {nodes.map((node) => (
          <div key={node.id} className="rounded-xl border border-border bg-surface px-3 py-2">
            {node.label}
          </div>
        ))}
      </div>
    </aside>
  );
};
