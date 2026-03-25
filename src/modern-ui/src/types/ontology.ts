export type OntologyNodeType = "class" | "property" | "datatype" | "unknown";

export interface OntologyNode {
  id: string;
  label: string;
  type: OntologyNodeType;
  relationships?: string;
}

export interface SelectedNode {
  id: string;
  label: string;
  type: string;
  relationships: string;
}

export interface InsightCard {
  title: string;
  description: string;
  tone?: "default" | "highlight";
}
