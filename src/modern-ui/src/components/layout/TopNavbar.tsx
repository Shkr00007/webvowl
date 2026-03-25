type TopNavbarProps = {
  focusModeEnabled: boolean;
  onToggleFocusMode: () => void;
  onGenerateInsights: () => Promise<void>;
  onExportInsights: () => void;
  onUploadClick: () => void;
  onToggleTheme: () => void;
  theme: "dark" | "light";
  insightsLoading: boolean;
};

const buttonClass =
  "rounded-xl border border-border bg-panel px-3 py-2 text-sm text-slate-100 transition hover:border-accent hover:text-white dark:bg-panel dark:text-slate-100";

export const TopNavbar = ({
  focusModeEnabled,
  onToggleFocusMode,
  onGenerateInsights,
  onExportInsights,
  onUploadClick,
  onToggleTheme,
  theme,
  insightsLoading
}: TopNavbarProps) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-panel/80 px-4 backdrop-blur dark:bg-panel/80">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Ontology Intelligence</p>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">WebVOWL Copilot Console</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className={buttonClass} onClick={onUploadClick}>Upload</button>
        <button className={buttonClass} onClick={() => void onGenerateInsights()} disabled={insightsLoading}>
          {insightsLoading ? "Generating..." : "Generate Insights"}
        </button>
        <button className={buttonClass} onClick={onExportInsights}>Export Brief</button>
        <button className={buttonClass} onClick={onToggleFocusMode}>
          Focus Mode: {focusModeEnabled ? "ON" : "OFF"}
        </button>
        <button className={buttonClass} onClick={onToggleTheme}>
          {theme === "dark" ? "Light" : "Dark"} Theme
        </button>
      </div>
    </header>
  );
};
