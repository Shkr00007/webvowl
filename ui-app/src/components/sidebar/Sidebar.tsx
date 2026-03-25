export const Sidebar = () => {
  return (
    <aside className="rounded-2xl border border-border bg-panel p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Explorer</h2>
      <input
        placeholder="Search nodes"
        className="mb-4 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
      />
      <div className="space-y-2 text-sm text-slate-300">
        <div className="rounded-xl border border-border bg-surface px-3 py-2">Person</div>
        <div className="rounded-xl border border-border bg-surface px-3 py-2">Organization</div>
        <div className="rounded-xl border border-border bg-surface px-3 py-2">worksFor</div>
      </div>
    </aside>
  );
};
