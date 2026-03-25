import { useMemo, useState } from "react";
import type { OntologyNode } from "types/ontology";

type OntologyExplorerProps = {
  nodes: OntologyNode[];
  onNodeSelect: (nodeId: string) => void;
  onNaturalSearch: (query: string) => Promise<void>;
  isSearching: boolean;
};

export const OntologyExplorer = ({ nodes, onNodeSelect, onNaturalSearch, isSearching }: OntologyExplorerProps) => {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");

  const filteredNodes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return nodes;
    return nodes.filter((node) => `${node.label} ${node.type}`.toLowerCase().includes(normalized));
  }, [nodes, query]);

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-border bg-panel p-4 shadow-soft">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Ontology Explorer</h2>
      <input
        className="mb-3 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none ring-accent/50 focus:ring"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter nodes"
      />
      <form
        className="mb-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void onNaturalSearch(aiQuery);
        }}
      >
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none ring-accent/50 focus:ring"
          value={aiQuery}
          onChange={(event) => setAiQuery(event.target.value)}
          placeholder="AI search (e.g. fraud policies)"
        />
        <button
          type="submit"
          className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-slate-200 transition hover:border-accent"
          disabled={isSearching}
        >
          {isSearching ? "..." : "AI"}
        </button>
      </form>
      <ul className="space-y-2 overflow-y-auto">
        {filteredNodes.map((node) => (
          <li key={node.id}>
            <button
              onClick={() => onNodeSelect(node.id)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-left text-sm transition hover:border-accent"
            >
              <span className="font-medium">{node.label}</span>
              <span className="ml-2 text-xs text-slate-400">{node.type}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
