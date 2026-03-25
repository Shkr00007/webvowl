import { useEffect, useMemo, useRef, useState } from "react";
import { GraphContainer } from "components/canvas/GraphContainer";
import { TopNavbar } from "components/layout/TopNavbar";
import { NodeInsightsPanel } from "components/right/NodeInsightsPanel";
import { OntologyExplorer } from "components/sidebar/OntologyExplorer";
import { useCopilotChat } from "hooks/useCopilotChat";
import { useGraphBridge } from "hooks/useGraphBridge";
import { useThemeMode } from "hooks/useThemeMode";
import {
  buildExecutiveInsightsPrompt,
  buildNaturalSearchPrompt,
  generateWithOllama
} from "services/ollama";
import type { InsightCard, OntologyNode } from "types/ontology";

const defaultCards: InsightCard[] = [
  { title: "Key Entities", description: "Generate insights to extract top business entities.", tone: "highlight" },
  { title: "Relationships", description: "Relationship summary will appear here." },
  { title: "Risks", description: "Risk and ambiguity signals will appear here." }
];

const parseInsights = (text: string): InsightCard[] => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (!lines.length) return defaultCards;

  return [
    { title: "Key Entities", description: lines[0] ?? "No key entities found.", tone: "highlight" },
    { title: "Relationships", description: lines[1] ?? "No relationship summary available." },
    { title: "Risks", description: lines[2] ?? "No major risks detected." }
  ];
};

export const AppShell = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    iframeRef,
    graphLoaded,
    selectedNode,
    ontologyNodes,
    focusNode,
    highlightNodes,
    toggleFocusMode,
    getOntologySnapshot
  } = useGraphBridge();
  const { messages, isLoading, error, askCopilot, explainNode } = useCopilotChat();
  const { theme, toggleTheme } = useThemeMode();

  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [insightCards, setInsightCards] = useState<InsightCard[]>(defaultCards);
  const [recentNodes, setRecentNodes] = useState<OntologyNode[]>([]);

  useEffect(() => {
    if (!selectedNode) return;
    if (focusModeEnabled) {
      toggleFocusMode(true);
    }

    const existing = ontologyNodes.find((node) => node.id === selectedNode.id || node.label === selectedNode.label);
    if (existing) {
      setRecentNodes((previous) => [existing, ...previous.filter((node) => node.id !== existing.id)].slice(0, 5));
    }

    void explainNode(selectedNode);
  }, [selectedNode, explainNode, focusModeEnabled, toggleFocusMode, ontologyNodes]);

  const onToggleFocusMode = () => {
    const next = !focusModeEnabled;
    setFocusModeEnabled(next);
    toggleFocusMode(next);
  };

  const onGenerateInsights = async () => {
    setInsightsLoading(true);
    try {
      const snapshot = getOntologySnapshot();
      const prompt = buildExecutiveInsightsPrompt(snapshot);
      const response = await generateWithOllama(prompt);
      setInsightCards(parseInsights(response));
    } finally {
      setInsightsLoading(false);
    }
  };

  const onNaturalSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearchLoading(true);
    try {
      const prompt = buildNaturalSearchPrompt(
        query,
        ontologyNodes.map((node) => node.id)
      );
      const response = await generateWithOllama(prompt);
      const matchedIds = response
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

      if (matchedIds.length) {
        highlightNodes(matchedIds);
        focusNode(matchedIds[0]);
        return;
      }

      const fallback = ontologyNodes
        .filter((node) => node.label.toLowerCase().includes(query.toLowerCase()))
        .map((node) => node.id);
      highlightNodes(fallback);
      if (fallback[0]) {
        focusNode(fallback[0]);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const onExportInsights = () => {
    const exportContent = insightCards.map((card) => `## ${card.title}\n${card.description}`).join("\n\n");
    const blob = new Blob([exportContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ontology-executive-brief.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onUploadChange = () => {
    const iframeWindow = iframeRef.current?.contentWindow;
    const iframeDoc = iframeRef.current?.contentDocument;
    const uploadInput = iframeDoc?.getElementById("file-converter-input") as HTMLInputElement | null;
    if (!iframeWindow || !uploadInput || !fileInputRef.current?.files?.length) return;

    const dataTransfer = new iframeWindow.DataTransfer();
    dataTransfer.items.add(fileInputRef.current.files[0]);
    uploadInput.files = dataTransfer.files;
    uploadInput.dispatchEvent(new iframeWindow.Event("change", { bubbles: true }));
  };

  const nodeCountLabel = useMemo(() => `${ontologyNodes.length} nodes`, [ontologyNodes.length]);

  return (
    <div className="grid h-screen grid-rows-[auto,1fr] bg-surface text-slate-900 dark:text-slate-100">
      <TopNavbar
        theme={theme}
        onToggleTheme={toggleTheme}
        focusModeEnabled={focusModeEnabled}
        onToggleFocusMode={onToggleFocusMode}
        onGenerateInsights={onGenerateInsights}
        onExportInsights={onExportInsights}
        onUploadClick={onUploadClick}
        insightsLoading={insightsLoading}
      />
      <input ref={fileInputRef} type="file" className="hidden" onChange={onUploadChange} />
      <main className="grid h-full grid-cols-[300px,1fr,380px] gap-4 p-4">
        <OntologyExplorer
          nodes={ontologyNodes}
          recentNodes={recentNodes}
          onNodeSelect={focusNode}
          onNaturalSearch={onNaturalSearch}
          isSearching={searchLoading}
        />
        <div className="grid grid-rows-[1fr,auto] gap-3">
          <GraphContainer iframeRef={iframeRef} isLoaded={graphLoaded} focusModeEnabled={focusModeEnabled} />
          <div className="rounded-xl border border-border bg-panel px-3 py-2 text-xs text-slate-400">
            {graphLoaded ? `Graph loaded • ${nodeCountLabel}` : "Waiting for WebVOWL runtime..."}
          </div>
        </div>
        <NodeInsightsPanel
          selectedNode={selectedNode}
          messages={messages}
          isLoading={isLoading}
          error={error}
          insightCards={insightCards}
          onSendMessage={askCopilot}
        />
      </main>
    </div>
  );
};
