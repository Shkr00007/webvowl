export const NodeInsightsPanel = () => {
  return (
    <aside className="grid h-full grid-rows-[auto,1fr] gap-3 rounded-2xl border border-border bg-panel p-4 shadow-soft">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Node Insights</h2>
        <div className="mt-3 rounded-xl border border-border bg-surface p-3 text-sm text-slate-300">
          Select a node to inspect metadata, relations, and usage.
        </div>
      </section>
      <section className="rounded-xl border border-border bg-surface p-3 text-sm text-slate-300">
        <h3 className="mb-2 font-semibold text-slate-200">AI Copilot (Phase 2)</h3>
        <p>Chat and generated ontology insights will be enabled in the next phase.</p>
      </section>
    </aside>
  );
};
