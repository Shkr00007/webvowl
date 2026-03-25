import { useMemo, useState } from "react";
import type { AIMessage, GraphNode } from "types/app";

type AICopilotProps = {
  selectedNode: GraphNode | null;
  messages: AIMessage[];
  loading: boolean;
  onSendMessage: (message: string) => Promise<void>;
};

export const AICopilot = ({ selectedNode, messages, loading, onSendMessage }: AICopilotProps) => {
  const [draft, setDraft] = useState("");

  const subtitle = useMemo(() => {
    if (!selectedNode) return "Select a node for automatic AI explanation";
    return `Analyzing node: ${selectedNode.label}`;
  }, [selectedNode]);

  const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant");

  return (
    <aside className="grid grid-rows-[auto,auto,1fr,auto] rounded-xl border border-border bg-panel p-4 shadow-lg shadow-black/20">
      <div>
        <h2 className="text-sm font-semibold text-slate-100">AI Copilot</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>

      <section className="mt-3 rounded-xl border border-border bg-surface p-3">
        <h3 className="text-xs uppercase tracking-wider text-slate-500">Insights</h3>
        {loading ? (
          <div className="mt-2 space-y-2">
            <div className="h-3 animate-pulse rounded bg-slate-700/50" />
            <div className="h-3 animate-pulse rounded bg-slate-700/40" />
            <div className="h-3 animate-pulse rounded bg-slate-700/30" />
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-300">{latestAssistant?.content ?? "No AI insight yet."}</p>
        )}
      </section>

      <div className="mt-3 overflow-y-auto rounded-xl border border-border bg-surface p-3">
        {messages.map((message) => (
          <div key={message.id} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm transition-all ${
                message.role === "user" ? "bg-accent text-white" : "bg-panel text-slate-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
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
