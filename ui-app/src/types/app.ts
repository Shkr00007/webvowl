export interface GraphNode {
  id: string;
  label: string;
  type: "Class" | "Property" | "Datatype";
  connections: number;
}

export interface GraphData {
  nodes: GraphNode[];
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}
