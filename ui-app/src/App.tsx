import { useCallback, useEffect } from "react";
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

    const prompt = `Explain this node in business terms. Node: ${state.selectedNode.label}. Type: ${state.selectedNode.type}. Connections: ${state.selectedNode.connections}.`;
    void sendUserMessage(prompt);
  }, [state.selectedNode, sendUserMessage]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      dispatch({ type: "setSelectedNode", payload: node });
    },
    [dispatch]
  );

  const handleQuickAction = useCallback(
    async (action: "explain" | "relationships" | "risks") => {
      if (!state.selectedNode) return;
      const base = `Node ${state.selectedNode.label} (${state.selectedNode.type}).`;
      const promptByAction = {
        explain: `${base} Explain this concept for business users in concise terms.`,
        relationships: `${base} List important relationships and what they imply operationally.`,
        risks: `${base} Identify key risks, ambiguities, and governance concerns.`
      };
      await sendUserMessage(promptByAction[action]);
    },
    [sendUserMessage, state.selectedNode]
  );

  return (
    <div className="grid h-screen grid-rows-[auto,1fr] bg-surface text-slate-100 transition-colors duration-300">
      <TopBar
        selectedNode={state.selectedNode}
        onGenerateInsights={() => {
          void sendUserMessage("Summarize this ontology for business stakeholders including key entities, risks, and important connections.");
        }}
      />

      <main className="grid grid-cols-[320px,1fr,420px] gap-6 p-6">
        <Sidebar
          nodes={state.graphData.nodes}
          selectedNodeId={state.selectedNode?.id}
          onSelectNode={handleNodeClick}
        />
        <GraphContainer selectedNode={state.selectedNode} onNodeClick={handleNodeClick} />
        <AICopilot
          selectedNode={state.selectedNode}
          messages={state.aiMessages}
          loading={state.aiLoading}
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
