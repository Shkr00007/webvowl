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
    if (!selectedNode) return "Choose a node to trigger automatic explanation";
    return `Analyzing: ${selectedNode.label}`;
  }, [selectedNode]);

  return (
    <aside className="grid grid-rows-[auto,1fr,auto] rounded-2xl border border-border bg-panel p-4 shadow-lg shadow-black/20">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Copilot</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>

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
        {loading && <div className="animate-pulse text-xs text-slate-400">Generating response...</div>}
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
          placeholder="Ask for ontology insights"
        />
        <button className="rounded-xl border border-border bg-surface px-3 py-2 text-sm transition hover:border-accent hover:text-white">
          Send
        </button>
      </form>
    </aside>
  );
};
