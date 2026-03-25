import { useOntologyExplorer } from "hooks/useOntologyExplorer";

export const OntologyExplorer = () => {
  const { nodes, query, setQuery } = useOntologyExplorer();

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-border bg-panel p-4 shadow-soft">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Ontology Explorer</h2>
      <input
        className="mb-4 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none ring-accent/50 focus:ring"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search nodes"
      />
      <ul className="space-y-2 overflow-y-auto">
        {nodes.map((node) => (
          <li key={node.id} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm">
            <span className="font-medium">{node.label}</span>
            <span className="ml-2 text-xs text-slate-400">{node.type}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};
