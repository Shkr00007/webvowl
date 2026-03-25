import { TopNavbar } from "components/layout/TopNavbar";
import { GraphCanvas } from "components/canvas/GraphCanvas";
import { OntologyExplorer } from "components/sidebar/OntologyExplorer";
import { NodeInsightsPanel } from "components/right/NodeInsightsPanel";

export const AppShell = () => {
  return (
    <div className="grid h-screen grid-rows-[auto,1fr] bg-surface">
      <TopNavbar />
      <main className="grid h-full grid-cols-[280px,1fr,340px] gap-4 p-4">
        <OntologyExplorer />
        <GraphCanvas />
        <NodeInsightsPanel />
      </main>
    </div>
  );
};
