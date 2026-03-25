import { useCallback, useEffect, useMemo, useState } from "react";
import { AICopilot } from "components/AICopilot";
import { GraphContainer } from "components/GraphContainer";
import { Sidebar } from "components/Sidebar";
import { TopBar } from "components/TopBar";
import { askOllama } from "services/ollama";
import { AppStateProvider, useAppState } from "state/AppStateContext";
import type { AIMessage, GraphNode } from "types/app";

const createMessage = (role: AIMessage["role"], content: string): AIMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  createdAt: Date.now()
});

const AppContent = () => {
  const { state, dispatch } = useAppState();
  const [executiveMode, setExecutiveMode] = useState(false);

  const sendUserMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      dispatch({ type: "appendAiMessage", payload: createMessage("user", content) });
      dispatch({ type: "setAiLoading", payload: true });

      try {
        const response = await askOllama(content);
        dispatch({ type: "appendAiMessage", payload: createMessage("assistant", response) });
      } catch {
        dispatch({ type: "appendAiMessage", payload: createMessage("assistant", "AI service is currently unavailable.") });
      } finally {
        dispatch({ type: "setAiLoading", payload: false });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!state.selectedNode) return;

    const prompt = `Explain this node in business terms with exactly 3 lines:\n1) What it is\n2) Why it matters\n3) Business impact\nNode: ${state.selectedNode.label}, type ${state.selectedNode.type}, connections ${state.selectedNode.connections}.`;
    void sendUserMessage(prompt);
  }, [state.selectedNode, sendUserMessage]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      dispatch({ type: "setSelectedNode", payload: node });
    },
    [dispatch]
  );

  const handleQuickAction = useCallback(
    async (action: "explain" | "risks" | "dependencies") => {
      if (!state.selectedNode) return;
      const base = `Node ${state.selectedNode.label} (${state.selectedNode.type}) with ${state.selectedNode.connections} connections.`;
      const promptByAction = {
        explain: `${base} Explain clearly for a CXO audience in plain language.`,
        risks: `${base} Identify potential risks, compliance issues, and blind spots.`,
        dependencies: `${base} Summarize key dependencies and relationship bottlenecks.`
      };
      await sendUserMessage(promptByAction[action]);
    },
    [sendUserMessage, state.selectedNode]
  );

  const visibleNodes = useMemo(() => {
    if (!executiveMode) return state.graphData.nodes;
    return [...state.graphData.nodes].sort((a, b) => b.connections - a.connections).slice(0, 2);
  }, [executiveMode, state.graphData.nodes]);

  const insights = useMemo(() => {
    const sorted = [...state.graphData.nodes].sort((a, b) => b.connections - a.connections);
    const keyEntities = sorted.slice(0, 3).map((node) => node.label);
    const riskNodes = sorted.filter((node) => node.connections >= 7).map((node) => node.label);
    const importantRelationships = state.graphData.nodes
      .filter((node) => node.type === "Property")
      .map((node) => node.label)
      .slice(0, 3);

    return {
      keyEntities,
      riskNodes,
      importantRelationships
    };
  }, [state.graphData.nodes]);

  return (
    <div className="grid h-screen grid-rows-[auto,1fr] bg-surface text-slate-100 transition-colors duration-300">
      <TopBar
        selectedNode={state.selectedNode}
        executiveMode={executiveMode}
        onToggleExecutiveMode={() => setExecutiveMode((prev) => !prev)}
        onGenerateInsights={() => {
          void sendUserMessage("Summarize this ontology for business stakeholders including key entities, risks, and important connections.");
        }}
      />

      <main className="grid grid-cols-[320px,1fr,420px] gap-6 p-6">
        <Sidebar
          nodes={visibleNodes}
          selectedNodeId={state.selectedNode?.id}
          onSelectNode={handleNodeClick}
        />
        <GraphContainer selectedNode={state.selectedNode} executiveMode={executiveMode} onNodeClick={handleNodeClick} />
        <AICopilot
          selectedNode={state.selectedNode}
          messages={state.aiMessages}
          loading={state.aiLoading}
          insights={insights}
          onSendMessage={sendUserMessage}
          onQuickAction={handleQuickAction}
        />
      </main>
    </div>
  );
};

const App = () => (
  <AppStateProvider>
    <AppContent />
  </AppStateProvider>
);

export default App;
