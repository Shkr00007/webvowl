import { useState } from "react";
import type { ChatMessage } from "types/chat";

type CopilotPanelProps = {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (message: string) => Promise<void>;
};

export const CopilotPanel = ({ messages, loading, error, onSend }: CopilotPanelProps) => {
  const [draft, setDraft] = useState("");

  return (
    <aside className="grid grid-rows-[auto,1fr,auto] rounded-2xl border border-border bg-panel p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Copilot</h2>
      <div className="mt-3 overflow-y-auto rounded-xl border border-border bg-surface p-3">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${message.role === "user" ? "bg-accent" : "bg-panel"}`}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400">Thinking...</p>}
        {error && <p className="text-xs text-rose-300">{error}</p>}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void onSend(draft);
          setDraft("");
        }}
      >
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
          placeholder="Ask about this ontology"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="rounded-xl border border-border bg-surface px-3 py-2 text-sm hover:border-accent">Send</button>
      </form>
    </aside>
  );
};
