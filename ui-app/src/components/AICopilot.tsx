import { useMemo, useState } from "react";
import type { AIMessage, GraphNode } from "types/app";

type InsightsData = {
  keyEntities: string[];
  riskNodes: string[];
  importantRelationships: string[];
};

type AICopilotProps = {
  selectedNode: GraphNode | null;
  messages: AIMessage[];
  loading: boolean;
  insights: InsightsData;
  onSendMessage: (message: string) => Promise<void>;
  onQuickAction: (action: "explain" | "risks" | "dependencies") => Promise<void>;
};

const parseSections = (text: string) => {
  const lines = text.split("\n").filter(Boolean);
  return {
    what: lines[0] ?? text,
    why: lines[1] ?? "Business significance not yet available.",
    impact: lines[2] ?? "Operational impact not yet available."
  };
};

export const AICopilot = ({ selectedNode, messages, loading, insights, onSendMessage, onQuickAction }: AICopilotProps) => {
  const [draft, setDraft] = useState("");

  const subtitle = useMemo(() => {
    if (!selectedNode) return "Select a node for automatic explanation";
    return `Analyzing node: ${selectedNode.label}`;
  }, [selectedNode]);

  const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const sections = parseSections(latestAssistant?.content ?? "No AI insight yet.");

  return (
    <aside className="grid grid-rows-[auto,auto,1fr,auto] rounded-xl border border-border bg-panel p-6 shadow-lg shadow-black/20">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">AI Copilot</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>

      <section className="mt-4 rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={() => void onQuickAction("explain")} className="rounded-full border border-border px-3 py-1 text-xs transition hover:border-accent">Explain</button>
          <button onClick={() => void onQuickAction("risks")} className="rounded-full border border-border px-3 py-1 text-xs transition hover:border-accent">Find risks</button>
          <button onClick={() => void onQuickAction("dependencies")} className="rounded-full border border-border px-3 py-1 text-xs transition hover:border-accent">Show dependencies</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-3 animate-pulse rounded bg-slate-700/50" />
            <div className="h-3 animate-pulse rounded bg-slate-700/40" />
            <div className="h-3 animate-pulse rounded bg-slate-700/30" />
          </div>
        ) : (
          <div className="grid gap-2 text-sm">
            <article className="rounded-lg border border-border p-3"><strong>What it is:</strong> {sections.what}</article>
            <article className="rounded-lg border border-border p-3"><strong>Why it matters:</strong> {sections.why}</article>
            <article className="rounded-lg border border-border p-3"><strong>Impact:</strong> {sections.impact}</article>
          </div>
        )}
      </section>

      <section className="mt-4 grid gap-2 rounded-xl border border-border bg-surface p-4 text-sm">
        <h3 className="text-xs uppercase tracking-wider text-slate-500">Executive Insights</h3>
        <p><strong>Key entities:</strong> {insights.keyEntities.join(", ") || "N/A"}</p>
        <p><strong>Risk nodes:</strong> {insights.riskNodes.join(", ") || "N/A"}</p>
        <p><strong>Important relationships:</strong> {insights.importantRelationships.join(", ") || "N/A"}</p>
      </section>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void onSendMessage(draft);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent"
          placeholder="Ask a question about this ontology"
        />
        <button className="rounded-xl border border-border bg-surface px-3 py-2 text-sm transition hover:border-accent hover:text-white">
          Send
        </button>
      </form>
    </aside>
  );
};
