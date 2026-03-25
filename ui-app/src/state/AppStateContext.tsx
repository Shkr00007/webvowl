import { createContext, useContext, useMemo, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import type { AIMessage, GraphData, GraphNode } from "types/app";

type AppState = {
  selectedNode: GraphNode | null;
  graphData: GraphData;
  aiMessages: AIMessage[];
  aiLoading: boolean;
};

type AppAction =
  | { type: "setSelectedNode"; payload: GraphNode | null }
  | { type: "setGraphData"; payload: GraphData }
  | { type: "setAiLoading"; payload: boolean }
  | { type: "appendAiMessage"; payload: AIMessage }
  | { type: "replaceAiMessages"; payload: AIMessage[] };

const defaultGraphData: GraphData = {
  nodes: [
    { id: "person", label: "Person", type: "Class", connections: 12 },
    { id: "organization", label: "Organization", type: "Class", connections: 7 },
    { id: "worksFor", label: "worksFor", type: "Property", connections: 5 }
  ]
};

const initialState: AppState = {
  selectedNode: null,
  graphData: defaultGraphData,
  aiMessages: [
    {
      id: "assistant-initial",
      role: "assistant",
      content: "Select a node and I will explain it in business terms.",
      createdAt: Date.now()
    }
  ],
  aiLoading: false
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "setSelectedNode":
      return { ...state, selectedNode: action.payload };
    case "setGraphData":
      return { ...state, graphData: action.payload };
    case "setAiLoading":
      return { ...state, aiLoading: action.payload };
    case "appendAiMessage":
      return { ...state, aiMessages: [...state.aiMessages, action.payload] };
    case "replaceAiMessages":
      return { ...state, aiMessages: action.payload };
    default:
      return state;
  }
};

const AppStateContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> } | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used inside AppStateProvider");
  return context;
};
