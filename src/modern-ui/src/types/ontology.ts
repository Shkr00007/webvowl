export type OntologyNodeType = "class" | "property" | "datatype";

export interface OntologyNode {
  id: string;
  label: string;
  type: OntologyNodeType;
  description?: string;
}
