import { useMemo, useRef, useState } from "react";
import type { ChatMessage } from "types/chat";
import type { InsightCard, SelectedNode } from "types/ontology";

type NodeInsightsPanelProps = {
  selectedNode: SelectedNode | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  insightCards: InsightCard[];
  onSendMessage: (message: string) => Promise<void>;
};

export const NodeInsightsPanel = ({
  selectedNode,
  messages,
  isLoading,
  error,
  insightCards,
  onSendMessage
}: NodeInsightsPanelProps) => {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const header = useMemo(() => {
    if (!selectedNode) return "No node selected";
    return `${selectedNode.label} • ${selectedNode.type}`;
  }, [selectedNode]);

  return (
    <aside className="grid h-full grid-rows-[auto,auto,1fr,auto] gap-3 rounded-2xl border border-border bg-panel p-4 shadow-soft">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Node Insights</h2>
        <div className="mt-2 rounded-xl border border-border bg-surface p-3 text-sm text-slate-300">{header}</div>
      </section>

      <section className="grid gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Executive Insights</h3>
        <div className="grid gap-2">
          {insightCards.map((card) => (
            <article
              key={card.title}
              className={`rounded-xl border border-border p-3 text-sm ${card.tone === "highlight" ? "bg-accent/10" : "bg-surface"}`}
            >
              <h4 className="mb-1 font-semibold text-slate-100">{card.title}</h4>
              <p className="text-slate-300">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section ref={scrollRef} className="overflow-y-auto rounded-xl border border-border bg-surface p-3">
        {messages.map((message) => (
          <div key={message.id} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                message.role === "user" ? "bg-accent text-white" : "bg-panel text-slate-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && <p className="text-xs text-slate-400">Copilot is thinking...</p>}
        {error && <p className="text-xs text-rose-300">{error}</p>}
      </section>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void onSendMessage(draft);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none ring-accent/50 focus:ring"
          placeholder="Ask AI Copilot"
        />
        <button className="rounded-xl border border-border bg-surface px-3 py-2 text-xs hover:border-accent">Send</button>
      </form>
    </aside>
  );
};
