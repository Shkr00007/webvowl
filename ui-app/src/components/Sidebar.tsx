import type { GraphNode } from "types/app";

type SidebarProps = {
  nodes: GraphNode[];
  selectedNodeId?: string;
  onSelectNode: (node: GraphNode) => void;
};

const iconByType: Record<GraphNode["type"], string> = {
  Class: "⬢",
  Property: "⇄",
  Datatype: "◈"
};

export const Sidebar = ({ nodes, selectedNodeId, onSelectNode }: SidebarProps) => {
  const classNodes = nodes.filter((node) => node.type === "Class");
  const propertyNodes = nodes.filter((node) => node.type !== "Class");

  const renderNode = (node: GraphNode) => {
    const active = node.id === selectedNodeId;
    return (
      <button
        key={node.id}
        onClick={() => onSelectNode(node)}
        className={`w-full rounded-xl border px-3 py-2 text-left transition-all duration-200 ${
          active
            ? "border-accent bg-accent/10 text-slate-100 shadow-md shadow-accent/20"
            : "border-border bg-surface text-slate-300 hover:border-accent hover:shadow"
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
  };

  return (
    <aside className="rounded-xl border border-border bg-panel p-4 shadow-lg shadow-black/20">
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-slate-100">Ontology Explorer</h2>

      <section className="mb-4">
        <h3 className="mb-2 text-xs uppercase tracking-wider text-slate-500">Classes</h3>
        <div className="space-y-2">{classNodes.map(renderNode)}</div>
      </section>

      <section>
        <h3 className="mb-2 text-xs uppercase tracking-wider text-slate-500">Properties & Datatypes</h3>
        <div className="space-y-2">{propertyNodes.map(renderNode)}</div>
      </section>
    </aside>
  );
};
