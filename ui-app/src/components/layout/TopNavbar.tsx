export const TopNavbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-panel/80 px-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Ontology Intelligence Platform</p>
        <h1 className="text-lg font-semibold">WebVOWL React Workspace</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-xl border border-border bg-surface px-3 py-2 text-sm hover:border-accent">Upload</button>
        <button className="rounded-xl border border-border bg-surface px-3 py-2 text-sm hover:border-accent">Generate Insights</button>
      </div>
    </header>
  );
};
