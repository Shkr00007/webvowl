import { useMemo, useState } from "react";
import type { GraphNode } from "types/graph";

const defaultNodes: GraphNode[] = [
  { id: "Person", label: "Person" },
  { id: "Organization", label: "Organization" },
  { id: "worksFor", label: "worksFor" }
];

export const useNodeList = () => {
  const [query, setQuery] = useState("");

  const nodes = useMemo(() => {
    if (!query.trim()) return defaultNodes;
    return defaultNodes.filter((node) => node.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return {
    query,
    setQuery,
    nodes
  };
};
