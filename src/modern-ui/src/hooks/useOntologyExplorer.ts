import { useMemo, useState } from "react";
import type { OntologyNode } from "types/ontology";

const seedNodes: OntologyNode[] = [
  { id: "Person", label: "Person", type: "class" },
  { id: "Organization", label: "Organization", type: "class" },
  { id: "worksFor", label: "worksFor", type: "property" },
  { id: "xsd:string", label: "xsd:string", type: "datatype" }
];

export const useOntologyExplorer = () => {
  const [query, setQuery] = useState("");

  const filteredNodes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return seedNodes;
    return seedNodes.filter((node) => node.label.toLowerCase().includes(normalized));
  }, [query]);

  return {
    nodes: filteredNodes,
    query,
    setQuery
  };
};
