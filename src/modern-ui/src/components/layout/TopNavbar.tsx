const buttonClass =
  "rounded-xl border border-border bg-panel px-3 py-2 text-sm text-slate-100 transition hover:border-accent hover:text-white";

export const TopNavbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-panel/80 px-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Ontology Intelligence</p>
        <h1 className="text-lg font-semibold">WebVOWL Copilot Console</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className={buttonClass}>Upload</button>
        <button className={buttonClass}>Generate Insights</button>
        <button className={buttonClass}>Dark Mode</button>
      </div>
    </header>
  );
};
